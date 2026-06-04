"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  SETTINGS_QUERY_KEY,
} from "@/hooks/settings/use-settings-query";
import { buildToggleSettingsPayload } from "@/lib/notification-settings";
import { parseNotificationSettingsFromResponse } from "@/lib/parse-settings-response";
import { toast } from "@/lib/toast";
import { settingsService } from "@/services/settings.service";
import type { UserNotificationSettings } from "@/types/settings.types";

type ToggleSettingVariables = {
  id: string;
  enabled: boolean;
};

export function useToggleSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, enabled }: ToggleSettingVariables) => {
      const payload = buildToggleSettingsPayload(id, enabled);

      if (!payload) {
        throw new Error("Invalid notification setting");
      }

      return settingsService.toggleSettings(payload);
    },
    onMutate: async ({ id, enabled }) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });

      const previousSettings = queryClient.getQueryData<UserNotificationSettings>(
        SETTINGS_QUERY_KEY,
      );

      queryClient.setQueryData<UserNotificationSettings>(
        SETTINGS_QUERY_KEY,
        (current) => {
          if (!current) return current;

          return {
            notifications: current.notifications.map((item) =>
              item.id === id ? { ...item, enabled } : item,
            ),
          };
        },
      );

      return { previousSettings };
    },
    onSuccess: (response) => {
      const parsedSettings = parseNotificationSettingsFromResponse(response);

      if (parsedSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, parsedSettings);
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings);
      }

      toast.fromApiError(error, "Unable to update notification setting.");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
}
