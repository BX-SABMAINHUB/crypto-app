import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { getCurrentUser, logout } from './services/auth';
import './styles.css';

function App() {
  const [user, setUser] = useState(getCurrentUser());

  const handleLogin = (email) => {
    setUser({ email });
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="app">
      {user ? (
        <>
          <header>
            <h1>CryptoApp</h1>
            <div>
              <span>Bienvenido, {user.email}</span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </header>
          <Dashboard />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
