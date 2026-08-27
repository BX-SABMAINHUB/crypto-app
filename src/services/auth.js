const USERS_KEY = 'cryptoapp_users';
const SESSION_KEY = 'cryptoapp_session';

export function register(email, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'El correo ya está registrado' };
  }
  users.push({ email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

export function login(email, password) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    return { success: true };
  }
  return { success: false, message: 'Credenciales incorrectas' };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
}
