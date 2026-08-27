const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getCryptoPrices: () => ipcRenderer.invoke('get-crypto-prices'),
  sendChatMessage: (message) => ipcRenderer.invoke('send-chat-message', message),
  onAlert: (callback) => ipcRenderer.on('alert', (event, data) => callback(data)),
  sendNotification: (title, body) => {
    new Notification({ title, body }).show();
  },
});
