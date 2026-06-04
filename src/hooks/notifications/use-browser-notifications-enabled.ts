"use client";

import { useCallback, useEffect, useState } from "react";

import {
  BROWSER_NOTIFICATIONS_CHANGED_EVENT,
  getBrowserNotificationPermission,
  getBrowserNotificationsEnabled,
  isBrowserNotificationSupported,
  requestBrowserNotificationPermission,
  setBrowserNotificationsEnabled,
} from "@/lib/browser-notifications";
import { toast } from "@/lib/toast";

export function useBrowserNotificationsEnabled() {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const syncState = useCallback(() => {
    setIsSupported(isBrowserNotificationSupported());
    setPermission(getBrowserNotificationPermission());
    setEnabled(getBrowserNotificationsEnabled());
  }, []);

  useEffect(() => {
    syncState();

    const handleChange = () => syncState();
    window.addEventListener(BROWSER_NOTIFICATIONS_CHANGED_EVENT, handleChange);

    return () => {
      window.removeEventListener(
        BROWSER_NOTIFICATIONS_CHANGED_EVENT,
        handleChange,
      );
    };
  }, [syncState]);

  const toggle = useCallback(async () => {
    if (!isBrowserNotificationSupported()) {
      toast.error("Browser notifications are not supported on this device.");
      return;
    }

    if (enabled) {
      setBrowserNotificationsEnabled(false);
      setEnabled(false);
      return;
    }

    setIsUpdating(true);

    try {
      const nextPermission = await requestBrowserNotificationPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        toast.error(
          "Browser notification permission was denied. Enable it in your browser settings.",
        );
        setBrowserNotificationsEnabled(false);
        setEnabled(false);
        return;
      }

      setBrowserNotificationsEnabled(true);
      setEnabled(true);
      toast.success("Browser notifications enabled.");
    } finally {
      setIsUpdating(false);
    }
  }, [enabled]);

  return {
    enabled,
    permission,
    isSupported,
    isUpdating,
    toggle,
  };
}
