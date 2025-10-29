/**
 * Pokemon Templates Module
 * HTML template functions for Pokemon cards and detail views
 */

import {
  CSS_CLASSES,
  STAT_TRANSLATIONS,
  UI_MESSAGES,
  API_CONFIG,
  POKEMON_TYPES,
} from "./constants.js";

/**
 * Wählt das beste verfügbare Pokémon-Bild mit höchster Auflösung
 * @param {Object} pokemon - Pokémon-Daten von der API
 * @returns {string} URL des besten verfügbaren Bildes
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

  // Fallback zu einem Platzhalter
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
}

/**
 * Erstellt HTML für eine Pokémon-Karte
 * @param {Object} pokemon - Pokémon-Daten von der API
 * @returns {string} HTML-String für die Karte
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
 * @param {Object} pokemon - Detaillierte Pokémon-Daten
 * @returns {string} HTML-String für Modal
 */
export function createModalHTML(pokemon) {
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
    
    <div class="${CSS_CLASSES.modalBody}">
      <div class="${CSS_CLASSES.modalImageSection}">
        <img 
          src="${getBestPokemonImage(pokemon)}" 
          alt="${pokemon.name}" 
          class="${CSS_CLASSES.modalPokemonImage}"
        >
      </div>
      
      <div class="${CSS_CLASSES.modalInfoSection}">
        <div class="${CSS_CLASSES.modalTypes}">
          ${createModalTypesHTML(pokemon.types)}
        </div>
        
        <div class="${CSS_CLASSES.modalStats}">
          <h3>${UI_MESSAGES.baseStats}</h3>
          <div class="${CSS_CLASSES.statsGrid}">
            ${createStatsHTML(pokemon.stats)}
          </div>
        </div>
        
        <div class="${CSS_CLASSES.modalPhysical}">
          <h3>${UI_MESSAGES.physicalProperties}</h3>
          <div class="${CSS_CLASSES.physicalStats}">
            ${createPhysicalStatsHTML(pokemon)}
          </div>
        </div>
        
        <div class="${CSS_CLASSES.modalAbilities}">
          <h3>${UI_MESSAGES.abilities}</h3>
          <div class="${CSS_CLASSES.abilitiesList}">
            ${createAbilitiesHTML(pokemon.abilities)}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Erstellt HTML für Modal-Typ-Anzeige
 * @param {Array} types - Pokémon-Typen
 * @returns {string} HTML für Typen
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
 * @param {Array} stats - Pokémon-Statistiken
 * @returns {string} HTML für Stats
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
          <span class="${CSS_CLASSES.statName}">${translatedName}</span>
          <div class="${CSS_CLASSES.statBarContainer}">
            <div class="${CSS_CLASSES.statBar}" style="width: ${statWidth}%"></div>
            <span class="${CSS_CLASSES.statValue}">${stat.base_stat}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Erstellt HTML für physische Eigenschaften
 * @param {Object} pokemon - Pokémon-Daten
 * @returns {string} HTML für physische Stats
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
 * @param {Array} abilities - Pokémon-Fähigkeiten
 * @returns {string} HTML für Abilities
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
