/**
 * Pokédx App - Main Entry Point
 * Mobile-First Single Page Application
 */

// App State
const appState = {
  pokemonList: [],
  currentOffset: 0,
  currentPokemon: null,
  isLoading: false,
  pokemonCache: {},
  limit: 20,
};

// API Configuration
const apiConfig = {
  baseUrl: "https://pokeapi.co/api/v2/",
  endpoints: {
    pokemon: "pokemon",
    pokemonDetails: "pokemon",
  },
};

/**
 * Initialisiert die Pokédx-App
 */
let initializeApp = () => {
  console.log("🚀 Pokédx App wird gestartet...");
  setupEventListeners();
  loadInitialPokemon();
};

/**
 * Richtet alle Event Listener ein
 */
let setupEventListeners = () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const loadMoreButton = document.getElementById("loadMoreButton");

  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInputChange);
    searchInput.addEventListener("keypress", handleSearchKeyPress);
  }

  if (searchButton) {
    searchButton.addEventListener("click", handleSearchButtonClick);
  }

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", handleLoadMoreClick);
  }
};

/**
 * Behandelt Änderungen im Suchfeld
 * @param {Event} event - Input-Event
 */
let handleSearchInputChange = (event) => {
  const searchButton = document.getElementById("searchButton");
  const inputValue = event.target.value.trim();

  if (searchButton) {
    searchButton.disabled = inputValue.length < 3;
  }
};

/**
 * Behandelt Enter-Taste im Suchfeld
 * @param {KeyboardEvent} event - Keyboard-Event
 */
let handleSearchKeyPress = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearchButtonClick();
  }
};

/**
 * Behandelt Klick auf Such-Button
 */
let handleSearchButtonClick = () => {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput?.value.trim().toLowerCase();

  if (searchTerm && searchTerm.length >= 3) {
    console.log("🔍 Suche nach:", searchTerm);
    // TODO: Implement search functionality
  }
};

/**
 * Behandelt Klick auf Load-More-Button
 */
let handleLoadMoreClick = () => {
  if (!appState.isLoading) {
    loadMorePokemon();
  }
};

/**
 * Lädt die ersten Pokémon beim App-Start
 */
let loadInitialPokemon = async () => {
  console.log("📦 Lade erste Pokémon...");
  setLoadingState(true);

  try {
    await fetchPokemonList(0, appState.limit);
    console.log("✅ Erste Pokémon erfolgreich geladen");
  } catch (error) {
    console.error("❌ Fehler beim Laden der ersten Pokémon:", error);
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Lädt weitere Pokémon
 */
let loadMorePokemon = async () => {
  console.log("📦 Lade weitere Pokémon...");
  setLoadingState(true);

  try {
    const newOffset = appState.currentOffset + appState.limit;
    await fetchPokemonList(newOffset, appState.limit);
    console.log("✅ Weitere Pokémon erfolgreich geladen");
  } catch (error) {
    console.error("❌ Fehler beim Laden weiterer Pokémon:", error);
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Holt Pokémon-Liste von der API
 * @param {number} offset - Start-Index
 * @param {number} limit - Anzahl der Pokémon
 */
let fetchPokemonList = async (offset, limit) => {
  const url = `${apiConfig.baseUrl}${apiConfig.endpoints.pokemon}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API-Fehler: ${response.status}`);
  }

  const data = await response.json();
  appState.currentOffset = offset;

  // TODO: Process and render Pokemon data
  console.log("📊 API-Daten erhalten:", data.results.length, "Pokémon");
};

/**
 * Setzt den Loading-Zustand
 * @param {boolean} isLoading - Loading-Status
 */
let setLoadingState = (isLoading) => {
  appState.isLoading = isLoading;
  const loadingSpinner = document.getElementById("loadingSpinner");
  const loadMoreButton = document.getElementById("loadMoreButton");

  if (loadingSpinner) {
    loadingSpinner.classList.toggle("hidden", !isLoading);
  }

  if (loadMoreButton) {
    loadMoreButton.disabled = isLoading;
    loadMoreButton.textContent = isLoading ? "Loading..." : "Load More Pokémon";
  }
};

/**
 * Zeigt Fehlermeldung an
 */
let showErrorMessage = () => {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.classList.remove("hidden");
  }
};

// App starten wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", initializeApp);
