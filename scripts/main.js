/**
 * Pokédx App - Main Entry Point
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
  allPokemonNames: [], // Cache für Autocompletion
};

/**
 * Initialisiert die Pokédx-App
 */
let initializeApp = async () => {
  console.log("🚀 Pokédx App wird gestartet...");

  try {
    // Initialize core modules
    await initializeSearch();
    initializeModalEventListeners();
    initializeAccessibility();
    setupCoreEventListeners();

    // Load initial Pokemon
    await loadInitialPokemon();

    console.log("✅ App erfolgreich initialisiert");
  } catch (error) {
    console.error("❌ Fehler bei App-Initialisierung:", error);
  }
};

/**
 * Richtet Core Event Listener ein
 */
let setupCoreEventListeners = () => {
  const loadMoreButton = document.getElementById("loadMoreButton");

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", () => {
      if (!appState.isLoading && !appState.isSearchMode) {
        handleLoadMoreClick();
      }
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
 * Error Handler für unbehandelte Fehler
 */
let setupGlobalErrorHandling = () => {
  window.addEventListener("error", (event) => {
    console.error("Globaler Fehler:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unbehandelte Promise-Rejection:", event.reason);
  });
};

// App starten wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
  setupGlobalErrorHandling();
  initializeApp();
});
