"use client";

import { useBrowserNotificationSync } from "@/hooks/notifications/use-browser-notification-sync";

export function BrowserNotificationManager() {
  useBrowserNotificationSync();
  return null;
}
