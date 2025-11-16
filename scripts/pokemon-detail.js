/**
 * Pokémon Detail Modal Module
 * Handles Pokemon detail view and modal functionality
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
 * Treats clicking on a Pokémon card
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
      if (!response.ok)
        throw new Error(`Fehler beim Laden von ${pokemon.name}`);
      detailedPokemon = await response.json();
    }

    openPokemonModal(detailedPokemon);
  } catch (error) {
    showErrorMessage();
  }
};

/**
 * Shows modal with accessibility setup
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
 */
function setupModalContent(modalContent, pokemon) {
  modalContent.innerHTML = createModalHTML(pokemon);
  const primaryType = pokemon.types[0]?.type.name || "normal";
  modalContent.className = `pokemon-detail ${primaryType}`;
}

/**
 * Opens Pokemon modal with details
 * @param {Object} pokemon - Pokemon data object
 */
export let openPokemonModal = (pokemon) => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const modalContent = document.getElementById("pokemonDetailContent");

  if (modal && modalContent) {
    showModalWithAccessibility(modal);
    setupModalContent(modalContent, pokemon);
    updateNavigationArrows();
  } else {
    console.error("❌ Modal elements not found!");
  }
};
/**
 * Closes the Pokémon Mode
 */
export let closePokemonModal = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  if (modal) {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    modal.style.display = "none";

    // Accessibility: The modal is hidden and not interactive - use only inertly.
    modal.setAttribute("inert", "");

    document.body.style.overflow = "auto";
  }
};

/**
 * Navigates to the previous Pokémon
 */
export let goToPreviousPokemon = async () => {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    await loadPokemonAtIndex(currentPokemonIndex);
  }
};

/**
 * Navigates to the next Pokémon
 */
export let goToNextPokemon = async () => {
  if (currentPokemonIndex < currentPokemonList.length - 1) {
    currentPokemonIndex++;
    await loadPokemonAtIndex(currentPokemonIndex);
  }
};

/**
 * Loads Pokémon at a specific index
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
        '<div class="pokemon-detail-loading"><div class="spinner"></div><p>Lade Pokémon...</p></div>';
    }

    // Use the pokemon directly if it has detailed data, otherwise fetch
    let detailedPokemon = pokemon;
    if (!pokemon.stats) {
      const response = await fetch(pokemon.url);
      if (!response.ok)
        throw new Error(`Fehler beim Laden von ${pokemon.name}`);
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
 * Updates the navigation arrows
 */
let updateNavigationArrows = () => {
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");

  if (prevButton) {
    prevButton.disabled = currentPokemonIndex <= 0;
    prevButton.style.opacity = currentPokemonIndex <= 0 ? "0.5" : "1";
  } else {
    console.error("❌ Previous Button nicht gefunden!");
  }

  if (nextButton) {
    nextButton.disabled = currentPokemonIndex >= currentPokemonList.length - 1;
    nextButton.style.opacity =
      currentPokemonIndex >= currentPokemonList.length - 1 ? "0.5" : "1";
  } else {
    console.error("❌ Next Button nicht gefunden!");
  }
};

/**
 * Initializes Modal Event Listeners
 */
export let initializeModalEventListeners = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");
  const closeButton = document.getElementById("closeModalButton");

  if (modal) {
    // Close when clicked outside the modal
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
  } else {
    console.error("❌ Modal nicht gefunden!");
  }

  // Navigation button event listeners
  if (prevButton) {
    prevButton.addEventListener("click", (e) => {
      e.stopPropagation();
      goToPreviousPokemon();
    });
  } else {
    console.error("❌ Previous Button nicht gefunden!");
  }

  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      e.stopPropagation();
      goToNextPokemon();
    });
  } else {
    console.error("❌ Next Button nicht gefunden!");
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
