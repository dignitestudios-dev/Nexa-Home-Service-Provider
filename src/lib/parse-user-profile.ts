import { formatUsPhoneNumber } from "@/lib/auth-utils";
import type { User } from "@/store/slices/auth-slice";

export function parseUserProfileFromResponse(data: unknown): User | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const profile =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : typeof record._id === "string"
        ? record
        : null;

  if (!profile || typeof profile._id !== "string") {
    return null;
  }

  return profile as unknown as User;
}

export function getUserDisplayName(
  user: Pick<User, "name" | "email"> | null | undefined,
): string {
  if (user?.name?.trim()) return user.name.trim();
  if (user?.email?.trim()) return user.email.split("@")[0] ?? "User";
  return "User";
}

/** Shortens long names for compact UI (e.g. home welcome). */
export function truncateDisplayName(
  name: string,
  maxLength = 20,
): string {
  const trimmed = name.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}.....`;
}

export function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "U";
}

export function formatDisplayPhone(phone: string | null | undefined): string {
  if (!phone?.trim()) return "Not set";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) {
    return formatUsPhoneNumber(digits.slice(1));
  }

  if (digits.length === 10) {
    return formatUsPhoneNumber(digits);
  }

  return phone;
}
