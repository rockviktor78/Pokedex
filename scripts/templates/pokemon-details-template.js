import {
  CSS_CLASSES,
  STAT_TRANSLATIONS,
  UI_MESSAGES,
  API_CONFIG,
} from "../constants.js";

/**
 * Creates HTML for modal type display
 * @function createModalTypesHTML
 * @param {Array} types - Array of Pokémon type objects
 * @returns {string} Type badges HTML string
 */
export function createModalTypesHTML(types) {
  return types
    .map(
      (typeInfo) =>
        `<span class="${CSS_CLASSES.pokemonType} ${CSS_CLASSES.typePrefix}${typeInfo.type.name}">${typeInfo.type.name}</span>`
    )
    .join("");
}

/**
 * Creates HTML for a single stat entry.
 * @param {Object} stat - A Pokémon stat object.
 * @returns {string} The HTML string for the stat entry.
 */
function createSingleStatHTML(stat) {
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
}

/**
 * Creates HTML for stats
 * @function createStatsHTML
 * @param {Array} stats - Array of Pokémon stat objects
 * @returns {string} Stats display HTML string
 */
export function createStatsHTML(stats) {
  return stats.map(createSingleStatHTML).join("");
}

/**
 * Creates HTML for physical properties
 * @function createPhysicalStatsHTML
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} Physical stats HTML string
 */
export function createPhysicalStatsHTML(pokemon) {
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
export function createAbilitiesHTML(abilities) {
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
