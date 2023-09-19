import {
  CAPITAL_COUNTRY_KEY_WORD,
  FLAG_COUNTRY_KEY_WORD,
  OPTIONS_LIMIT,
  getRandomCountry,
} from './questions.js';

export function generateRandomPositions() {
  const positionsCollection = [];
  while (positionsCollection.length < OPTIONS_LIMIT) {
    const position = Math.floor(Math.random() * OPTIONS_LIMIT);
    if (!positionsCollection.includes(position))
      positionsCollection.push(position);
  }
  return positionsCollection;
}

export function generateRandomPosition(array) {
  return Math.floor(Math.random() * array.length);
}

export function generateIncorectOptions(countries, key) {
  const options = [];
  for (let i = 0; i < OPTIONS_LIMIT - 1; i++) {
    let randomOption = getRandomCountry(countries)[key];
    if (key === CAPITAL_COUNTRY_KEY_WORD) options.push(randomOption);
    else if (key === FLAG_COUNTRY_KEY_WORD) options.push(randomOption.common);
  }
  return options;
}
