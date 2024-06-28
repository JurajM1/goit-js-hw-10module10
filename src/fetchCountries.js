// Adres URL API krajów
const Countries_API_URL = 'https://restcountries.com/v3.1/name/';

// Funkcja asynchroniczna do pobierania informacji o krajach na podstawie nazwy
async function fetchCountries(name) {
  try {
    // Wywołanie API, aby pobrać dane o kraju
    const response = await fetch(
      `${Countries_API_URL}${name}?fields=name,capital,population,flags,languages`
    );

    // Sprawdzenie, czy odpowiedź ma status 200 (OK)
    if (response.status === 200) {
      // Przetworzenie danych z odpowiedzi na format JSON
      const data = await response.json();
      console.log('Data from API:', data);
      return data;
    }
  } catch (error) {
    // Obsługa błędów (np. brak połączenia z API)
    console.error(error);
    throw new Error(response.status);
  }
}

// Eksport funkcji fetchCountries
export { fetchCountries };
