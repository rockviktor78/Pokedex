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
 * Sets the loading status of the app
 * @param {boolean} isLoading - Loading status
 */
export let setLoadingState = (isLoading) => {
  appState.isLoading = isLoading;
  updateLoadingUI(isLoading);
};

/**
 * Updated loading UI elements
 * @param {boolean} isLoading - Loading status
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
 * Shows an error message
 * @param {string} message - Error message (optional)
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

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideErrorMessage();
  }, ANIMATIONS.errorAutoHideDelay);
};

/**
 * Hides the error message
 */
export let hideErrorMessage = () => {
  const errorContainer = document.getElementById(ELEMENT_IDS.errorContainer);
  if (errorContainer) {
    errorContainer.style.display = "none";
  }
};

/**
 * Updates the visibility of the load more button
 */
export let updateLoadMoreButton = () => {
  const loadMoreButton = document.getElementById(ELEMENT_IDS.loadMoreButton);
  if (!loadMoreButton) return;

  // Hidden button in search mode
  if (appState.isSearchMode) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
  }
};

/**
 * Scroll to the top of the page
 */
export let scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/**
 * Formats Pokémon names for display
 * @param {string} name - Pokémon name
 * @returns {string} Formatted name
 */
export let formatPokemonName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * Creates a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
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
 * Checks if an element is visible in the viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if visible
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
 * Initializes accessibility features
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

  // Keyboard navigation for Pokémon cards
  document.addEventListener("keydown", handleKeyboardNavigation);
};

/**
 * Handles keyboard navigation
 * @param {KeyboardEvent} e - Keyboard Event
 */
export let handleKeyboardNavigation = (e) => {
  // ESC to close modal
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
 * Shows a toast notification
 * @param {string} message - Message
 * @param {string} type - Type (success, error, info)
 */
export let showToast = (message, type = "info") => {
  const toast = createToastHTML(message, type);
  document.body.appendChild(toast);

  // Animation
  setTimeout(
    () => toast.classList.add("toast-show"),
    ANIMATIONS.toastShowDelay
  );

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, ANIMATIONS.toastRemoveDelay);
  }, ANIMATIONS.toastHideDelay);
};

// Global functions for HTML onclick
window.hideErrorMessage = hideErrorMessage;
