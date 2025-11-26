/**
 * @fileoverview Pokémon Detail Modal Module
 * @description Handles Pokemon detail view and modal functionality
 * @module pokemon-detail
 */

import { appState } from "./main.js";
import { fetchPokemonDetails, fetchEvolutionChain } from "./api.js";
import { showErrorMessage } from "./ui-helpers.js";
import {
  createModalHTML,
  createEvolutionsTabHTML,
} from "./templates/modal-template.js";
import { createLoadingHTML } from "./templates/ui-elements-template.js";
import { ELEMENT_IDS } from "./constants.js";

let currentPokemonIndex = 0;
let currentPokemonList = [];

/**
 * Handles clicking on a Pokémon card
 * @async
 * @function handlePokemonCardClick
 * @param {Object} pokemon - Pokémon data
 */
export let handlePokemonCardClick = async (pokemon) => {
  try {
    if (appState.isSearchMode && appState.searchResults) {
      currentPokemonList = appState.searchResults;
    } else {
      currentPokemonList = appState.pokemonList;
    }

    currentPokemonIndex = currentPokemonList.findIndex(
      (p) => p.id === pokemon.id
    );

    let detailedPokemon = pokemon;
    if (!pokemon.stats) {
      const response = await fetch(pokemon.url);
      if (!response.ok) throw new Error(`Error loading ${pokemon.name}`);
      detailedPokemon = await response.json();
    }

    openPokemonModal(detailedPokemon);
  } catch (error) {
    showErrorMessage();
  }
};

/**
 * Shows modal with accessibility setup
 * @function showModalWithAccessibility
 * @param {HTMLElement} modal - Modal element
 */
function showModalWithAccessibility(modal) {
  modal.classList.remove("hidden");
  modal.classList.add("visible");
  modal.style.display = "flex";
  modal.removeAttribute("inert");
  document.body.style.overflow = "hidden";
  modal.focus();
}

/**
 * Sets up modal content and styling
 * @function setupModalContent
 * @param {HTMLElement} modalContent - Modal content element
 * @param {Object} pokemon - Pokémon data object
 */
function setupModalContent(modalContent, pokemon) {
  modalContent.innerHTML = createModalHTML(pokemon);
  const primaryType = pokemon.types[0]?.type.name || "normal";
  modalContent.className = `pokemon-detail ${primaryType}`;
}

/**
 * Asynchronously loads and populates the evolution data for the current Pokémon.
 * @async
 * @param {Object} pokemon - The detailed Pokémon data object.
 */
async function loadEvolutionData(pokemon) {
  const evolutionTabPane = document.getElementById("Evolutions");
  if (!evolutionTabPane) return;

  try {
    evolutionTabPane.innerHTML = createLoadingHTML("Loading evolutions...");

    const evolutionChain = await fetchEvolutionChain(pokemon.species.url);
    evolutionTabPane.innerHTML = createEvolutionsTabHTML(evolutionChain);
  } catch (error) {
    evolutionTabPane.innerHTML = "<p>Could not load evolution data.</p>";
  }
}

/**
 * Opens Pokemon modal with details
 * @function openPokemonModal
 * @param {Object} pokemon - Pokemon data object
 */
export let openPokemonModal = (pokemon) => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const modalContent = document.getElementById("pokemonDetailContent");

  if (modal && modalContent) {
    showModalWithAccessibility(modal);
    setupModalContent(modalContent, pokemon);
    updateNavigationArrows();
    loadEvolutionData(pokemon);
  }
};
/**
 * Closes the Pokémon modal
 * @function closePokemonModal
 */
export let closePokemonModal = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  if (modal) {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    modal.style.display = "none";

    modal.setAttribute("inert", "");

    document.body.style.overflow = "auto";
  }
};

/**
 * Navigates to the previous Pokémon
 * @async
 * @function goToPreviousPokemon
 */
export let goToPreviousPokemon = async () => {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    await loadPokemonAtIndex(currentPokemonIndex);
  }
};

/**
 * Navigates to the next Pokémon
 * @async
 * @function goToNextPokemon
 */
export let goToNextPokemon = async () => {
  if (currentPokemonIndex < currentPokemonList.length - 1) {
    currentPokemonIndex++;
    await loadPokemonAtIndex(currentPokemonIndex);
  }
};

/**
 * Loads Pokémon at a specific index
 * @async
 * @function loadPokemonAtIndex
 * @param {number} index - Index in the current Pokémon array
 */
let loadPokemonAtIndex = async (index) => {
  const modalContent = document.getElementById("pokemonDetailContent");
  if (!modalContent) return;

  try {
    const pokemon = currentPokemonList[index];
    if (!pokemon) return;

    modalContent.innerHTML = createLoadingHTML("Loading Pokémon...");

    let detailedPokemon = pokemon;
    if (!pokemon.stats) {
      const response = await fetch(pokemon.url);
      if (!response.ok) throw new Error(`Error loading ${pokemon.name}`);
      detailedPokemon = await response.json();
    }

    setupModalContent(modalContent, detailedPokemon);
    updateNavigationArrows();
    await loadEvolutionData(detailedPokemon);
  } catch (error) {
    showErrorMessage();
  }
};

/**
 * Updates the navigation arrows visibility and state
 * @function updateNavigationArrows
 */
let updateNavigationArrows = () => {
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");

  if (prevButton) {
    prevButton.disabled = currentPokemonIndex <= 0;
    prevButton.style.opacity = currentPokemonIndex <= 0 ? "0.5" : "1";
  }

  if (nextButton) {
    nextButton.disabled = currentPokemonIndex >= currentPokemonList.length - 1;
    nextButton.style.opacity =
      currentPokemonIndex >= currentPokemonList.length - 1 ? "0.5" : "1";
  }
};

/**
 * Switches between tabs in the Pokémon modal
 * @param {Event} event - The click event
 * @param {string} tabName - The name of the tab to switch to
 */
window.switchTab = (event, tabName) => {
  // Hide all tab panes
  const tabPanes = document.querySelectorAll(".tab-pane");
  tabPanes.forEach((pane) => pane.classList.remove("active"));

  // Deactivate all tab links
  const tabLinks = document.querySelectorAll(".tab-link");
  tabLinks.forEach((link) => link.classList.remove("active"));

  // Show the selected tab pane and activate the link
  document.getElementById(tabName).classList.add("active");
  event.currentTarget.classList.add("active");
};

/**
 * Initializes Modal Event Listeners
 * @function initializeModalEventListeners
 */
export let initializeModalEventListeners = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");
  const closeButton = document.getElementById("closeModalButton");

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closePokemonModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closePokemonModal();
      }

      if (!modal.classList.contains("hidden")) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPreviousPokemon();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNextPokemon();
        }
      }
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", (e) => {
      e.stopPropagation();
      goToPreviousPokemon();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      e.stopPropagation();
      goToNextPokemon();
    });
  }

  window.closePokemonModal = closePokemonModal;
  window.goToPreviousPokemon = goToPreviousPokemon;
  window.goToNextPokemon = goToNextPokemon;

  const modalElement = document.getElementById(ELEMENT_IDS.pokemonModal);
  if (modalElement) {
    modalElement.setAttribute("inert", "");
  }
};
