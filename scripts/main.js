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
    console.log("🔍 Initialisiere Suche...");
    await initializeSearch();

    console.log("🎭 Initialisiere Modal Event Listeners...");
    initializeModalEventListeners();

    console.log("♿ Initialisiere Accessibility...");
    initializeAccessibility();

    console.log("🔧 Setup Core Event Listeners...");
    setupCoreEventListeners();

    // Load initial Pokemon
    console.log("📦 Lade erste Pokémon...");
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

  // Logo Click - Zurück zur Startseite
  if (logoLink) {
    logoLink.addEventListener("click", handleLogoClick);
  }

  // Title Click - Zurück zur Startseite
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
 * Behandelt Logo-Klick - Zurück zur Startseite
 * @param {Event} e - Click Event
 */
let handleLogoClick = async (e) => {
  e.preventDefault();
  console.log("🏠 Logo geklickt - Zurück zur Startseite");

  try {
    // Falls wir im Suchmodus sind, Suche zurücksetzen
    if (appState.isSearchMode) {
      const { handleClearSearch } = await import("./search.js");
      await handleClearSearch();
    } else {
      // Scroll zur Spitze
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    console.error("❌ Fehler beim Logo-Klick:", error);
    // Fallback: Einfach zur Spitze scrollen
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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
