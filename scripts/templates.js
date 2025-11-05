/**
 * Template Functions Module
 * Handles all HTML template generation
 */

// Import constants for styling and UI
import {
  CSS_CLASSES,
  POKEMON_TYPES,
  STAT_TRANSLATIONS,
  UI_MESSAGES,
  API_CONFIG,
  ELEMENT_IDS,
} from "./constants.js";

/**
 * Selects the best available Pokémon image with highest resolution
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} URL of the best image
 */
function getBestPokemonImage(pokemon) {
  const sprites = pokemon.sprites;

  // Hochauflösende Bilder (in Prioritätsreihenfolge)
  if (sprites.other?.["official-artwork"]?.front_default) {
    return sprites.other["official-artwork"].front_default;
  }
  if (sprites.other?.home?.front_default) {
    return sprites.other.home.front_default;
  }
  if (sprites.other?.dream_world?.front_default) {
    return sprites.other.dream_world.front_default;
  }
  if (sprites.front_default) {
    return sprites.front_default;
  }

  // Fallback to a placeholder
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
}

/**
 * Creates HTML for a Pokémon card
 */
export function createPokemonCardHTML(pokemon) {
  const typeElements = pokemon.types
    .map(
      (typeInfo) =>
        `<span class="${CSS_CLASSES.pokemonType} ${CSS_CLASSES.typePrefix}${typeInfo.type.name}">${typeInfo.type.name}</span>`
    )
    .join("");

  return `
    <div class="${CSS_CLASSES.pokemonCardHeader}">
      <h3 class="${CSS_CLASSES.pokemonName}">${pokemon.name.toUpperCase()}</h3>
      <span class="${CSS_CLASSES.pokemonId}">#${pokemon.id
    .toString()
    .padStart(API_CONFIG.pokemonIdPadding, "0")}</span>
    </div>
    <div class="${CSS_CLASSES.pokemonImageContainer}">
      <img 
        src="${getBestPokemonImage(pokemon)}" 
        alt="${pokemon.name}" 
        class="${CSS_CLASSES.pokemonImage}"
        loading="lazy"
      >
    </div>
    <div class="${CSS_CLASSES.pokemonTypes}">
      ${typeElements}
    </div>
  `;
}

/**
 * Erstellt HTML für Modal-Inhalt
 */
/**
 * Creates modal header HTML
 */
function createModalHeaderHTML(pokemon) {
  const primaryType = pokemon.types[0]?.type.name || POKEMON_TYPES.normal;

  return `
    <div class="${CSS_CLASSES.modalHeader} ${primaryType}">
      <div class="${CSS_CLASSES.modalTitleSection}">
        <h2 class="${
          CSS_CLASSES.modalPokemonName
        }">${pokemon.name.toUpperCase()}</h2>
        <span class="${CSS_CLASSES.modalPokemonId}">#${pokemon.id
    .toString()
    .padStart(API_CONFIG.pokemonIdPadding, "0")}</span>
      </div>
      <button class="${
        CSS_CLASSES.modalClose
      }" onclick="window.closePokemonModal()">${UI_MESSAGES.closeModal}</button>
    </div>
  `;
}

/**
 * Creates modal body HTML
 */
function createModalBodyHTML(pokemon) {
  return `
    <div class="${CSS_CLASSES.modalBody}">
      <div class="${CSS_CLASSES.modalImageSection}">
        <img src="${getBestPokemonImage(pokemon)}" alt="${
    pokemon.name
  }" class="${CSS_CLASSES.modalPokemonImage}">
      </div>
      <div class="${CSS_CLASSES.modalInfoSection}">
        <div class="${CSS_CLASSES.modalTypes}">${createModalTypesHTML(
    pokemon.types
  )}</div>
        <div class="${CSS_CLASSES.modalStats}">
          <h3>${UI_MESSAGES.baseStats}</h3>
          <div class="${CSS_CLASSES.statsGrid}">${createStatsHTML(
    pokemon.stats
  )}</div>
        </div>
        <div class="${CSS_CLASSES.modalPhysical}">
          <h3>${UI_MESSAGES.physicalProperties}</h3>
          <div class="${CSS_CLASSES.physicalStats}">${createPhysicalStatsHTML(
    pokemon
  )}</div>
        </div>
        <div class="${CSS_CLASSES.modalAbilities}">
          <h3>${UI_MESSAGES.abilities}</h3>
          <div class="${CSS_CLASSES.abilitiesList}">${createAbilitiesHTML(
    pokemon.abilities
  )}</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates complete modal HTML
 */
export function createModalHTML(pokemon) {
  return createModalHeaderHTML(pokemon) + createModalBodyHTML(pokemon);
}

/**
 * Erstellt HTML für Modal-Typ-Anzeige
 */
function createModalTypesHTML(types) {
  return types
    .map(
      (typeInfo) =>
        `<span class="${CSS_CLASSES.pokemonType} ${CSS_CLASSES.typePrefix}${typeInfo.type.name}">${typeInfo.type.name}</span>`
    )
    .join("");
}

/**
 * Erstellt HTML für Statistiken
 */
function createStatsHTML(stats) {
  return stats
    .map((stat) => {
      const statWidth =
        (Math.min(stat.base_stat, API_CONFIG.maxStatValue) /
          API_CONFIG.maxStatValue) *
        100;
      const translatedName =
        STAT_TRANSLATIONS[stat.stat.name] || stat.stat.name;

      return `
        <div class="${CSS_CLASSES.statItem}">
          <span class="${CSS_CLASSES.statName}">${translatedName}: ${stat.base_stat}</span>
          <div class="${CSS_CLASSES.statBarContainer}">
            <div class="${CSS_CLASSES.statBar}" style="width: ${statWidth}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Erstellt HTML für physische Eigenschaften
 */
function createPhysicalStatsHTML(pokemon) {
  const height = (pokemon.height / API_CONFIG.heightDivisor).toFixed(1);
  const weight = (pokemon.weight / API_CONFIG.weightDivisor).toFixed(1);

  return `
    <div class="${CSS_CLASSES.physicalItem}">
      <span class="${CSS_CLASSES.physicalLabel}">${UI_MESSAGES.height}</span>
      <span class="${CSS_CLASSES.physicalValue}">${height} m</span>
    </div>
    <div class="${CSS_CLASSES.physicalItem}">
      <span class="${CSS_CLASSES.physicalLabel}">${UI_MESSAGES.weight}</span>
      <span class="${CSS_CLASSES.physicalValue}">${weight} kg</span>
    </div>
  `;
}

/**
 * Erstellt HTML für Fähigkeiten
 */
function createAbilitiesHTML(abilities) {
  return abilities
    .map((abilityInfo) => {
      const hiddenClass = abilityInfo.is_hidden
        ? ` ${CSS_CLASSES.hiddenAbility}`
        : "";
      const hiddenLabel = abilityInfo.is_hidden
        ? UI_MESSAGES.hiddenAbilityLabel
        : "";

      return `
        <span class="${CSS_CLASSES.abilityItem}${hiddenClass}">
          ${abilityInfo.ability.name}${hiddenLabel}
        </span>
      `;
    })
    .join("");
}

// ===== UI TEMPLATES =====

/**
 * Erstellt HTML für einzelnes Autocomplete-Item
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
 * Erstellt HTML für Autocomplete-Container mit Ergebnissen
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
 */
export function createErrorContainer() {
  const container = document.createElement("div");
  container.id = ELEMENT_IDS.errorContainer;
  container.className = CSS_CLASSES.errorContainer;
  return container;
}

/**
 * Erstellt HTML für Toast-Benachrichtigung
 */
export function createToastHTML(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `${CSS_CLASSES.toast} ${CSS_CLASSES.toast}-${type}`;
  toast.textContent = message;
  return toast;
}

/**
 * Erstellt HTML für Such-Status-Anzeige
 */
export function createSearchStatusHTML(count, query = "") {
  if (count === 0) {
    return UI_MESSAGES.noResultsFound;
  }
  return `${count} Pokémon found${query ? ` for "${query}"` : ""}`;
}

/**
 * Erstellt HTML für Loading-Indikator
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
 * Creates HTML for "No Results" display
 */
export function createNoResultsHTML(query = "") {
  return `
    <div class="no-results-container">
      <div class="no-results-icon">🔍</div>
      <h3 class="no-results-title">${UI_MESSAGES.noResultsFound}</h3>
      ${
        query
          ? `<p class="no-results-text">No Pokémon found for "${query}"</p>`
          : ""
      }
      <p class="no-results-hint">Try a different search term</p>
    </div>
  `;
}

/**
 * Creates HTML for Retry Button
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
