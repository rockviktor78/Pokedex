/**
 * @fileoverview Pokémon Detail Modal Module
 * @description Handles Pokemon detail view and modal functionality
 * @module pokemon-detail
 */

// Import dependencies
import { appState } from "./main.js";
import { fetchPokemonDetails } from "./api.js";
import { showErrorMessage } from "./ui-helpers.js";
import { createModalHTML } from "./templates.js";
import { ELEMENT_IDS } from "./constants.js";

// Current Pokemon index for navigation
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
    // Set current Pokemon list based on current mode
    if (appState.isSearchMode && appState.searchResults) {
      currentPokemonList = appState.searchResults;
    } else {
      currentPokemonList = appState.pokemonList;
    }

    // Find current Pokemon index
    currentPokemonIndex = currentPokemonList.findIndex(
      (p) => p.id === pokemon.id
    );

    // Use the pokemon directly if it has detailed data, otherwise fetch
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

    // Accessibility: Modal is hidden and not interactive
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
  try {
    const pokemon = currentPokemonList[index];
    if (!pokemon) return;

    // Show loading state in modal
    const modalContent = document.getElementById("pokemonDetailContent");
    if (modalContent) {
      modalContent.innerHTML =
        '<div class="pokemon-detail-loading"><div class="spinner"></div><p>Loading Pokémon...</p></div>';
    }

    // Use the pokemon directly if it has detailed data, otherwise fetch
    let detailedPokemon = pokemon;
    if (!pokemon.stats) {
      const response = await fetch(pokemon.url);
      if (!response.ok) throw new Error(`Error loading ${pokemon.name}`);
      detailedPokemon = await response.json();
    }

    // Update modal content
    if (modalContent) {
      modalContent.innerHTML = createModalHTML(detailedPokemon);
    }

    updateNavigationArrows();
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
 * Initializes Modal Event Listeners
 * @function initializeModalEventListeners
 */
export let initializeModalEventListeners = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");
  const closeButton = document.getElementById("closeModalButton");

  if (modal) {
    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closePokemonModal();
      }
    });

    // Close with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closePokemonModal();
      }

      // Arrow key navigation
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

  // Navigation button event listeners
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

  // Global functions for modal (for onclick)
  window.closePokemonModal = closePokemonModal;
  window.goToPreviousPokemon = goToPreviousPokemon;
  window.goToNextPokemon = goToNextPokemon;

  // Initial Accessibility Setup - The modal should be closed.
  const modalElement = document.getElementById(ELEMENT_IDS.pokemonModal);
  if (modalElement) {
    modalElement.setAttribute("inert", "");
  }
};
