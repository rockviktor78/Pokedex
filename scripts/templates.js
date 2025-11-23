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

  // High-resolution images (in order of priority)
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
 * @function createPokemonCardHTML
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} Pokémon card HTML string
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
 * Creates modal header HTML
 * @function createModalHeaderHTML
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} Modal header HTML string
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
 * Creates the HTML for the "About" tab content
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} HTML string for the "About" tab
 */
function createAboutTabHTML(pokemon) {
    return `
        <div class="modal-tab-content">
            <h3>${UI_MESSAGES.physicalProperties}</h3>
            <div class="${CSS_CLASSES.physicalStats}">${createPhysicalStatsHTML(pokemon)}</div>
        </div>
    `;
}


/**
 * Creates the HTML for the "Base Stats" tab content
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} HTML string for the "Base Stats" tab
 */
function createBaseStatsTabHTML(pokemon) {
    return `
        <div class="modal-tab-content">
            <h3>${UI_MESSAGES.baseStats}</h3>
            <div class="${CSS_CLASSES.statsGrid}">${createStatsHTML(pokemon.stats)}</div>
        </div>
    `;
}


/**
 * Creates the HTML for the "Abilities" tab content
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} HTML string for the "Abilities" tab
 */
function createAbilitiesTabHTML(pokemon) {
    return `
        <div class="modal-tab-content">
            <h3>${UI_MESSAGES.abilities}</h3>
            <div class="${CSS_CLASSES.abilitiesList}">${createAbilitiesHTML(pokemon.abilities)}</div>
        </div>
    `;
}


/**
 * Creates the HTML for the "Evolutions" tab content by parsing the evolution chain.
 * @param {Object} evolutionChain - The raw evolution chain data from the API.
 * @returns {string} HTML string for the "Evolutions" tab content.
 */
export function createEvolutionsTabHTML(evolutionChain) {
    if (!evolutionChain || !evolutionChain.chain) {
        return '<div class="modal-tab-content"><p>No evolution data available for this Pokémon.</p></div>';
    }

    // Recursive function to parse the chain
    const parseChain = (chainNode) => {
        const parts = chainNode.species.url.split('/').filter(Boolean);
        const pokemonId = parts[parts.length - 1];
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

        let html = `
            <div class="evolution-stage">
                <img src="${imageUrl}" alt="${chainNode.species.name}" class="evolution-image">
                <span class="evolution-name">${chainNode.species.name}</span>
            </div>
        `;

        if (chainNode.evolves_to.length > 0) {
            html += '<div class="evolution-arrow">→</div>';
            // Handle multiple evolutions (e.g., Eevee)
            const nextStages = chainNode.evolves_to.map(nextNode => parseChain(nextNode)).join('');
            html += `<div class="next-evolution-stages">${nextStages}</div>`;
        }

        return html;
    };

    const evolutionHTML = parseChain(evolutionChain.chain);

    return `
        <div class="modal-tab-content">
            <h3>Evolutions</h3>
            <div class="evolution-chain-container">${evolutionHTML}</div>
        </div>
    `;
}


/**
 * Creates the HTML for the tab navigation
 * @returns {string} HTML string for the tab navigation
 */
function createTabNavigationHTML() {
    return `
        <div class="tab-nav">
            <button class="tab-link active" onclick="switchTab(event, 'About')">1</button>
            <button class="tab-link" onclick="switchTab(event, 'Base Stats')">2</button>
            <button class="tab-link" onclick="switchTab(event, 'Abilities')">3</button>
            <button class="tab-link" onclick="switchTab(event, 'Evolutions')">4</button>
        </div>
    `;
}


/**
 * Creates the HTML for all tab content panes
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} HTML string for all tab panes
 */
function createTabContentHTML(pokemon) {
    // The Evolutions tab is now populated asynchronously, so we leave it empty initially.
    return `
        <div class="tab-content">
            <div id="About" class="tab-pane active">${createAboutTabHTML(pokemon)}</div>
            <div id="Base Stats" class="tab-pane">${createBaseStatsTabHTML(pokemon)}</div>
            <div id="Abilities" class="tab-pane">${createAbilitiesTabHTML(pokemon)}</div>
            <div id="Evolutions" class="tab-pane"></div>
        </div>
    `;
}


/**
 * Creates modal body HTML with a tabbed interface
 * @function createModalBodyHTML
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} Modal body HTML string
 */
function createModalBodyHTML(pokemon) {
  return `
    <div class="${CSS_CLASSES.modalBody}">
      <div class="${CSS_CLASSES.modalImageSection}">
        <img src="${getBestPokemonImage(pokemon)}" alt="${pokemon.name}" class="${CSS_CLASSES.modalPokemonImage}">
      </div>
      <div class="${CSS_CLASSES.modalInfoSection}">
        <div class="${CSS_CLASSES.modalTypes}">${createModalTypesHTML(pokemon.types)}</div>
        ${createTabNavigationHTML()}
        ${createTabContentHTML(pokemon)}
      </div>
    </div>
  `;
}

/**
 * Creates complete modal HTML
 * @function createModalHTML
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} Complete modal HTML string
 */
export function createModalHTML(pokemon) {
  return createModalHeaderHTML(pokemon) + createModalBodyHTML(pokemon);
}

/**
 * Creates HTML for modal type display
 * @function createModalTypesHTML
 * @param {Array} types - Array of Pokémon type objects
 * @returns {string} Type badges HTML string
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
 * Creates HTML for stats
 * @function createStatsHTML
 * @param {Array} stats - Array of Pokémon stat objects
 * @returns {string} Stats display HTML string
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
 * Creates HTML for physical properties
 * @function createPhysicalStatsHTML
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} Physical stats HTML string
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
 * Creates HTML for abilities
 * @function createAbilitiesHTML
 * @param {Array} abilities - Array of Pokémon ability objects
 * @returns {string} Abilities HTML string
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
