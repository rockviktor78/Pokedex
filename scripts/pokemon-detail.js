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

/**
 * Behandelt Klick auf eine Pokémon-Karte
 * @param {Object} pokemon - Pokémon-Daten
 */
export let handlePokemonCardClick = async (pokemon) => {
  try {
    console.log(`🔍 Öffne Details für ${pokemon.name}`);
    const detailedPokemon = await fetchPokemonDetails(pokemon.url);
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
  const modalContent = document.getElementById(ELEMENT_IDS.modalContent);

  if (modal && modalContent) {
    modalContent.innerHTML = createModalHTML(pokemon);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    // Fokus auf Modal für Accessibility
    modal.focus();
  }
};

/**
 * Schließt das Pokémon-Modal
 */
export let closePokemonModal = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
};

/**
 * Initialisiert Modal Event Listeners
 */
export let initializeModalEventListeners = () => {
  const modal = document.getElementById(ELEMENT_IDS.pokemonModal);

  if (modal) {
    // Schließen bei Klick außerhalb des Modals
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closePokemonModal();
      }
    });

    // Schließen mit Escape-Taste
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        closePokemonModal();
      }
    });
  }

  // Globale Funktion für Modal schließen (für onclick)
  window.closePokemonModal = closePokemonModal;
};
