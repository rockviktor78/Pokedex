/**
 * UI Helper Functions Module
 * Handles common UI operations and utilities
 */

// Import dependencies
import { appState } from "./main.js";
import {
  createErrorHTML,
  createErrorContainer,
  createToastHTML,
} from "./templates.js";
import { ELEMENT_IDS, UI_MESSAGES, ANIMATIONS } from "./constants.js";

/**
 * Setzt den Loading-Status der App
 * @param {boolean} isLoading - Loading-Status
 */
export let setLoadingState = (isLoading) => {
  appState.isLoading = isLoading;
  updateLoadingUI(isLoading);
};

/**
 * Aktualisiert Loading-UI-Elemente
 * @param {boolean} isLoading - Loading-Status
 */
export let updateLoadingUI = (isLoading) => {
  const loadingIndicator = document.getElementById(
    ELEMENT_IDS.loadingIndicator
  );
  const loadMoreButton = document.getElementById(ELEMENT_IDS.loadMoreButton);

  if (loadingIndicator) {
    loadingIndicator.style.display = isLoading ? "block" : "none";
  }

  if (loadMoreButton) {
    loadMoreButton.disabled = isLoading;
    loadMoreButton.textContent = isLoading
      ? UI_MESSAGES.loading
      : UI_MESSAGES.loadMore;
  }
};

/**
 * Zeigt eine Fehlermeldung an
 * @param {string} message - Fehlermeldung (optional)
 */
export let showErrorMessage = (message = UI_MESSAGES.defaultError) => {
  // Erstelle oder aktualisiere Error-Container
  let errorContainer = document.getElementById(ELEMENT_IDS.errorContainer);

  if (!errorContainer) {
    errorContainer = createErrorContainer();
    document.body.appendChild(errorContainer);
  }

  errorContainer.innerHTML = createErrorHTML(message);
  errorContainer.style.display = "block";

  // Auto-Hide nach 5 Sekunden
  setTimeout(() => {
    hideErrorMessage();
  }, ANIMATIONS.errorAutoHideDelay);
};

/**
 * Versteckt die Fehlermeldung
 */
export let hideErrorMessage = () => {
  const errorContainer = document.getElementById(ELEMENT_IDS.errorContainer);
  if (errorContainer) {
    errorContainer.style.display = "none";
  }
};

/**
 * Aktualisiert die Load-More-Button-Sichtbarkeit
 */
export let updateLoadMoreButton = () => {
  const loadMoreButton = document.getElementById(ELEMENT_IDS.loadMoreButton);
  if (!loadMoreButton) return;

  // Verstecke Button im Suchmodus
  if (appState.isSearchMode) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
  }
};

/**
 * Scroll zum Top der Seite
 */
export let scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/**
 * Formatiert Pokémon-Namen für Anzeige
 * @param {string} name - Pokémon-Name
 * @returns {string} Formatierter Name
 */
export let formatPokemonName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Erstellt ein debounced Version einer Funktion
 * @param {Function} func - Zu debouncende Funktion
 * @param {number} wait - Wartezeit in Millisekunden
 * @returns {Function} Debounced Funktion
 */
export let debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Überprüft, ob ein Element im Viewport sichtbar ist
 * @param {HTMLElement} element - Zu überprüfendes Element
 * @returns {boolean} True wenn sichtbar
 */
export let isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Initialisiert Accessibility-Features
 */
export let initializeAccessibility = () => {
  // Skip-to-content Link
  const skipLink = document.querySelector(".skip-to-content");
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      const mainContent = document.getElementById("pokemonContainer");
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    });
  }

  // Keyboard Navigation für Pokémon-Karten
  document.addEventListener("keydown", handleKeyboardNavigation);
};

/**
 * Behandelt Tastatur-Navigation
 * @param {KeyboardEvent} e - Keyboard Event
 */
export let handleKeyboardNavigation = (e) => {
  // ESC um Modal zu schließen
  if (e.key === "Escape") {
    const modal = document.getElementById(ELEMENT_IDS.pokemonModal);
    if (modal && modal.style.display === "block") {
      // Dynamic import to avoid circular dependency
      import("./pokemon-detail.js").then((module) => {
        module.closePokemonModal();
      });
    }
  }
};

/**
 * Zeigt eine Toast-Benachrichtigung
 * @param {string} message - Nachricht
 * @param {string} type - Typ (success, error, info)
 */
export let showToast = (message, type = "info") => {
  const toast = createToastHTML(message, type);
  document.body.appendChild(toast);

  // Animation
  setTimeout(
    () => toast.classList.add("toast-show"),
    ANIMATIONS.toastShowDelay
  );

  // Auto-Remove nach 3 Sekunden
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, ANIMATIONS.toastRemoveDelay);
  }, ANIMATIONS.toastHideDelay);
};

// Globale Funktionen für HTML onclick
window.hideErrorMessage = hideErrorMessage;
