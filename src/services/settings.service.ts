import { API } from "@/lib/axios";
import type { NotificationSettingPatchKey } from "@/lib/notification-settings";

export type ToggleSettingsPayload = Partial<
  Record<NotificationSettingPatchKey, boolean>
>;

export const settingsService = {
  getSettings: async () => {
    const { data } = await API.get("/settings");
    return data;
  },

  toggleSettings: async (payload: ToggleSettingsPayload) => {
    const { data } = await API.patch("/settings", payload);
    return data;
  },
};
