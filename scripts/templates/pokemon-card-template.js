import { CSS_CLASSES, API_CONFIG } from "../constants.js";

/**
 * Selects the best available Pokémon image with highest resolution
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} URL of the best image
 */
export function getBestPokemonImage(pokemon) {
  const sprites = pokemon.sprites;
  const officialArtwork = sprites.other?.["official-artwork"]?.front_default;
  const home = sprites.other?.home?.front_default;
  const dreamWorld = sprites.other?.dream_world?.front_default;
  const defaultSprite = sprites.front_default;
  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return officialArtwork || home || dreamWorld || defaultSprite || fallback;
}

/**
 * Creates the HTML for the card's header section.
 * @param {Object} pokemon - The Pokémon data object.
 * @returns {string} The HTML string for the card header.
 */
function createCardHeaderHTML(pokemon) {
    const paddedId = pokemon.id.toString().padStart(API_CONFIG.pokemonIdPadding, "0");
    return `
        <div class="${CSS_CLASSES.pokemonCardHeader}">
          <h3 class="${CSS_CLASSES.pokemonName}">${pokemon.name.toUpperCase()}</h3>
          <span class="${CSS_CLASSES.pokemonId}">#${paddedId}</span>
        </div>
    `;
}

/**
 * Creates the HTML for the card's image section.
 * @param {Object} pokemon - The Pokémon data object.
 * @returns {string} The HTML string for the card image.
 */
function createCardImageHTML(pokemon) {
    return `
        <div class="${CSS_CLASSES.pokemonImageContainer}">
          <img 
            src="${getBestPokemonImage(pokemon)}" 
            alt="${pokemon.name}" 
            class="${CSS_CLASSES.pokemonImage}"
            loading="lazy"
          >
        </div>
    `;
}

/**
 * Creates the HTML for the card's types section.
 * @param {Object} pokemon - The Pokémon data object.
 * @returns {string} The HTML string for the card types.
 */
function createCardTypesHTML(pokemon) {
    const typeElements = pokemon.types
        .map(
          (typeInfo) =>
            `<span class="${CSS_CLASSES.pokemonType} ${CSS_CLASSES.typePrefix}${typeInfo.type.name}">${typeInfo.type.name}</span>`
        )
        .join("");
    return `<div class="${CSS_CLASSES.pokemonTypes}">${typeElements}</div>`;
}

/**
 * Creates HTML for a Pokémon card
 * @function createPokemonCardHTML
 * @param {Object} pokemon - Pokémon data object
 * @returns {string} Pokémon card HTML string
 */
export function createPokemonCardHTML(pokemon) {
    const header = createCardHeaderHTML(pokemon);
    const image = createCardImageHTML(pokemon);
    const types = createCardTypesHTML(pokemon);

    return `${header}${image}${types}`;
}
