/**
 * UI Templates Module
 * HTML template functions for UI elements (search, error, toast)
 */

import {
  CSS_CLASSES,
  UI_MESSAGES,
  API_CONFIG,
  ELEMENT_IDS,
} from "./constants.js";

/**
 * Erstellt HTML für einzelnes Autocomplete-Item
 * @param {Object|string} pokemon - Pokémon-Objekt oder Name
 * @param {string} query - Suchbegriff für Hervorhebung
 * @returns {string} HTML für Autocomplete-Item
 */
export function createAutocompleteItemHTML(pokemon, query) {
  // Unterstützung für beide Formate: Objekt mit .name oder direkt String
  const name = typeof pokemon === "string" ? pokemon : pokemon.name;

  // Hervorhebung des Suchbegriffs
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
 * Erstellt HTML für Autocomplete-Container mit Ergebnissen
 * @param {Array} matches - Passende Pokémon-Objekte oder Namen
 * @param {string} query - Suchbegriff
 * @returns {string} HTML für Autocomplete-Liste
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
 * Erstellt HTML für Fehlermeldung
 * @param {string} message - Fehlermeldung
 * @returns {string} HTML für Fehlermeldung
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
 * Erstellt Error-Container Element
 * @returns {HTMLElement} Error-Container
 */
export function createErrorContainer() {
  const container = document.createElement("div");
  container.id = ELEMENT_IDS.errorContainer;
  container.className = CSS_CLASSES.errorContainer;
  return container;
}

/**
 * Erstellt HTML für Toast-Benachrichtigung
 * @param {string} message - Nachricht
 * @param {string} type - Typ (success, error, info)
 * @returns {HTMLElement} Toast-Element
 */
export function createToastHTML(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `${CSS_CLASSES.toast} ${CSS_CLASSES.toast}-${type}`;
  toast.textContent = message;
  return toast;
}

/**
 * Erstellt HTML für Such-Status-Anzeige
 * @param {number} count - Anzahl gefundener Pokémon
 * @param {string} query - Suchbegriff
 * @returns {string} Status-Nachricht
 */
export function createSearchStatusHTML(count, query = "") {
  if (count === 0) {
    return UI_MESSAGES.noResultsFound;
  }

  return `${count} Pokémon gefunden${query ? ` für "${query}"` : ""}`;
}

/**
 * Erstellt HTML für Loading-Indikator
 * @param {string} message - Loading-Nachricht
 * @returns {string} HTML für Loading-State
 */
export function createLoadingHTML(message = UI_MESSAGES.loadingPokemon) {
  return `
    <div class="loading-content">
      <div class="spinner"></div>
      <p class="loading-text">${message}</p>
    </div>
  `;
}

/**
 * Erstellt HTML für "Keine Ergebnisse" Anzeige
 * @param {string} query - Suchbegriff
 * @returns {string} HTML für No-Results-State
 */
export function createNoResultsHTML(query = "") {
  return `
    <div class="no-results-container">
      <div class="no-results-icon">🔍</div>
      <h3 class="no-results-title">${UI_MESSAGES.noResultsFound}</h3>
      ${
        query
          ? `<p class="no-results-text">Keine Pokémon gefunden für "${query}"</p>`
          : ""
      }
      <p class="no-results-hint">Versuche einen anderen Suchbegriff</p>
    </div>
  `;
}

/**
 * Erstellt HTML für Retry-Button
 * @param {string} onClickHandler - Name der Funktion für onclick
 * @returns {string} HTML für Retry-Button
 */
export function createRetryButtonHTML(onClickHandler = "window.retryAction") {
  return `
    <button class="retry-button" type="button" onclick="${onClickHandler}">
      ${UI_MESSAGES.retryButton}
    </button>
  `;
}

/**
 * Erstellt HTML für Skip-to-Content Link (Accessibility)
 * @returns {string} HTML für Skip-Link
 */
export function createSkipToContentHTML() {
  return `
    <a href="#main-content" class="skip-to-content">
      Zum Hauptinhalt springen
    </a>
  `;
}

/**
 * Erstellt HTML für Breadcrumb-Navigation
 * @param {Array} breadcrumbs - Array mit {text, url} Objekten
 * @returns {string} HTML für Breadcrumbs
 */
export function createBreadcrumbHTML(breadcrumbs) {
  return `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb-list">
        ${breadcrumbs
          .map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
            <li class="breadcrumb-item${isLast ? " active" : ""}">
              ${
                isLast
                  ? `<span aria-current="page">${crumb.text}</span>`
                  : `<a href="${crumb.url}">${crumb.text}</a>`
              }
            </li>
          `;
          })
          .join("")}
      </ol>
    </nav>
  `;
}
