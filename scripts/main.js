/**
 * Pokédex App - Main Entry Point
 * Mobile-First Single Page Application with Modular Architecture
 */

// Import modules
import { initializeSearch } from "./search.js";
import { loadInitialPokemon, handleLoadMoreClick } from "./pokemon-list.js";
import { initializeModalEventListeners } from "./pokemon-detail.js";
import { initializeAccessibility, updateLoadMoreButton } from "./ui-helpers.js";

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
 * Initializes the Pokédex App
 */
let initializeApp = async () => {
  console.log("🚀 Pokédx App starting...");

  try {
    // Initialize core modules
    console.log("🔍 Initializing search...");
    await initializeSearch();

    console.log("🎭 Initialize Modal Event Listeners...");
    initializeModalEventListeners();

    console.log("♿ Initialize Accessibility...");
    initializeAccessibility();

    console.log("🔧 Setup Core Event Listeners...");
    setupCoreEventListeners();

    // Load initial Pokemon
    console.log("📦 Load initial Pokémon...");
    await loadInitialPokemon();

    console.log("✅ App successfully initialized");
  } catch (error) {
    console.error("❌ Error during app initialization:", error);
  }
};

/**
 * Sets up Core Event Listeners
 */
let setupCoreEventListeners = () => {
  const loadMoreButton = document.getElementById("loadMoreButton");
  const scrollToTopButton = document.getElementById("scrollToTopButton");
  const logoLink = document.querySelector(".logo-link");
  const titleLink = document.querySelector(".title-link");

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      if (!appState.isLoading && !appState.isSearchMode) {
        handleLoadMoreClick();
      }
    });
  }

  // Logo Click - Back to homepage
  if (logoLink) {
    logoLink.addEventListener("click", handleLogoClick);
  }

  // Title Click - Back to homepage
  if (titleLink) {
    titleLink.addEventListener("click", handleLogoClick);
  }

  if (scrollToTopButton) {
    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Monitor search mode changes to update UI
  let previousSearchMode = appState.isSearchMode;
  setInterval(() => {
    if (appState.isSearchMode !== previousSearchMode) {
      updateLoadMoreButton();
      previousSearchMode = appState.isSearchMode;
    }
  }, 100);
};

/**
 * Handles Logo Click - Back to homepage
 * @param {Event} e - Click Event
 */
let handleLogoClick = async (e) => {
  e.preventDefault();
  console.log("🏠 Logo clicked - Back to homepage");

  try {
    // If we're in search mode, reset search
    if (appState.isSearchMode) {
      const { handleClearSearch } = await import("./search.js");
      await handleClearSearch();
    } else {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error("❌ Error during logo click:", error);
    // Fallback: Simply scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

/**
 * Error handler for unhandled errors
 */
export let handleGlobalError = (event) => {
  try {
    console.error("Global error:", event.error);
    // Show user-friendly error message
    const { showErrorMessage } = import("./ui-helpers.js");
    showErrorMessage?.("An unexpected error occurred. Please try again.");
  } catch (error) {
    console.error("Error in global error handler:", error);
  }
};

/**
 * Sets up global error handling
 */
let setupGlobalErrorHandling = () => {
  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    handleGlobalError({ error: event.reason });
  });
};

// Start app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupGlobalErrorHandling();
  initializeApp();
});
