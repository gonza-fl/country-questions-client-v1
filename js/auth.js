import { getGamesQuantity } from './questions.js';

export async function login(email, password) {
  const user = await fetch('http://localhost:3000/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((res) => res.json());
  if (user.token) {
    document.getElementById('player').textContent = user.user.name;
    document.getElementById('logout-btn').classList.remove('d-none');
    document.getElementById('login-btn').classList.add('d-none');
    document.getElementById('logout-btn').addEventListener('click', logout);
    saveToken(user);
    await getGamesQuantity(user.token);
  }
}
export async function register(email, name, password) {
  await fetch('http://localhost:3000/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  }).then((res) => res.json());
}

export function logout() {
  localStorage.removeItem('user-token');
  window.location.reload();
  document.getElementById('player').textContent = 'Guest';
  document.getElementById('login-btn').classList.remove('d-none');
  document.getElementById('logout-btn').classList.add('d-none');
}

export async function verifyToken() {
  const token = localStorage.getItem('user-token');
  if (!token) return { tokenIsValid: false };
  const response = await fetch('http://localhost:3000/user/verifyToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
    }),
  }).then((res) => res.json());
  return response;
}
export function saveToken({ token }) {
  localStorage.setItem('user-token', token);
}
