/**
 * @fileoverview Notification template HTML generator
 * @module notification-template
 */

/**
 * Creates notification HTML
 * @returns {string} Notification HTML string
 */
export function createNotificationHTML() {
  return `
    <div class="notification-content">
      <svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div class="notification-text"></div>
    </div>
  `;
}
