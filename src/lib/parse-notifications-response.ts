import type {
  AppNotification,
  NotificationMetadata,
  NotificationsResult,
} from "@/types/notification.types";

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}
function getNotificationId(record: Record<string, unknown>): string {
  const candidates = [record._id, record.id, record.notificationId];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      if (typeof nested.$oid === "string" && nested.$oid.trim()) {
        return nested.$oid.trim();
      }
    }
  }

  return "";
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "read" || normalized === "1";
  }
  return false;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function getNotificationArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  const record = getRecord(data);
  if (!record) return [];

  const nested = getRecord(record.data);
  const candidates = [
    record.notifications,
    record.items,
    nested?.notifications,
    nested?.items,
    nested?.data,
    record.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function parseMetadata(raw: unknown): NotificationMetadata | null {
  const record = getRecord(raw);
  if (!record) return null;

  const type = toString(record.type).trim();
  const resourceId = toString(record._id).trim() || null;
  const cta = toString(record.cta).trim() || null;
  const settingKey = toString(record.settingKey).trim() || null;

  if (!type && !resourceId && !cta && !settingKey) {
    return null;
  }

  return {
    type,
    resourceId,
    cta,
    settingKey,
  };
}

function parseNotification(raw: unknown): AppNotification | null {
  const record = getRecord(raw);
  if (!record) return null;

  const id = getNotificationId(record);
  if (!id) return null;

  const title =
    toString(record.title).trim() ||
    toString(record.type).trim() ||
    toString(record.subject).trim() ||
    "Notification";

  const message =
    toString(record.message).trim() ||
    toString(record.body).trim() ||
    toString(record.description).trim() ||
    toString(record.content).trim() ||
    "";

  const status = toString(record.status).trim().toLowerCase();
  const isRead =
    record.isRead !== undefined
      ? toBoolean(record.isRead)
      : record.read !== undefined
        ? toBoolean(record.read)
        : status === "read";

  const createdAt =
    toString(record.createdAt) ||
    toString(record.updatedAt) ||
    toString(record.timestamp) ||
    "";

  return {
    id,
    title,
    message,
    isRead,
    createdAt,
    metadata: parseMetadata(record.metadata),
  };
}

export function formatNotificationTime(value: string): string {
  if (!value.trim()) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function parseNotificationsFromResponse(
  data: unknown,
): NotificationsResult {
  const notifications = getNotificationArray(data)
    .map(parseNotification)
    .filter((item): item is AppNotification => Boolean(item));

  return { notifications };
}

export function parseNotificationCountFromResponse(data: unknown): number {
  if (typeof data === "number" && Number.isFinite(data)) {
    return Math.max(0, data);
  }

  const record = getRecord(data);
  if (!record) return 0;

  const nested = getRecord(record.data);
  const candidates = [
    record.count,
    record.unreadCount,
    record.total,
    nested?.count,
    nested?.unreadCount,
    nested?.total,
  ];

  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed)) {
      return Math.max(0, parsed);
    }
  }

  return 0;
}
