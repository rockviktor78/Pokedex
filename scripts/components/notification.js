/**
 * @fileoverview Notification component for displaying user feedback messages
 * @module notification
 */

let notificationTimeout = null;

/**
 * Shows a notification message
 * @param {string} message - The message to display
 * @param {string} query - The search query that was not found
 */
export function showNotification(message, query = "") {
  clearNotificationTimeout();

  let notification = document.getElementById("notification");

  if (!notification) {
    notification = createNotificationElement();
    document.body.appendChild(notification);
  }

  const textElement = notification.querySelector(".notification-text");
  if (textElement) {
    textElement.innerHTML = query
      ? `<strong>"${query}"</strong> wurde nicht gefunden`
      : message;
  }

  notification.classList.remove("hide");
  notification.classList.add("show");

  notificationTimeout = setTimeout(() => {
    hideNotification();
  }, 4000);
}

/**
 * Hides the notification
 */
export function hideNotification() {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.classList.remove("show");
    notification.classList.add("hide");
  }
  clearNotificationTimeout();
}

/**
 * Clears the notification timeout
 */
function clearNotificationTimeout() {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
}

/**
 * Creates the notification element
 * @returns {HTMLElement} The notification element
 */
function createNotificationElement() {
  const notification = document.createElement("div");
  notification.id = "notification";
  notification.className = "notification";
  notification.innerHTML = `
    <div class="notification-content">
      <svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div class="notification-text"></div>
    </div>
  `;
  return notification;
}
