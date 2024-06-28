// Importowanie funkcji fetchCountries z pliku fetchCountries.js
import { fetchCountries } from './fetchCountries.js';
// Importowanie funkcji debounce z biblioteki lodash
import debounce from 'lodash.debounce';
// Importowanie klasy Notify z biblioteki notiflix
import { Notify } from 'notiflix';

// Pobranie referencji do pola wyszukiwania
const searchBox = document.querySelector('input#search-box');
// Pobranie referencji do listy krajów
const listCountry = document.querySelector('.country-list');
// Pobranie referencji do informacji o kraju
const infoCountry = document.querySelector('.country-info');

// Opóźnienie dla funkcji debounce
const Debounce_DELAY = 800;

// Obsługa zdarzenia wprowadzania tekstu w polu wyszukiwania
function inputHandler(event) {
  const searchInput = event.target.value.trim();
  cleanCountry(); // Wyczyszczenie informacji o kraju
  cleanListCountry(); // Wyczyszczenie listy krajów

  //Wywołanie funkcji fetchCountries, aby pobrać dane o krajach
  fetchCountries(searchInput)
    .then(data => {
      if (data.length > 10) {
        // Wyświetlenie komunikatu, jeśli znaleziono zbyt wiele pasujących krajów
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      // Wygenerowanie widoku danych o kraju
      countryDataMarkup(data);
    })
    .catch(error => {
      ///Obsługa błędów
      Notify.failure('There is no country with this name.');
    });
}

// Funkcja generująca kod HTML dla listy krajów
function createListMarkup(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li class="country-list_item" data-country="${name.common}">
            <img src="${flags.svg}" alt="${name.common}" height="30px" style="height: 30px;"> ${name.official}
        </li><br><br>`
    )
    .join('');
}

// Funkcja generująca kod HTML dla informacji o kraju
function createDataMarkup(data) {
  const countryElement = data[0];
  const { name, capital, population, flags, languages } = countryElement;
  return `
        <div class="country-item">
           <img src="${flags.svg}" alt="${
    name.common
  }" height="30px" style="height: 30px;">

            <h1>${name.official}</h1>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${Object.values(languages).join(', ')}</p>
        </div>
    `;
}

// Funkcja wyświetlająca dane o kraju
function countryDataMarkup(data) {
  const countryInfo = document.getElementById('country-info');
  const countryList = document.getElementById('country-list');

  if (data.length === 1) {
    // Wyświetlenie informacji o pojedynczym kraju
    const dataMarkup = createDataMarkup(data);
    countryInfo.innerHTML = dataMarkup;
  } else {
    // Wyświetlenie listy pasujących krajów
    const listMarkup = createListMarkup(data);
    countryList.innerHTML = listMarkup;

    // Obsługa kliknięcia na element li w liście krajów
    const listItems = document.querySelectorAll('.country-list_item');
    listItems.forEach(item => {
      item.addEventListener('click', event => {
        const clickedCountry = event.currentTarget.dataset.country;
        const wantedCountry = data.filter(
          country => country.name.common === clickedCountry
        );
        countryInfo.innerHTML = createDataMarkup(wantedCountry);
        cleanListCountry();
      });
    });
  }
}

// Nasłuchiwanie zdarzenia wprowadzania tekstu w polu wyszukiwania z opóźnieniem
searchBox.addEventListener('input', debounce(inputHandler, Debounce_DELAY));

//wyczyszczenie informacji o kraju wyświetlanych na stronie
function cleanCountry() {
  const countryInfo = document.getElementById('country-info');
  countryInfo.innerHTML = '';
}

//wyczyszczenie listy krajów wyświetlanej na stronie
function cleanListCountry() {
  const countryList = document.getElementById('country-list');
  countryList.innerHTML = '';
}
