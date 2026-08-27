import { useState, useEffect } from 'react';
import CryptoTable from './CryptoTable';
import ChatPanel from './ChatPanel';

export default function Dashboard() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Intentar usar la API expuesta por Electron
        if (window.electronAPI && window.electronAPI.getCryptoPrices) {
          const data = await window.electronAPI.getCryptoPrices();
          setCryptos(data);
        } else {
          // Fallback para desarrollo en navegador
          const { fetchTopCryptos } = await import('../services/cryptoAPI');
          const data = await fetchTopCryptos();
          setCryptos(data);
        }
      } catch (error) {
        console.error('Error cargando precios:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h2>Precios en tiempo real</h2>
      {loading ? <p>Cargando datos...</p> : <CryptoTable data={cryptos} />}
      <ChatPanel />
    </div>
  );
}
