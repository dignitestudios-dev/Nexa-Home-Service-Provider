export const BROWSER_NOTIFICATIONS_STORAGE_KEY =
  "nexa_browser_notifications_enabled";

export const BROWSER_NOTIFICATIONS_CHANGED_EVENT =
  "nexa-browser-notifications-changed";

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getBrowserNotificationPermission(): NotificationPermission | null {
  if (!isBrowserNotificationSupported()) return null;
  return Notification.permission;
}

export function getBrowserNotificationsEnabled(): boolean {
  if (!isBrowserNotificationSupported()) return false;
  return localStorage.getItem(BROWSER_NOTIFICATIONS_STORAGE_KEY) === "true";
}

export function setBrowserNotificationsEnabled(enabled: boolean): void {
  localStorage.setItem(
    BROWSER_NOTIFICATIONS_STORAGE_KEY,
    enabled ? "true" : "false",
  );
  emitBrowserNotificationsChanged();
}

export function emitBrowserNotificationsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BROWSER_NOTIFICATIONS_CHANGED_EVENT));
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!isBrowserNotificationSupported()) return "denied";

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  return Notification.requestPermission();
}

type ShowBrowserNotificationOptions = {
  body?: string;
  tag?: string;
  onClick?: () => void;
};

export function showBrowserNotification(
  title: string,
  options: ShowBrowserNotificationOptions = {},
): void {
  if (!isBrowserNotificationSupported()) return;
  if (Notification.permission !== "granted") return;
  if (!getBrowserNotificationsEnabled()) return;

  const { body, tag, onClick } = options;

  const notification = new Notification(title, {
    body,
    icon: "/asset/darklogo.png",
    badge: "/asset/darklogo.png",
    tag,
  });

  notification.onclick = (event) => {
    event.preventDefault();
    window.focus();
    onClick?.();
    notification.close();
  };
}
