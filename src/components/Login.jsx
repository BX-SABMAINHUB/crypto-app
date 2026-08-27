import { useState } from 'react';
import { register, login } from '../services/auth';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = isRegister ? register(email, password) : login(email, password);
    if (result.success) {
      onLogin(email);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isRegister ? 'Registrarse' : 'Entrar'}</button>
      </form>
      <button className="toggle-button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
}
