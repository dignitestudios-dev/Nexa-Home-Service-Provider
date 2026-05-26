export function normalizeProfilePicture(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.url, record.path, record.secure_url, record.location];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return null;
}
