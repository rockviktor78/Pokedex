/**
 * Pokémon Detail Modal Module
 * Handles Pokemon detail view and modal functionality
 */

// Import dependencies
import { appState } from "./main.js";
import { fetchPokemonDetails } from "./api.js";
import { showErrorMessage } from "./ui-helpers.js";
import { createModalHTML } from "./pokemon-templates.js";
import { ELEMENT_IDS } from "./constants.js";

// Current Pokemon index for navigation
let currentPokemonIndex = 0;
let currentPokemonList = [];

/**
 * Behandelt Klick auf eine Pokémon-Karte
 * @param {Object} pokemon - Pokémon-Daten
 */
export let handlePokemonCardClick = async (pokemon) => {
  try {
    console.log(`🔍 Öffne Details für ${pokemon.name}`);

    // Set current Pokemon list based on current mode
    if (appState.isSearchMode && appState.searchResults) {
      currentPokemonList = appState.searchResults;
      console.log("📋 Verwende Suchergebnisse:", currentPokemonList.length);
    } else {
      currentPokemonList = appState.pokemonList;
      console.log("📋 Verwende normale Liste:", currentPokemonList.length);
    }

    // Find current Pokemon index
    currentPokemonIndex = currentPokemonList.findIndex(
      (p) => p.id === pokemon.id
    );
    console.log("📍 Pokemon Index:", currentPokemonIndex);

    // Use the pokemon directly if it has detailed data, otherwise fetch
    let detailedPokemon = pokemon;
    if (!pokemon.stats) {
      console.log("🔄 Lade detaillierte Pokémon-Daten...");
      const response = await fetch(pokemon.url);
      if (!response.ok)
        throw new Error(`Fehler beim Laden von ${pokemon.name}`);
      detailedPokemon = await response.json();
    }

    openPokemonModal(detailedPokemon);
  } catch (error) {
    console.error("❌ Fehler beim Laden der Pokémon-Details:", error);
    showErrorMessage();
  }
};

/**
 * Öffnet das Pokémon-Modal mit Details
 * @param {Object} pokemon - Detaillierte Pokémon-Daten
 */
export let openPokemonModal = (pokemon) => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const modalContent = document.getElementById("pokemonDetailContent");

  if (modal && modalContent) {
    // Remove hidden class and show modal
    modal.classList.remove("hidden");
    modal.classList.add("visible");
    modal.style.display = "flex";

    modalContent.innerHTML = createModalHTML(pokemon);

    // Füge Pokémon-Typ-Klasse hinzu für Hintergrundfarbe
    const primaryType = pokemon.types[0]?.type.name || "normal";
    modalContent.className = `pokemon-detail ${primaryType}`;

    document.body.style.overflow = "hidden";

    // Update navigation arrows
    updateNavigationArrows();

    // Fokus auf Modal für Accessibility
    modal.focus();

    console.log("✅ Modal geöffnet für:", pokemon.name);
  } else {
    console.error("❌ Modal-Elemente nicht gefunden!");
  }
};
/**
 * Schließt das Pokémon-Modal
 */
export let closePokemonModal = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  if (modal) {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    modal.style.display = "none";
    document.body.style.overflow = "auto";

    console.log("✅ Modal geschlossen");
  }
};

/**
 * Navigiert zum vorherigen Pokémon
 */
export let goToPreviousPokemon = async () => {
  if (currentPokemonIndex > 0) {
    currentPokemonIndex--;
    await loadPokemonAtIndex(currentPokemonIndex);
  }
};

/**
 * Navigiert zum nächsten Pokémon
 */
export let goToNextPokemon = async () => {
  if (currentPokemonIndex < currentPokemonList.length - 1) {
    currentPokemonIndex++;
    await loadPokemonAtIndex(currentPokemonIndex);
  }
};

/**
 * Lädt Pokémon an bestimmtem Index
 * @param {number} index - Index im aktuellen Pokémon-Array
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
      console.log("🔄 Lade detaillierte Pokémon-Daten...");
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
    console.error("❌ Fehler beim Laden des Pokémon:", error);
    showErrorMessage();
  }
};

/**
 * Aktualisiert die Navigations-Pfeile
 */
let updateNavigationArrows = () => {
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");

  console.log("🔄 Aktualisiere Navigation Arrows:", {
    currentPokemonIndex,
    listLength: currentPokemonList.length,
  });

  if (prevButton) {
    prevButton.disabled = currentPokemonIndex <= 0;
    prevButton.style.opacity = currentPokemonIndex <= 0 ? "0.5" : "1";
    console.log(
      "⬅️ Previous Button:",
      prevButton.disabled ? "disabled" : "enabled"
    );
  } else {
    console.error("❌ Previous Button nicht gefunden!");
  }

  if (nextButton) {
    nextButton.disabled = currentPokemonIndex >= currentPokemonList.length - 1;
    nextButton.style.opacity =
      currentPokemonIndex >= currentPokemonList.length - 1 ? "0.5" : "1";
    console.log(
      "➡️ Next Button:",
      nextButton.disabled ? "disabled" : "enabled"
    );
  } else {
    console.error("❌ Next Button nicht gefunden!");
  }
};

/**
 * Initialisiert Modal Event Listeners
 */
export let initializeModalEventListeners = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  const prevButton = document.getElementById("prevPokemonButton");
  const nextButton = document.getElementById("nextPokemonButton");
  const closeButton = document.getElementById("closeModalButton");

  console.log("🔧 Initialisiere Modal Event Listeners...");

  if (modal) {
    console.log("✅ Modal gefunden");

    // Schließen bei Klick außerhalb des Modals
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        console.log("🖱️ Klick außerhalb Modal");
        closePokemonModal();
      }
    });

    // Schließen mit Escape-Taste
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        console.log("⌨️ Escape gedrückt");
        closePokemonModal();
      }

      // Arrow key navigation
      if (!modal.classList.contains("hidden")) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          console.log("⌨️ Pfeil links gedrückt");
          goToPreviousPokemon();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          console.log("⌨️ Pfeil rechts gedrückt");
          goToNextPokemon();
        }
      }
    });
  } else {
    console.error("❌ Modal nicht gefunden!");
  }

  // Navigation button event listeners
  if (prevButton) {
    console.log("✅ Previous Button gefunden");
    prevButton.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("🖱️ Previous Button geklickt");
      goToPreviousPokemon();
    });
  } else {
    console.error("❌ Previous Button nicht gefunden!");
  }

  if (nextButton) {
    console.log("✅ Next Button gefunden");
    nextButton.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("🖱️ Next Button geklickt");
      goToNextPokemon();
    });
  } else {
    console.error("❌ Next Button nicht gefunden!");
  }

  if (closeButton) {
    console.log("✅ Close Button gefunden");
    closeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      console.log("🖱️ Close Button geklickt");
      closePokemonModal();
    });
  } else {
    console.error("❌ Close Button nicht gefunden!");
  }

  // Globale Funktionen für Modal (für onclick)
  window.closePokemonModal = closePokemonModal;
  window.goToPreviousPokemon = goToPreviousPokemon;
  window.goToNextPokemon = goToNextPokemon;

  console.log("✅ Modal Event Listeners initialisiert");
};
