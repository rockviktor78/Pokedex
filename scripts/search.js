/**
 * Search Functionality Module
 * Handles all search-related features including autocomplete
 */

// Import dependencies
import { appState } from "./main.js";
import { searchPokemon, loadAllPokemonNames } from "./api.js";
import { clearPokemonContainer, renderPokemonCards } from "./pokemon-list.js";
import { setLoadingState, showErrorMessage } from "./ui-helpers.js";
import {
  createAutocompleteListHTML,
  createSearchStatusHTML,
} from "./templates.js";
import { ELEMENT_IDS, API_CONFIG, ANIMATIONS } from "./constants.js";

/**
 * Initialisiert die Suchfunktionalität
 */
export let initializeSearch = async () => {
  console.log("🔍 Initializing search...");

  try {
    // Lade alle Pokémon-Namen für Autocomplete
    await loadAllPokemonNames();

    // Setup Event Listeners
    setupSearchEventListeners();

    console.log("✅ Search successfully initialized");
  } catch (error) {
    console.error("❌ Error initializing search:", error);
  }
};

/**
 * Sets up search input event listeners
 */
function setupSearchInputListeners(searchInput) {
  searchInput.addEventListener("input", handleSearchInput);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  });
  searchInput.addEventListener("focus", showAutocomplete);
  searchInput.addEventListener("blur", () => {
    setTimeout(hideAutocomplete, ANIMATIONS.autocompleteBlurDelay);
  });
}

/**
 * Sets up search button event listeners
 */
function setupSearchButtonListeners() {
  const searchButton = document.getElementById(ELEMENT_IDS.searchButton);
  const clearButton = document.getElementById(ELEMENT_IDS.clearSearch);

  if (searchButton) {
    updateSearchButtonState("");
    searchButton.addEventListener("click", handleSearchSubmit);
  }

  if (clearButton) {
    clearButton.addEventListener("click", handleClearSearch);
  }
}

/**
 * Sets up event listeners for search
 */
export let setupSearchEventListeners = () => {
  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);

  if (searchInput) {
    setupSearchInputListeners(searchInput);
  }

  setupSearchButtonListeners();
};

/**
 * Behandelt Eingabe im Suchfeld
 * @param {Event} e - Input Event
 */
export let handleSearchInput = (e) => {
  const query = e.target.value.toLowerCase().trim();
  const searchButton = document.getElementById(ELEMENT_IDS.searchButton);

  // Button State basierend auf Eingabelänge aktualisieren
  updateSearchButtonState(query);

  if (query.length > 0) {
    updateAutocomplete(query);
    showAutocomplete();
  } else {
    hideAutocomplete();
  }
};

/**
 * Aktualisiert den Status des Suchbuttons
 * @param {string} query - Current search input
 */
let updateSearchButtonState = (query) => {
  const searchButton = document.getElementById(ELEMENT_IDS.searchButton);
  if (!searchButton) return;

  const isValid = query.length >= 3;

  searchButton.disabled = !isValid;
  searchButton.style.opacity = isValid ? "1" : "0.5";
  searchButton.style.cursor = isValid ? "pointer" : "not-allowed";

  // Tooltip for better UX
  if (isValid) {
    searchButton.title = "Start search";
  } else {
    searchButton.title = `At least 3 characters required (${query.length}/3)`;
  }
};

/**
 * Handles search submit (Enter or button click)
 */
export let handleSearchSubmit = async () => {
  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();

  if (query === "") {
    handleClearSearch();
    return;
  }

  // Mindestens 3 Zeichen erforderlich
  if (query.length < 3) {
    console.log("⚠️ Search cancelled: At least 3 characters required");

    // Visuelles Feedback
    searchInput.style.borderColor = "#ff6b6b";
    searchInput.placeholder = "Mindestens 3 Zeichen eingeben...";

    // Reset nach 2 Sekunden
    setTimeout(() => {
      searchInput.style.borderColor = "";
      searchInput.placeholder = "Pokémon suchen...";
    }, 2000);

    return;
  }

  await performSearch(query);
  hideAutocomplete();
};

/**
 * Führt die Pokémon-Suche durch
 * @param {string} query - Suchbegriff
 */
export let performSearch = async (query) => {
  console.log(`🔍 Suche nach: "${query}"`);
  setLoadingState(true);

  try {
    const results = await searchPokemon(query);

    // Setze App in Suchmodus
    appState.isSearchMode = true;
    appState.currentSearchQuery = query;
    appState.searchResults = results; // Store search results for modal navigation

    // Leere Container und zeige Ergebnisse
    clearPokemonContainer();

    if (results.length > 0) {
      renderPokemonCards(results);
      updateSearchStatus(createSearchStatusHTML(results.length, query));
      console.log(`✅ ${results.length} Pokémon gefunden für "${query}"`);
    } else {
      updateSearchStatus(createSearchStatusHTML(0, query));
      console.log(`❌ Keine Pokémon gefunden für "${query}"`);
    }
  } catch (error) {
    console.error("❌ Fehler bei der Suche:", error);
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Löscht die Suche und kehrt zur normalen Ansicht zurück
 */
export let handleClearSearch = async () => {
  console.log("🔄 Lösche Suche...");

  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);
  if (searchInput) {
    searchInput.value = "";
  }

  // Zurück zum normalen Modus
  appState.isSearchMode = false;
  appState.currentSearchQuery = "";
  appState.searchResults = []; // Clear search results
  appState.currentOffset = 0;

  // Container leeren und erste Pokémon laden
  clearPokemonContainer();

  // Dynamic import to avoid circular dependency
  const { loadInitialPokemon } = await import("./pokemon-list.js");
  await loadInitialPokemon();

  updateSearchStatus("");
  hideAutocomplete();
};

/**
 * Aktualisiert Autocomplete-Vorschläge
 * @param {string} query - Suchbegriff
 */
export let updateAutocomplete = (query) => {
  const autocompleteContainer = document.getElementById(
    ELEMENT_IDS.autocompleteContainer
  );
  if (!autocompleteContainer || !appState.allPokemonNames) return;

  // Finde passende Pokémon-Namen
  const matches = appState.allPokemonNames.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query)
  );

  autocompleteContainer.innerHTML = createAutocompleteListHTML(matches, query);
};

/**
 * Behandelt Auswahl eines Autocomplete-Items
 * @param {string} pokemonName - Ausgewählter Pokémon-Name
 */
export let selectAutocomplete = async (pokemonName) => {
  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);
  if (searchInput) {
    searchInput.value = pokemonName;
  }

  await performSearch(pokemonName);
  hideAutocomplete();
};

/**
 * Zeigt Autocomplete-Container
 */
export let showAutocomplete = () => {
  const autocompleteContainer = document.getElementById(
    ELEMENT_IDS.autocompleteContainer
  );
  if (autocompleteContainer) {
    autocompleteContainer.style.display = "block";
  }
};

/**
 * Versteckt Autocomplete-Container
 */
export let hideAutocomplete = () => {
  const autocompleteContainer = document.getElementById(
    ELEMENT_IDS.autocompleteContainer
  );
  if (autocompleteContainer) {
    autocompleteContainer.style.display = "none";
  }
};

/**
 * Aktualisiert Such-Status-Anzeige
 * @param {string} message - Status-Nachricht
 */
export let updateSearchStatus = (message) => {
  const statusElement = document.getElementById(ELEMENT_IDS.searchStatus);
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.display = message ? "block" : "none";
  }
};

// Globale Funktionen für HTML onclick
window.selectAutocomplete = selectAutocomplete;
