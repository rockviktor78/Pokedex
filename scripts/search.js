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
  console.log("🔍 Initialisiere Suche...");

  try {
    // Lade alle Pokémon-Namen für Autocomplete
    await loadAllPokemonNames();

    // Setup Event Listeners
    setupSearchEventListeners();

    console.log("✅ Suche erfolgreich initialisiert");
  } catch (error) {
    console.error("❌ Fehler beim Initialisieren der Suche:", error);
  }
};

/**
 * Richtet Event Listeners für Suche ein
 */
export let setupSearchEventListeners = () => {
  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);
  const searchButton = document.getElementById(ELEMENT_IDS.searchButton);
  const clearButton = document.getElementById(ELEMENT_IDS.clearSearch);

  if (searchInput) {
    // Input Event für Live-Suche
    searchInput.addEventListener("input", handleSearchInput);

    // Enter-Taste für Suche
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit();
      }
    });

    // Focus und Blur für Autocomplete
    searchInput.addEventListener("focus", showAutocomplete);
    searchInput.addEventListener("blur", () => {
      // Delay um Klicks auf Autocomplete-Items zu ermöglichen
      setTimeout(hideAutocomplete, ANIMATIONS.autocompleteBlurDelay);
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", handleSearchSubmit);
  }

  if (clearButton) {
    clearButton.addEventListener("click", handleClearSearch);
  }
};

/**
 * Behandelt Eingabe im Suchfeld
 * @param {Event} e - Input Event
 */
export let handleSearchInput = (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (query.length > 0) {
    updateAutocomplete(query);
    showAutocomplete();
  } else {
    hideAutocomplete();
  }
};

/**
 * Behandelt Suche-Submit (Enter oder Button-Klick)
 */
export let handleSearchSubmit = async () => {
  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();

  if (query === "") {
    handleClearSearch();
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
