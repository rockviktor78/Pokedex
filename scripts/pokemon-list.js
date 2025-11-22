/**
 * Pokémon List Management Module
 * Handles Pokemon card rendering and list management
 */

// Import dependencies
import { appState } from "./main.js";
import { fetchPokemonList } from "./api.js";
import { setLoadingState, showErrorMessage } from "./ui-helpers.js";
import { createPokemonCardHTML } from "./templates.js";
import { CSS_CLASSES, ELEMENT_IDS } from "./constants.js";

/**
 * Loads the first Pokémon on app start
 * @async
 * @function loadInitialPokemon
 * @returns {Promise<void>}
 */
export let loadInitialPokemon = async () => {
  setLoadingState(true);

  try {
    const pokemonDetails = await fetchPokemonList(0, appState.limit);
    renderPokemonCards(pokemonDetails);
  } catch (error) {
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Loads more Pokémon
 * @async
 * @function loadMorePokemon
 * @returns {Promise<void>}
 */
export let loadMorePokemon = async () => {
  setLoadingState(true);

  try {
    const newOffset = appState.currentOffset + appState.limit;
    const pokemonDetails = await fetchPokemonList(newOffset, appState.limit);
    renderPokemonCards(pokemonDetails);
  } catch (error) {
    showErrorMessage();
  } finally {
    setLoadingState(false);
  }
};

/**
 * Renders Pokémon cards in the container
 * @function renderPokemonCards
 * @param {Array} pokemonArray - Array with Pokémon data
 * @returns {void}
 */
export let renderPokemonCards = (pokemonArray) => {
  const container = document.getElementById(ELEMENT_IDS.pokemonContainer);
  if (!container) return;

  pokemonArray.forEach((pokemon) => {
    const card = createPokemonCard(pokemon);
    container.appendChild(card);
  });
};

/**
 * Creates a single Pokémon card
 * @function createPokemonCard
 * @param {Object} pokemon - Pokémon data from the API
 * @returns {HTMLElement} Pokémon card element
 */
export let createPokemonCard = (pokemon) => {
  const card = document.createElement("div");
  card.className = CSS_CLASSES.pokemonCard;
  card.setAttribute("data-pokemon-id", pokemon.id);

  // Primary type for background color
  const primaryType = pokemon.types[0]?.type.name;
  if (primaryType) {
    card.classList.add(`${CSS_CLASSES.backgroundPrefix}${primaryType}`);
  }

  card.innerHTML = createPokemonCardHTML(pokemon);

  // Event listener for card click - Import from pokemon-detail.js
  card.addEventListener("click", () => {
    // Dynamic import to avoid circular dependency
    import("./pokemon-detail.js")
      .then((module) => {
        module.handlePokemonCardClick(pokemon);
      })
      .catch(() => {
        // Error handled silently
      });
  });

  return card;
};

/**
 * Empty the Pokémon container
 */
export let clearPokemonContainer = () => {
  const container = document.getElementById(ELEMENT_IDS.pokemonContainer);
  if (container) {
    container.innerHTML = "";
  }
};

/**
 * Handles clicking the Load-More button
 */
export let handleLoadMoreClick = () => {
  if (!appState.isLoading) {
    if (appState.isSearchMode) {
      // In search mode, do not load more results
      return;
    }
    loadMorePokemon();
  }
};
