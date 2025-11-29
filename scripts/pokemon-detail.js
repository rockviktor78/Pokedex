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
 * Sets up current pokemon list based on search mode
 */
let setupCurrentPokemonList = (pokemon) => {
  if (appState.isSearchMode && appState.searchResults) {
    currentPokemonList = appState.searchResults;
  } else {
    currentPokemonList = appState.pokemonList;
  }
  currentPokemonIndex = currentPokemonList.findIndex(
    (p) => p.id === pokemon.id
  );
};

/**
 * Fetches detailed pokemon data if needed
 */
let fetchDetailedPokemon = async (pokemon) => {
  if (pokemon.stats) return pokemon;

  const response = await fetch(pokemon.url);
  if (!response.ok) throw new Error(`Error loading ${pokemon.name}`);
  return await response.json();
};

/**
 * Handles clicking on a Pokémon card
 * @async
 * @function handlePokemonCardClick
 * @param {Object} pokemon - Pokémon data
 */
export let handlePokemonCardClick = async (pokemon) => {
  try {
    setupCurrentPokemonList(pokemon);
    const detailedPokemon = await fetchDetailedPokemon(pokemon);
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
  const scrollToTopButton = document.getElementById("scrollToTopButton");

  if (modal && modalContent) {
    showModalWithAccessibility(modal);
    setupModalContent(modalContent, pokemon);
    updateNavigationArrows();
    loadEvolutionData(pokemon);

    if (scrollToTopButton) {
      scrollToTopButton.style.display = "none";
    }
  }
};

/**
 * Hides the modal and sets attributes for accessibility.
 * @param {HTMLElement} modal - The modal element to hide.
 */
function hideModal(modal) {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    modal.style.display = "none";
    modal.setAttribute("inert", "");
}

/**
 * Restores page scrollability and shows the scroll-to-top button.
 */
function restorePageScroll() {
    document.body.style.overflow = "auto";
    const scrollToTopButton = document.getElementById("scrollToTopButton");
    if (scrollToTopButton) {
        scrollToTopButton.style.display = "block";
    }
}

/**
 * Closes the Pokémon modal.
 * @function closePokemonModal
 */
export let closePokemonModal = () => {
    const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
    if (modal) {
        hideModal(modal);
        restorePageScroll();
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
 * Updates modal with pokemon details
 */
let updateModalWithPokemon = async (modalContent, detailedPokemon) => {
  setupModalContent(modalContent, detailedPokemon);
  updateNavigationArrows();
  await loadEvolutionData(detailedPokemon);
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
    const detailedPokemon = await fetchDetailedPokemon(pokemon);
    await updateModalWithPokemon(modalContent, detailedPokemon);
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
 * Sets up modal overlay click listener
 */
let setupModalOverlayListener = (modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closePokemonModal();
    }
  });
};

/**
 * Handles arrow key navigation
 */
let handleArrowKeyNavigation = (e, modal) => {
  if (modal.classList.contains("hidden")) return;

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    goToPreviousPokemon();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    goToNextPokemon();
  }
};

/**
 * Sets up keyboard navigation
 */
let setupKeyboardNavigation = (modal) => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closePokemonModal();
    }
    handleArrowKeyNavigation(e, modal);
  });
};

/**
 * Sets up navigation buttons
 */
let setupNavigationButtons = (prevButton, nextButton) => {
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
};

/**
 * Exposes functions globally
 */
let exposeGlobalFunctions = () => {
  window.closePokemonModal = closePokemonModal;
  window.goToPreviousPokemon = goToPreviousPokemon;
  window.goToNextPokemon = goToNextPokemon;
};

/**
 * Initializes Modal Event Listeners
 * @function initializeModalEventListeners
 */
export let initializeModalEventListeners = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");

  if (modal) {
    setupModalOverlayListener(modal);
    setupKeyboardNavigation(modal);
    modal.setAttribute("inert", "");
  }

  setupNavigationButtons(prevButton, nextButton);
  exposeGlobalFunctions();
};
