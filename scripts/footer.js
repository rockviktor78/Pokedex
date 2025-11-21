/**
 * @fileoverview Footer Legal Modals Module
 * @description Verwaltet die rechtlichen Modals (Impressum & Datenschutz).
 * Implementiert Modal-Öffnen/Schließen, Keyboard-Navigation und Accessibility-Features.
 * @module footer
 */

// Import dependencies
import { ELEMENT_IDS } from "./constants.js";

/**
 * Öffnet ein rechtliches Modal (Impressum oder Datenschutz)
 * Deaktiviert Body-Scroll und setzt Modal-Focus für Accessibility
 * @function openLegalModal
 * @param {string} modalId - ID des zu öffnenden Modals
 * @returns {void}
 */
function openLegalModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("visible");
    modal.removeAttribute("inert");
    document.body.style.overflow = "hidden";
    modal.focus();
  }
}

/**
 * Schließt ein rechtliches Modal
 * Reaktiviert Body-Scroll und setzt inert-Attribut für Accessibility
 * @function closeLegalModal
 * @param {string} modalId - ID des zu schließenden Modals
 * @returns {void}
 */
function closeLegalModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    modal.setAttribute("inert", "");
    document.body.style.overflow = "auto";
  }
}

/**
 * Sets up open button event listeners
 */
function setupOpenButtons() {
  const impressumButton = document.getElementById("impressumButton");
  const datenschutzButton = document.getElementById("datenschutzButton");

  if (impressumButton) {
    impressumButton.addEventListener("click", () =>
      openLegalModal("impressumModal")
    );
  }
  if (datenschutzButton) {
    datenschutzButton.addEventListener("click", () =>
      openLegalModal("datenschutzModal")
    );
  }
}

/**
 * Sets up close button event listeners
 */
function setupCloseButtons() {
  const closeImpressumButton = document.getElementById("closeImpressumButton");
  const closeDatenschutzButton = document.getElementById(
    "closeDatenschutzButton"
  );

  if (closeImpressumButton) {
    closeImpressumButton.addEventListener("click", () =>
      closeLegalModal("impressumModal")
    );
  }
  if (closeDatenschutzButton) {
    closeDatenschutzButton.addEventListener("click", () =>
      closeLegalModal("datenschutzModal")
    );
  }
}

/**
 * Sets up modal overlay click handlers
 */
function setupModalOverlays() {
  const impressumModal = document.getElementById("impressumModal");
  const datenschutzModal = document.getElementById("datenschutzModal");

  if (impressumModal) {
    impressumModal.addEventListener("click", (e) => {
      if (e.target === impressumModal) closeLegalModal("impressumModal");
    });
  }
  if (datenschutzModal) {
    datenschutzModal.addEventListener("click", (e) => {
      if (e.target === datenschutzModal) closeLegalModal("datenschutzModal");
    });
  }
}

/**
 * Sets up keyboard escape handler
 */
function setupEscapeHandler() {
  const impressumModal = document.getElementById("impressumModal");
  const datenschutzModal = document.getElementById("datenschutzModal");

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!impressumModal.classList.contains("hidden"))
        closeLegalModal("impressumModal");
      if (!datenschutzModal.classList.contains("hidden"))
        closeLegalModal("datenschutzModal");
    }
  });
}

/**
 * Initializes inert attributes for modals
 */
function initializeInertAttributes() {
  const impressumModal = document.getElementById("impressumModal");
  const datenschutzModal = document.getElementById("datenschutzModal");

  if (impressumModal) impressumModal.setAttribute("inert", "");
  if (datenschutzModal) datenschutzModal.setAttribute("inert", "");
}

/**
 * Initializes footer event listeners
 */
export function initializeFooter() {
  setupOpenButtons();
  setupCloseButtons();
  setupModalOverlays();
  setupEscapeHandler();
  initializeInertAttributes();
}
