"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseNotificationsFromResponse } from "@/lib/parse-notifications-response";
import { notificationService } from "@/services/notification.service";
import type { RootState } from "@/store/index";

export const NOTIFICATIONS_QUERY_KEY = ["notifications", "me"] as const;

export function useNotificationsQuery(enabled = true) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await notificationService.getMyNotifications();
      return parseNotificationsFromResponse(response);
    },
    enabled: (hasToken || isAuthenticated) && enabled,
  });
}
