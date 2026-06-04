export const NOTIFICATION_SETTING_DEFINITIONS = [
  {
    id: "job",
    title: "Job Alerts",
    patchKey: "job",
    apiKeys: ["job"],
  },
  {
    id: "review",
    title: "Reviews",
    patchKey: "review",
    apiKeys: ["review"],
  },
  {
    id: "transaction",
    title: "Credits & Payments",
    patchKey: "transaction",
    apiKeys: ["transaction"],
  },
  {
    id: "engagement",
    title: "Engagement",
    patchKey: "engagement",
    apiKeys: ["engagement"],
  },
] as const;

export type NotificationSettingPatchKey =
  (typeof NOTIFICATION_SETTING_DEFINITIONS)[number]["patchKey"];

export function getNotificationSettingDefinitionById(id: string) {
  return NOTIFICATION_SETTING_DEFINITIONS.find(
    (definition) => definition.id === id,
  );
}

export type ToggleNotificationsPayload = Partial<
  Record<NotificationSettingPatchKey, boolean>
>;

export function buildToggleSettingsPayload(
  id: string,
  enabled: boolean,
): ToggleNotificationsPayload | null {
  const definition = getNotificationSettingDefinitionById(id);
  if (!definition) return null;

  return {
    [definition.patchKey]: enabled,
  };
}
