const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

// ==========================================
// CONFIGURACIÓN DE LA API DE GROQ
// ==========================================
const GROQ_API_KEY = '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'; // ⚠️ En producción, usar variable de entorno
const GROQ_MODEL = 'llama3-70b-8192'; // Modelo disponible en Groq (puede cambiar)

let mainWindow;
let previousPrices = {}; // Almacena precios anteriores para detectar cambios bruscos

// ==========================================
// FUNCIÓN PARA CREAR LA VENTANA PRINCIPAL
// ==========================================
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // En desarrollo, carga la URL de Vite; en producción, carga el archivo compilado
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

// ==========================================
// CICLO DE VIDA DE LA APLICACIÓN
// ==========================================
app.whenReady().then(() => {
  createWindow();

  // Iniciar el monitoreo automático de precios cada 2 minutos
  setInterval(() => checkPriceAlerts(), 120000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ==========================================
// MANEJADORES IPC (Comunicación con el renderer)
// ==========================================

// Obtener precios de criptomonedas (top 100 por capitalización)
ipcMain.handle('get-crypto-prices', async () => {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
  const response = await fetch(url);
  return response.json();
});

// Enviar mensaje al chat y obtener respuesta de Groq
ipcMain.handle('send-chat-message', async (event, message) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: message }],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
});

// ==========================================
// FUNCIÓN AUXILIAR PARA OBTENER RESPUESTA DE GROQ
// ==========================================
async function getGroqResponse(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// ==========================================
// MONITOREO AUTOMÁTICO DE PRECIOS Y ALERTAS
// ==========================================
async function checkPriceAlerts() {
  if (!mainWindow) return;

  // Lista de criptomonedas a monitorear (puedes ampliarla)
  const ids = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano'];
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`;

  try {
    const res = await fetch(url);
    const prices = await res.json();

    for (const id of ids) {
      const current = prices[id].usd;
      const prev = previousPrices[id];

      if (prev && Math.abs((current - prev) / prev) > 0.02) {
        // Variación mayor al 2%
        const changePercent = ((current - prev) / prev * 100).toFixed(2);
        const prompt = `Analiza la siguiente variación y da una recomendación breve:
        Moneda: ${id}
        Precio anterior: $${prev}
        Precio actual: $${current}
        Cambio: ${changePercent}%
        Responde en español, máximo 2 frases.`;

        const alertMsg = await getGroqResponse(prompt);
        mainWindow.webContents.send('alert', {
          title: `Alerta ${id.toUpperCase()}`,
          message: alertMsg,
        });
      }

      // Actualizar el precio anterior
      previousPrices[id] = current;
    }
  } catch (error) {
    console.error('Error en monitoreo:', error);
  }
}
