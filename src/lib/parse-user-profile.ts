import { formatUsPhoneNumber } from "@/lib/auth-utils";
import { normalizeProfilePicture } from "@/lib/profile-picture";
import type { User, UserCategory } from "@/store/slices/auth-slice";

export { normalizeProfilePicture } from "@/lib/profile-picture";

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseCategoryItems(items: unknown[]): UserCategory[] {
  return items.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];

    const category = raw as Record<string, unknown>;
    const id = toString(category._id);
    const name = toString(category.name);

    if (!id) return [];

    return [{ id, name: name || id }];
  });
}

function parseSelectedCategories(profile: Record<string, unknown>): UserCategory[] {
  if (Array.isArray(profile.selectedCategories)) {
    const parsed = parseCategoryItems(profile.selectedCategories);
    if (parsed.length > 0) return parsed;
  }

  if (Array.isArray(profile.categories)) {
    const parsed = parseCategoryItems(profile.categories);
    if (parsed.length > 0) return parsed;
  }

  if (Array.isArray(profile.categoryIDs)) {
    return profile.categoryIDs.flatMap((raw) => {
      const id =
        typeof raw === "string"
          ? raw
          : raw && typeof raw === "object"
            ? toString((raw as Record<string, unknown>)._id)
            : "";

      if (!id) return [];

      return [{ id, name: "" }];
    });
  }

  return [];
}

export function getUserSelectedCategoryNames(
  user: Pick<User, "selectedCategories"> | null | undefined,
): string[] {
  return [
    ...new Set(
      (user?.selectedCategories ?? [])
        .map((category) => category.name.trim())
        .filter(Boolean),
    ),
  ];
}export function getUserProfilePictureUrl(
  user: Pick<User, "profilePicture"> | null | undefined,
): string | null {
  return normalizeProfilePicture(user?.profilePicture);
}

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

  return {
    ...(profile as unknown as User),
    profilePicture: normalizeProfilePicture(profile.profilePicture),
    selectedCategories: parseSelectedCategories(profile),
    isServiceSubscribed: Boolean(profile.isServiceSubscribed),
    isBadgeVerified: Boolean(profile.isBadgeVerified),
  };
}

export function getUserDisplayName(
  user: Pick<User, "name" | "email" | "companyName"> | null | undefined,
): string {
  if (user?.companyName?.trim()) return user.companyName.trim();
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
  if (!phone?.trim()) return "Not Available";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) {
    return formatUsPhoneNumber(digits.slice(1));
  }

  if (digits.length === 10) {
    return formatUsPhoneNumber(digits);
  }

  return phone;
}
