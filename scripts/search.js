/**
 * Search Functionality Module
 * Handles all search-related features including autocomplete
 */

import { appState } from "./main.js";
import { searchPokemon, loadAllPokemonNames } from "./api.js";
import { clearPokemonContainer, renderPokemonCards } from "./pokemon-list.js";
import { setLoadingState, showErrorMessage } from "./ui-helpers.js";
import {
  createAutocompleteListHTML,
  createSearchStatusHTML,
} from "./templates/ui-elements-template.js";
import { ELEMENT_IDS, API_CONFIG, ANIMATIONS } from "./constants.js";
import { showNotification } from "./components/notification.js";

/**
 * Initializes the search functionality
 * @async
 * @function initializeSearch
 * @returns {Promise<void>}
 */
export let initializeSearch = async () => {
  await loadAllPokemonNames();
  setupSearchEventListeners();
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
 * Sets up event listeners for search
 */
export let setupSearchEventListeners = () => {
  const searchInput = document.getElementById(ELEMENT_IDS.searchInput);

  if (searchInput) {
    setupSearchInputListeners(searchInput);
  }
};

/**
 * Handles input in the search field
 * @param {Event} e - Input Event
 */
export let handleSearchInput = async (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (query.length === 0) {
    hideAutocomplete();
    await handleClearSearch();
    return;
  }

  if (query.length > 0) {
    updateAutocomplete(query);
    showAutocomplete();
  }

  if (query.length >= 3) {
    await performSearch(query);
  }
};

/**
 * Shows validation error for short input
 */
let showInputValidationError = (searchInput) => {
  searchInput.style.borderColor = "#ff6b6b";
  searchInput.placeholder = "Enter at least 3 characters...";

  setTimeout(() => {
    searchInput.style.borderColor = "";
    searchInput.placeholder = "Pokémon suchen...";
  }, 2000);
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

  if (query.length < 3) {
    showInputValidationError(searchInput);
    return;
  }

  await performSearch(query);
  hideAutocomplete();
};

/**
 * Handles search results display
 */
let handleSearchResults = (results, query) => {
  clearPokemonContainer();

  if (results.length > 0) {
    renderPokemonCards(results);
    updateSearchStatus(createSearchStatusHTML(results.length, query));
  } else {
    updateSearchStatus(createSearchStatusHTML(0, query));
    showNotification("", query);
  }
};

/**
 * Perform the Pokémon search
 * @param {string} query - Search term
 */
export let performSearch = async (query) => {
  setLoadingState(true);

  try {
    const results = await searchPokemon(query);
    appState.isSearchMode = true;
    appState.currentSearchQuery = query;
    appState.searchResults = results;
    handleSearchResults(results, query);
  } catch (error) {
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Reloads pokemon list after clearing search
 */
let reloadPokemonList = async () => {
  if (appState.pokemonList.length > 0) {
    renderPokemonCards(appState.pokemonList);
  } else {
    appState.currentOffset = 0;
    const { loadInitialPokemon } = await import("./pokemon-list.js");
    await loadInitialPokemon();
  }
};

/**
 * Clears search input
 */
function clearSearchInput() {
    const searchInput = document.getElementById(ELEMENT_IDS.searchInput);
    if (searchInput && searchInput.value !== "") {
        searchInput.value = "";
    }
}

/**
 * Resets search state
 */
function resetSearchState() {
    appState.isSearchMode = false;
    appState.currentSearchQuery = "";
    appState.searchResults = [];
}

/**
 * Clears the search and returns to the normal view
 */
export let handleClearSearch = async () => {
    clearSearchInput();

    if (!appState.isSearchMode) return;

    resetSearchState();

    clearPokemonContainer();
    await reloadPokemonList();

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

window.selectAutocomplete = selectAutocomplete;
