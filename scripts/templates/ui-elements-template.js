import {
  CSS_CLASSES,
  UI_MESSAGES,
  API_CONFIG,
  ELEMENT_IDS,
} from "../constants.js";

/**
 * Creates HTML for a single autocomplete item
 * @function createAutocompleteItemHTML
 * @param {Object|string} pokemon - Pokémon object or name string
 * @param {string} query - Search query for highlighting
 * @returns {string} Autocomplete item HTML string
 */
export function createAutocompleteItemHTML(pokemon, query) {
  const name = typeof pokemon === "string" ? pokemon : pokemon.name;
  const highlightedName = name.replace(
    new RegExp(`(${query})`, "gi"),
    "<strong>$1</strong>"
  );

  return `
    <div class="${CSS_CLASSES.autocompleteItem}" onclick="window.selectAutocomplete('${name}')">
      ${highlightedName}
    </div>
  `;
}

/**
 * Creates HTML for autocomplete container with results
 * @function createAutocompleteListHTML
 * @param {Array} matches - Array of matching Pokémon
 * @param {string} query - Search query for highlighting
 * @returns {string} Autocomplete list HTML string
 */
export function createAutocompleteListHTML(matches, query) {
  if (matches.length === 0) {
    return `<div class="${CSS_CLASSES.autocompleteItem} ${CSS_CLASSES.noResults}">${UI_MESSAGES.noSuggestions}</div>`;
  }

  return matches
    .slice(0, API_CONFIG.maxAutocompleteResults)
    .map((pokemon) => createAutocompleteItemHTML(pokemon, query))
    .join("");
}

/**
 * Creates HTML for error message
 * @function createErrorHTML
 * @param {string} message - Error message to display
 * @returns {string} Error message HTML string
 */
export function createErrorHTML(message = UI_MESSAGES.defaultError) {
  return `
    <div class="${CSS_CLASSES.errorMessage}">
      <div class="${CSS_CLASSES.errorContent}">
        <span class="${CSS_CLASSES.errorIcon}">⚠️</span>
        <span class="${CSS_CLASSES.errorText}">${message}</span>
        <button class="${CSS_CLASSES.errorClose}" onclick="window.hideErrorMessage()">${UI_MESSAGES.closeModal}</button>
      </div>
    </div>
  `;
}

/**
 * Creates error container element
 * @function createErrorContainer
 * @returns {HTMLElement} Error container DOM element
 */
export function createErrorContainer() {
  const container = document.createElement("div");
  container.id = ELEMENT_IDS.errorContainer;
  container.className = CSS_CLASSES.errorContainer;
  return container;
}

/**
 * Creates HTML for toast notification
 * @function createToastHTML
 * @param {string} message - Toast message
 * @param {string} type - Toast type (info, success, error)
 * @returns {HTMLElement} Toast notification DOM element
 */
export function createToastHTML(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `${CSS_CLASSES.toast} ${CSS_CLASSES.toast}-${type}`;
  toast.textContent = message;
  return toast;
}

/**
 * Creates HTML for search status display
 * @function createSearchStatusHTML
 * @param {number} count - Number of results found
 * @param {string} query - Search query
 * @returns {string} Search status message
 */
export function createSearchStatusHTML(count, query = "") {
  if (count === 0) {
    return UI_MESSAGES.noResultsFound;
  }
  return `${count} Pokémon found${query ? ` for "${query}"` : ""}`;
}

/**
 * Creates HTML for loading indicator
 * @function createLoadingHTML
 * @param {string} message - Loading message to display
 * @returns {string} Loading indicator HTML string
 */
export function createLoadingHTML(message = UI_MESSAGES.loadingPokemon) {
  return `
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-text">${message}</p>
    </div>
  `;
}
