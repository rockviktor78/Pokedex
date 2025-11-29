/**
 * @fileoverview Notification component for displaying user feedback messages
 * @module notification
 */

import { createNotificationHTML } from "../templates/notification-template.js";

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
  notification.innerHTML = createNotificationHTML();
  return notification;
}
