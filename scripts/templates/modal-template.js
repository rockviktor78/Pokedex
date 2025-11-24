// Import constants for styling and UI
import {
  CSS_CLASSES,
  POKEMON_TYPES,
  UI_MESSAGES,
  API_CONFIG,
} from "../constants.js";
import { getBestPokemonImage } from "./pokemon-card-template.js";
import {
  createModalTypesHTML,
  createStatsHTML,
  createPhysicalStatsHTML,
  createAbilitiesHTML,
} from "./pokemon-details-template.js";

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
 * Creates the inner content for a tab pane.
 * @param {string} title - The title of the tab.
 * @param {string} contentHTML - The HTML content of the tab.
 * @returns {string} HTML string for the tab's inner content.
 */
function createTabPaneContent(title, contentHTML) {
  return `<div class="modal-tab-content"><h3>${title}</h3>${contentHTML}</div>`;
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
    const parts = chainNode.species.url.split("/").filter(Boolean);
    const pokemonId = parts[parts.length - 1];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

    let html = `
            <div class="evolution-stage">
                <img src="${imageUrl}" alt="${
      chainNode.species.name
    }" class="evolution-image">
                <span class="evolution-name">${chainNode.species.name}</span>
            </div>
        `;

    if (chainNode.evolves_to.length > 0) {
      html += '<div class="evolution-arrow">→</div>';
      // Handle multiple evolutions (e.g., Eevee)
      const nextStages = chainNode.evolves_to
        .map((nextNode) => parseChain(nextNode))
        .join("");
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
  const aboutContent = createTabPaneContent(
    UI_MESSAGES.physicalProperties,
    `<div class="${
      CSS_CLASSES.physicalStats
    }">${createPhysicalStatsHTML(pokemon)}</div>`
  );
  const statsContent = createTabPaneContent(
    UI_MESSAGES.baseStats,
    `<div class="${CSS_CLASSES.statsGrid}">${createStatsHTML(
      pokemon.stats
    )}</div>`
  );
  const abilitiesContent = createTabPaneContent(
    UI_MESSAGES.abilities,
    `<div class="${CSS_CLASSES.abilitiesList}">${createAbilitiesHTML(
      pokemon.abilities
    )}</div>`
  );

  return `
        <div class="tab-content">
            <div id="About" class="tab-pane active">${aboutContent}</div>
            <div id="Base Stats" class="tab-pane">${statsContent}</div>
            <div id="Abilities" class="tab-pane">${abilitiesContent}</div>
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
        <img src="${getBestPokemonImage(
          pokemon
        )}" alt="${pokemon.name}" class="${CSS_CLASSES.modalPokemonImage}">
      </div>
      <div class="${CSS_CLASSES.modalInfoSection}">
        <div class="${CSS_CLASSES.modalTypes}">${createModalTypesHTML(
    pokemon.types
  )}</div>
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
