"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseNotificationCountFromResponse } from "@/lib/parse-notifications-response";
import { notificationService } from "@/services/notification.service";
import type { RootState } from "@/store/index";

export const NOTIFICATIONS_COUNT_QUERY_KEY = ["notifications", "count"] as const;

export function useNotificationCountQuery() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: NOTIFICATIONS_COUNT_QUERY_KEY,
    queryFn: async () => {
      const response = await notificationService.getCount();
      return parseNotificationCountFromResponse(response);
    },
    enabled: hasToken || isAuthenticated,
  });
}
