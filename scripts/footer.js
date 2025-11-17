/**
 * Footer Module
 * Handles legal modals (Impressum & Datenschutz)
 */

import { ELEMENT_IDS } from "./constants.js";

/**
 * Opens a legal modal
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
 * Initializes footer event listeners
 */
export function initializeFooter() {
  const impressumButton = document.getElementById("impressumButton");
  const datenschutzButton = document.getElementById("datenschutzButton");
  const closeImpressumButton = document.getElementById("closeImpressumButton");
  const closeDatenschutzButton = document.getElementById(
    "closeDatenschutzButton"
  );
  const impressumModal = document.getElementById("impressumModal");
  const datenschutzModal = document.getElementById("datenschutzModal");

  // Open Impressum
  if (impressumButton) {
    impressumButton.addEventListener("click", () => {
      openLegalModal("impressumModal");
    });
  }

  // Open Datenschutz
  if (datenschutzButton) {
    datenschutzButton.addEventListener("click", () => {
      openLegalModal("datenschutzModal");
    });
  }

  // Close Impressum Button
  if (closeImpressumButton) {
    closeImpressumButton.addEventListener("click", () => {
      closeLegalModal("impressumModal");
    });
  }

  // Close Datenschutz Button
  if (closeDatenschutzButton) {
    closeDatenschutzButton.addEventListener("click", () => {
      closeLegalModal("datenschutzModal");
    });
  }

  // Close on overlay click
  if (impressumModal) {
    impressumModal.addEventListener("click", (e) => {
      if (e.target === impressumModal) {
        closeLegalModal("impressumModal");
      }
    });
  }

  if (datenschutzModal) {
    datenschutzModal.addEventListener("click", (e) => {
      if (e.target === datenschutzModal) {
        closeLegalModal("datenschutzModal");
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!impressumModal.classList.contains("hidden")) {
        closeLegalModal("impressumModal");
      }
      if (!datenschutzModal.classList.contains("hidden")) {
        closeLegalModal("datenschutzModal");
      }
    }
  });

  // Initialize inert attribute
  if (impressumModal) {
    impressumModal.setAttribute("inert", "");
  }
  if (datenschutzModal) {
    datenschutzModal.setAttribute("inert", "");
  }
}
