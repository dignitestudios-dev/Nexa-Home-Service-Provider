"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseNotificationSettingsFromResponse } from "@/lib/parse-settings-response";
import { settingsService } from "@/services/settings.service";
import type { RootState } from "@/store/index";

export const SETTINGS_QUERY_KEY = ["settings"] as const;

export function useSettingsQuery() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await settingsService.getSettings();
      const settings = parseNotificationSettingsFromResponse(response);

      if (!settings) {
        throw new Error("Invalid settings response");
      }

      return settings;
    },
    enabled: hasToken || isAuthenticated,
  });
}
