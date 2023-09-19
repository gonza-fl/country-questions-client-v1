import { login, logout, register, verifyToken } from './auth.js';
import {
  getGamesQuantity,
  getRandomCountry,
  getRandomQuestion,
  renderQuestion,
} from './questions.js';

export function saveStatsInLocalStorage(stats) {
  localStorage.setItem('user-stats', JSON.stringify(stats));
}

async function start(startTime) {
  const countries = await fetch('https://restcountries.com/v3.1/all').then(
    (res) => res.json()
  );
  const mainCountry = getRandomCountry(countries);
  const question = await getRandomQuestion(mainCountry, countries);
  renderQuestion(question);
  document.querySelector('.options').addEventListener('click', async (e) => {
    const stats = JSON.parse(localStorage.getItem('user-stats'));
    let score = parseInt(stats?.score) || 0;
    let fails = parseInt(stats?.fails) || 0;
    let questions = parseInt(stats?.questions) || 0;
    questions++;
    if (e.target.classList.contains('list-group-item')) {
      if (e.target.textContent === question.corectOption) {
        score++;
        Swal.fire({
          icon: 'success',
        });
      } else {
        fails++;
        Swal.fire({
          icon: 'error',
        });
      }
      if (questions >= 10) {
        let { score, fails } = JSON.parse(localStorage.getItem('user-stats'));
        const token = localStorage.getItem('user-token');
        const endTime = new Date();
        const timeElapsed = (endTime - startTime) / 1000;
        try {
          await fetch('http://localhost:3000/stats/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              score,
              fails,
              time: timeElapsed,
            }),
          })
            .then((res) => res.json())
            .then((json) =>
              Swal.fire({
                icon: 'info',
                title: 'Game Over',
                html: `<ul class="list-group">
                  <li id="finshed_score" class="list-group-item bg-success">Score: ${json.userStats.score}</li>
                  <li id="finshed_fails" class="list-group-item bg-danger">Fails: ${json.userStats.fails}</li>
                  <li id="finshed_time" class="list-group-item  bg-warning">Time: ${json.userStats.time}</li>
                  </ul>`,
              })
            );
          await getGamesQuantity(token);
          return main();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            text: error,
          });
        }
      }
      const statsReady = {
        score,
        fails,
        questions,
      };
      saveStatsInLocalStorage(statsReady);
      updateStatsLabels();
      start(startTime);
    }
  });
}

document.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (e.target.id === 'register-form') {
    const email = document.getElementById('inputEmailRegister').value;
    const password = document.getElementById('inputPasswordRegister').value;
    const name = document.getElementById('inputName').value;
    await register(email, name, password);
    document
      .getElementById('modalRegister')
      .addEventListener('hide.bs.modal', () => {
        document.getElementById('inputName').value = '';
        document.getElementById('inputPasswordRegister').value = '';
        document.getElementById('inputEmailRegister').value = '';
      });
  }
  if (e.target.id === 'login-form') {
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    await login(email, password);
    document
      .getElementById('modalLogin')
      .addEventListener('hide.bs.modal', () => {
        document.getElementById('inputPassword').value = '';
        document.getElementById('inputEmail').value = '';
      });
  }
});

async function main() {
  localStorage.removeItem('user-stats');

  const token = await verifyToken();
  console.log('🚀 ~ file: app.js:121 ~ main ~ token:', token);
  if (token.tokenIsValid) {
    document.getElementById('player').textContent = token.user.name;
    document.getElementById('login-btn').classList.add('d-none');
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('logout-btn').classList.remove('d-none');
    await getGamesQuantity(localStorage.getItem('user-token'));
  }
  updateStatsLabels();
  const startTime = new Date();
  start(startTime);
}

function updateStatsLabels(
  stats = JSON.parse(localStorage.getItem('user-stats'))
) {
  const score = stats?.score || 0;
  const fails = stats?.fails || 0;
  const questions = stats?.questions || 0;
  document.getElementById('score').textContent = score;
  document.getElementById('fails').textContent = fails;
  document.getElementById('questions').textContent = questions;
}

document.addEventListener('DOMContentLoaded', main);
