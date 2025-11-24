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
} from "./templates/ui-elements-template.js";
import { ELEMENT_IDS, API_CONFIG, ANIMATIONS } from "./constants.js";

/**
 * Initializes the search functionality
 * @async
 * @function initializeSearch
 * @returns {Promise<void>}
 */
export let initializeSearch = async () => {
  try {
    // Load all Pokémon names for autocomplete
    await loadAllPokemonNames();

    // Setup event listeners
    setupSearchEventListeners();
  } catch (error) {
    // Error handled silently
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
 * Handles input in the search field
 * @param {Event} e - Input Event
 */
export let handleSearchInput = async (e) => {
  const query = e.target.value.toLowerCase().trim();
  const searchButton = document.getElementById(ELEMENT_IDS.searchButton);

  // Update button state based on input length
  updateSearchButtonState(query);

  // If input is empty, restore initial Pokemon
  if (query.length === 0) {
    hideAutocomplete();
    await handleClearSearch();
    return;
  }

  // Show autocomplete for any input
  if (query.length > 0) {
    updateAutocomplete(query);
    showAutocomplete();
  }

  // Auto-search when 3 or more characters
  if (query.length >= 3) {
    await performSearch(query);
  }
};

/**
 * Updates the search button state
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

  // At least 3 characters required
  if (query.length < 3) {
    // Visual feedback
    searchInput.style.borderColor = "#ff6b6b";
    searchInput.placeholder = "Enter at least 3 characters...";

    // Reset after 2 seconds
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
 * Perform the Pokémon search
 * @param {string} query - Search term
 */
export let performSearch = async (query) => {
  setLoadingState(true);

  try {
    const results = await searchPokemon(query);

    // Set app to search mode
    appState.isSearchMode = true;
    appState.currentSearchQuery = query;
    appState.searchResults = results; // Store search results for modal navigation

    // Clear containers and show results
    clearPokemonContainer();

    if (results.length > 0) {
      renderPokemonCards(results);
      updateSearchStatus(createSearchStatusHTML(results.length, query));
    } else {
      updateSearchStatus(createSearchStatusHTML(0, query));
    }
  } catch (error) {
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Clears the search and returns to the normal view
 */
export let handleClearSearch = async () => {
  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);
  if (searchInput && searchInput.value !== "") {
    searchInput.value = "";
  }

  // Only reload if we were in search mode
  if (!appState.isSearchMode) return;

  // Back to normal mode
  appState.isSearchMode = false;
  appState.currentSearchQuery = "";
  appState.searchResults = []; // Clear search results

  // Empty container and restore previously loaded Pokémon
  clearPokemonContainer();

  // Show all previously loaded Pokémon from pokemonList
  if (appState.pokemonList.length > 0) {
    renderPokemonCards(appState.pokemonList);
  } else {
    // If no Pokémon were loaded before, load initial set
    appState.currentOffset = 0;
    const { loadInitialPokemon } = await import("./pokemon-list.js");
    await loadInitialPokemon();
  }

  updateSearchStatus("");
  hideAutocomplete();
};

/**
 * Updates the autocomplete suggestions
 * @param {string} query - Search term
 */
export let updateAutocomplete = (query) => {
  const autocompleteContainer = document.getElementById(
    ELEMENT_IDS.autocompleteContainer
  );
  if (!autocompleteContainer || !appState.allPokemonNames) return;

  // Find matching Pokémon names
  const matches = appState.allPokemonNames.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query)
  );

  autocompleteContainer.innerHTML = createAutocompleteListHTML(matches, query);
};

/**
 * Handles selection of an autocomplete item
 * @param {string} pokemonName - Selected Pokémon name
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
 * Shows the autocomplete container
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
 * Hides the autocomplete container
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
 * Updates the search status display
 * @function updateSearchStatus
 * @param {string} message - Status message
 * @returns {void}
 */
export let updateSearchStatus = (message) => {
  const statusElement = document.getElementById(ELEMENT_IDS.searchStatus);
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.display = message ? "block" : "none";
  }
};

// Global functions for HTML onclick
window.selectAutocomplete = selectAutocomplete;
