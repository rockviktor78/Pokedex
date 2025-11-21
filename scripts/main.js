/**
 * @fileoverview Pokédex App Main Entry Point
 * @description Haupteinstiegspunkt der Pokédex Single Page Application.
 * Koordiniert die Initialisierung aller Module, verwaltet den globalen App-State,
 * und orchestriert Event-Handling sowie Navigation.
 * @module main
 */

// Import dependencies
import { handleClearSearch, initializeSearch } from "./search.js";
import { handleLoadMoreClick, loadInitialPokemon } from "./pokemon-list.js";
import { initializeModalEventListeners } from "./pokemon-detail.js";
import {
  initializeAccessibility,
  showErrorMessage,
  updateLoadMoreButton,
} from "./ui-helpers.js";
import { initializeFooter } from "./footer.js";

// App State - Shared across modules
export const appState = {
  pokemonList: [],
  currentOffset: 0,
  currentPokemon: null,
  isLoading: false,
  pokemonCache: {},
  limit: 20,
  searchResults: [],
  isSearchMode: false,
  currentSearchQuery: "",
  allPokemonNames: [], // Cache for autocompletion
};

/**
 * Initialisiert die Pokédex-Anwendung
 * Lädt alle notwendigen Module, richtet Event-Listener ein und lädt initiale Pokémon-Daten
 * @async
 * @function initializeApp
 * @returns {Promise<void>} Promise das sich auflöst wenn Initialisierung abgeschlossen ist
 */
let initializeApp = async () => {
  try {
    await initializeSearch();
    initializeModalEventListeners();
    initializeAccessibility();
    initializeFooter();
    setupCoreEventListeners();
    await loadInitialPokemon();
  } catch (error) {}
};

/**
 * Richtet Event-Listener für den "Load More" Button ein
 * Verhindert Mehrfachklicks während des Ladens und im Such-Modus
 * @function setupLoadMoreButton
 * @returns {void}
 */
let setupLoadMoreButton = () => {
  const loadMoreButton = document.getElementById("loadMoreButton");
  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      if (!appState.isLoading && !appState.isSearchMode) {
        handleLoadMoreClick();
      }
    });
  }
};

/**
 * Sets up navigation event listeners
 */
let setupNavigationListeners = () => {
  const logoLink = document.querySelector(".logo-link");
  const titleLink = document.querySelector(".title-link");

  if (logoLink) {
    logoLink.addEventListener("click", handleLogoClick);
  }
  if (titleLink) {
    titleLink.addEventListener("click", handleLogoClick);
  }
};

/**
 * Sets up scroll to top button
 */
let setupScrollButton = () => {
  const scrollToTopButton = document.getElementById("scrollToTopButton");
  if (scrollToTopButton) {
    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
};

/**
 * Sets up UI state monitoring
 */
let setupUIMonitoring = () => {
  let previousSearchMode = appState.isSearchMode;
  setInterval(() => {
    if (appState.isSearchMode !== previousSearchMode) {
      updateLoadMoreButton();
      previousSearchMode = appState.isSearchMode;
    }
  }, 100);
};

/**
 * Sets up Core Event Listeners
 */
let setupCoreEventListeners = () => {
  setupLoadMoreButton();
  setupNavigationListeners();
  setupScrollButton();
  setupUIMonitoring();
};

/**
 * Handles Logo Click - Back to homepage
 * @param {Event} e - Click Event
 */
let handleLogoClick = async (e) => {
  e.preventDefault();

  try {
    // If we're in search mode, reset search
    if (appState.isSearchMode) {
      await handleClearSearch();
    } else {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    // Fallback: Simply scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

/**
 * Error handler for unhandled errors
 */
export let handleGlobalError = (event) => {
  try {
    // Show user-friendly error message
    showErrorMessage?.("An unexpected error occurred. Please try again.");
  } catch (error) {
    // Error handled silently
  }
};

/**
 * Sets up global error handling
 */
let setupGlobalErrorHandling = () => {
  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", (event) => {
    handleGlobalError({ error: event.reason });
  });
};

// Start app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupGlobalErrorHandling();
  initializeApp();
});
