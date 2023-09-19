import {
  generateIncorectOptions,
  generateRandomPosition,
  generateRandomPositions,
} from './helpers.js';

export const OPTIONS_LIMIT = 4;
export const CAPITAL_COUNTRY_KEY_WORD = 'capital';
export const FLAG_COUNTRY_KEY_WORD = 'name';

export const questions = [
  {
    id: 1,
    question: 'Cual es la ciudad capital de:',
    corectOption: '',
    options: [],
  },
  {
    id: 2,
    question: 'De qué pais es la siguiente bandera',
    corectOption: '',
    options: [],
  },
];

function setOptions(question, corectOption, incorectOptions) {
  question.corectOption = corectOption;
  const concatenatedOptions = [...incorectOptions, corectOption];
  const positions = generateRandomPositions();
  for (let i = 0; i < OPTIONS_LIMIT; i++) {
    const p = positions.pop();
    question.options[p] = concatenatedOptions[i];
  }
}

export async function getRandomQuestion(mainCountry, countries) {
  const quest = questions[generateRandomPosition(questions)];
  quest.name = mainCountry.name.common;
  quest.capital = mainCountry.capital;
  quest.flag_url = mainCountry.flags.png;
  if (quest.id === 1) {
    setOptions(
      quest,
      quest.capital?.join(),
      generateIncorectOptions(countries, CAPITAL_COUNTRY_KEY_WORD)
    );
  } else {
    setOptions(
      quest,
      quest.name,
      generateIncorectOptions(countries, FLAG_COUNTRY_KEY_WORD)
    );
  }
  return quest;
}

export function getRandomCountry(countries) {
  return countries[generateRandomPosition(countries)];
}

export function renderQuestion(question) {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const template = document.getElementById('question_template').content;
  const fragment = document.createDocumentFragment();
  const clone = template.cloneNode(true);
  clone.querySelector('.question').textContent = `¿${question.question} ${
    (question.id === 1 && question.name) || ''
  }?`;

  clone.querySelector('img').src = question.flag_url;

  question.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.classList.add('list-group-item');
    btn.classList.add('list-group-item-action');
    btn.textContent = option;
    btn.dataset.id = i;
    fragment.appendChild(btn);
  });
  clone.querySelector('.list-group').appendChild(fragment);
  main.appendChild(clone);
}

export async function getGamesQuantity(token) {
  const { count } = await fetch('http://localhost:3000/stats/getStats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      localStorage.setItem('games-quantity', JSON.stringify(json.count));
      document.getElementById('games').textContent = json.count;
      return json;
    });
  return count;
}
