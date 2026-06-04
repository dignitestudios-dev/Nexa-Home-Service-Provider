"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import {
  getBrowserNotificationsEnabled,
  isBrowserNotificationSupported,
  showBrowserNotification,
} from "@/lib/browser-notifications";
import { getAuthTokenCookie } from "@/lib/auth-session";
import { getNotificationRoute } from "@/lib/notification-navigation";
import {
  parseNotificationCountFromResponse,
  parseNotificationsFromResponse,
} from "@/lib/parse-notifications-response";
import { notificationService } from "@/services/notification.service";
import type { RootState } from "@/store/index";

import { NOTIFICATIONS_COUNT_QUERY_KEY } from "./use-notification-count-query";
import { useBrowserNotificationsEnabled } from "./use-browser-notifications-enabled";

const POLL_INTERVAL_MS = 30_000;

export function useBrowserNotificationSync() {
  const router = useRouter();
  const { enabled, permission } = useBrowserNotificationsEnabled();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  const previousCountRef = useRef<number | null>(null);
  const shownNotificationIdsRef = useRef<Set<string>>(new Set());
  const isReadyRef = useRef(false);

  const canSync =
    enabled &&
    permission === "granted" &&
    isBrowserNotificationSupported() &&
    getBrowserNotificationsEnabled() &&
    (hasToken || isAuthenticated);

  const { data: count = 0 } = useQuery({
    queryKey: NOTIFICATIONS_COUNT_QUERY_KEY,
    queryFn: async () => {
      const response = await notificationService.getCount();
      return parseNotificationCountFromResponse(response);
    },
    enabled: canSync,
    refetchInterval: canSync ? POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!canSync) {
      previousCountRef.current = null;
      isReadyRef.current = false;
      return;
    }

    if (!isReadyRef.current) {
      previousCountRef.current = count;
      isReadyRef.current = true;
      return;
    }

    if (count <= (previousCountRef.current ?? 0)) {
      previousCountRef.current = count;
      return;
    }

    let cancelled = false;

    const syncNotifications = async () => {
      try {
        const response = await notificationService.getMyNotifications();
        if (cancelled) return;

        const { notifications } = parseNotificationsFromResponse(response);
        const newNotifications = notifications.filter(
          (notification) =>
            !notification.isRead &&
            !shownNotificationIdsRef.current.has(notification.id),
        );

        for (const notification of newNotifications) {
          shownNotificationIdsRef.current.add(notification.id);
          const route = getNotificationRoute(notification.metadata);

          showBrowserNotification(notification.title, {
            body: notification.message,
            tag: notification.id,
            onClick: () => {
              if (route) {
                router.push(route);
              }
            },
          });
        }
      } finally {
        if (!cancelled) {
          previousCountRef.current = count;
        }
      }
    };

    void syncNotifications();

    return () => {
      cancelled = true;
    };
  }, [canSync, count, router]);
}
