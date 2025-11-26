import { CSS_CLASSES, API_CONFIG } from "../constants.js";

/**
 * Selects the best available Pokémon image with highest resolution
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} URL of the best image
 */
export function getBestPokemonImage(pokemon) {
  const sprites = pokemon.sprites;

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
