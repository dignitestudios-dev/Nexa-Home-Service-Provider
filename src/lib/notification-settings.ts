export const NOTIFICATION_SETTING_DEFINITIONS = [
  {
    id: "job-matches-category",
    title: "Job Matches Category",
    patchKey: "jobMatchesCategory",
    apiKeys: [
      "jobMatchesCategory",
      "job_matches_category",
      "jobMatchCategory",
      "isJobMatchesCategory",
    ],
  },
  {
    id: "expert-selected",
    title: "Expert Selected",
    patchKey: "expertSelected",
    apiKeys: [
      "expertSelected",
      "expert_selected",
      "isExpertSelected",
      "providerSelected",
    ],
  },
  {
    id: "new-review-received",
    title: "New Review Received",
    patchKey: "newReviewReceived",
    apiKeys: [
      "newReviewReceived",
      "new_review_received",
      "reviewReceived",
      "isNewReviewReceived",
    ],
  },
] as const;

export type NotificationSettingPatchKey =
  (typeof NOTIFICATION_SETTING_DEFINITIONS)[number]["patchKey"];

export function getNotificationSettingDefinitionById(id: string) {
  return NOTIFICATION_SETTING_DEFINITIONS.find(
    (definition) => definition.id === id,
  );
}

export function buildToggleSettingsPayload(
  id: string,
  enabled: boolean,
): Partial<Record<NotificationSettingPatchKey, boolean>> | null {
  const definition = getNotificationSettingDefinitionById(id);
  if (!definition) return null;

  return {
    [definition.patchKey]: enabled,
  };
}
