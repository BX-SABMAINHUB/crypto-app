import { useState, useEffect, useRef } from 'react';

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Escuchar alertas automáticas del proceso principal
    if (window.electronAPI && window.electronAPI.onAlert) {
      window.electronAPI.onAlert((data) => {
        setMessages((prev) => [...prev, { type: 'alert', ...data }]);
        // Mostrar notificación del sistema
        if (window.electronAPI.sendNotification) {
          window.electronAPI.sendNotification(data.title, data.message);
        }
      });
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const reply = await window.electronAPI.sendChatMessage(input);
      setMessages((prev) => [...prev, { type: 'ia', text: reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: 'error', text: 'Error al contactar con la IA' }]);
    }
  };

  return (
    <div className="chat-panel">
      <h2>Asesor de Criptomonedas (IA)</h2>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type === 'alert' ? 'alert-message' : msg.type === 'user' ? 'user-message' : 'ia-message'}`}>
            {msg.type === 'alert' && <strong>{msg.title}: </strong>}
            {msg.text || msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre criptomonedas..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}
