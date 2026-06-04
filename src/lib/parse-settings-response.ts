import { NOTIFICATION_SETTING_DEFINITIONS } from "@/lib/notification-settings";
import type { UserNotificationSettings } from "@/types/settings.types";

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

function getSettingsPayload(data: unknown): Record<string, unknown> | null {
  const record = getRecord(data);
  if (!record) return null;

  const nested = getRecord(record.data);
  const candidates = [
    nested?.settings,
    nested?.notificationSettings,
    nested?.notifications,
    nested,
    record.settings,
    record.notificationSettings,
    record.notifications,
    record.data,
    record,
  ];

  for (const candidate of candidates) {
    const payload = getRecord(candidate);
    if (!payload) continue;

    const hasKnownKey = NOTIFICATION_SETTING_DEFINITIONS.some((definition) =>
      definition.apiKeys.some((key) => payload[key] !== undefined),
    );

    if (hasKnownKey) return payload;
  }

  return nested ?? record;
}

function readSettingValue(
  settings: Record<string, unknown>,
  apiKeys: readonly string[],
): boolean {
  for (const key of apiKeys) {
    if (settings[key] !== undefined) {
      return toBoolean(settings[key]);
    }
  }

  return true;
}

export function parseNotificationSettingsFromResponse(
  data: unknown,
): UserNotificationSettings | null {
  const settings = getSettingsPayload(data);
  if (!settings) return null;

  return {
    notifications: NOTIFICATION_SETTING_DEFINITIONS.map((definition) => ({
      id: definition.id,
      title: definition.title,
      enabled: readSettingValue(settings, definition.apiKeys),
    })),
  };
}
