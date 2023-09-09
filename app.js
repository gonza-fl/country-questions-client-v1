const OPTIONS_LIMIT = 4;

const questions = [
  {
    id: 1,
    question: '¿Cual es la ciudad capital de...?',
    country: {
      name: '',
      capital: '',
    },
    options: [],
    setOptions(incorrectCapitals) {
      const correctCapital = this.country.capital;
      const concatenatedOptions = [...incorrectCapitals, correctCapital];
      const positions = generateRandomPositions();
      console.log('🚀 ~ file: app.js:16 ~ setOptions ~ positions:', positions);
      for (let i = 0; i < OPTIONS_LIMIT; i++) {
        const p = positions.pop();
        this.options[p] = concatenatedOptions[i];
      }
    },
  },
  {
    id: 2,
    question: '¿De qué pais es la siguiente bandera?',
    flag_url: '',
  },
];

function generateRandomPositions() {
  const positionsCollection = [];
  while (positionsCollection.length < OPTIONS_LIMIT) {
    const position = Math.floor(Math.random() * OPTIONS_LIMIT);
    if (!positionsCollection.includes(position))
      positionsCollection.push(position);
  }
  return positionsCollection;
}

function getRandomCountry(countries) {
  return countries[Math.floor(Math.random() * countries.length)];
}

async function createCountryQuestion() {
  const countries = await fetch('https://restcountries.com/v3.1/all').then(
    (res) => res.json()
  );
  const country = getRandomCountry(countries);
  const capitalQuestion = questions[0];

  capitalQuestion.country = {
    name: country.name.common,
    capital: country.capital.join(),
  };
  const cap = ['tes1', 'test2', 'test3'];
  capitalQuestion.setOptions(cap);
  console.log(
    '🚀 ~ file: app.js:52 ~ main ~ capitalQuestion:',
    capitalQuestion
  );
}

document.addEventListener('DOMContentLoaded', main);

async function main() {}
