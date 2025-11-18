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
 * Lädt die ersten Pokémon beim App-Start
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
 * Lädt weitere Pokémon
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
 * Rendert Pokémon-Karten im Container
 * @param {Array} pokemonArray - Array mit Pokémon-Daten
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
 * Erstellt eine einzelne Pokémon-Karte
 * @param {Object} pokemon - Pokémon-Daten von der API
 * @returns {HTMLElement} Pokémon-Karten-Element
 */
export let createPokemonCard = (pokemon) => {
  const card = document.createElement("div");
  card.className = CSS_CLASSES.pokemonCard;
  card.setAttribute("data-pokemon-id", pokemon.id);

  // Primärtyp für Hintergrundfarbe
  const primaryType = pokemon.types[0]?.type.name;
  if (primaryType) {
    card.classList.add(`${CSS_CLASSES.backgroundPrefix}${primaryType}`);
  }

  card.innerHTML = createPokemonCardHTML(pokemon);

  // Event Listener für Karten-Klick - Import aus pokemon-detail.js
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
