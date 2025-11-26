/**
 * @fileoverview Footer Legal Modals Logic Module
 * @description Manages the logic for legal modals (Impressum & Privacy Policy).
 * Implements modal opening/closing, keyboard navigation, and accessibility features.
 * Coordinates rendering and event handling for footer and modals.
 * @module footer
 */

import {
  createDatenschutzModalHTML,
  createFooterHTML,
  createImpressumModalHTML,
} from "./templates/footer-templates.js";
import { ELEMENT_IDS } from "./constants.js";

/**
 * Renders footer and modals into the DOM
 * @function renderFooter
 * @returns {void}
 */
function renderFooter() {
  const body = document.body;

  body.insertAdjacentHTML("beforeend", createFooterHTML());

  body.insertAdjacentHTML("beforeend", createImpressumModalHTML());
  body.insertAdjacentHTML("beforeend", createDatenschutzModalHTML());
}

/**
 * Opens a legal modal (Impressum or Privacy Policy)
 * Disables body scroll and sets modal focus for accessibility
 * @function openLegalModal
 * @param {string} modalId - ID of the modal to open
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
 * Closes a legal modal
 * Re-enables body scroll and sets inert attribute for accessibility
 * @function closeLegalModal
 * @param {string} modalId - ID of the modal to close
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
 * Sets up event listeners for open buttons
 * @function setupOpenButtons
 * @returns {void}
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
 * Sets up event listeners for close buttons
 * @function setupCloseButtons
 * @returns {void}
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
 * Sets up click handlers for modal overlays
 * Closes modal when clicking outside the container
 * @function setupModalOverlays
 * @returns {void}
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
 * Sets up escape key handler for modals
 * @function setupEscapeHandler
 * @returns {void}
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
 * Prevents focus on hidden modals for accessibility
 * @function initializeInertAttributes
 * @returns {void}
 */
function initializeInertAttributes() {
  const impressumModal = document.getElementById("impressumModal");
  const datenschutzModal = document.getElementById("datenschutzModal");

  if (impressumModal) impressumModal.setAttribute("inert", "");
  if (datenschutzModal) datenschutzModal.setAttribute("inert", "");
}

/**
 * Initializes footer and legal modals
 * Generates HTML and sets up event listeners
 * @function initializeFooter
 * @returns {void}
 */
export function initializeFooter() {
  renderFooter();
  setupOpenButtons();
  setupCloseButtons();
  setupModalOverlays();
  setupEscapeHandler();
  initializeInertAttributes();
}
