import { normalizeProfilePicture } from "@/lib/profile-picture";
import type { UserDocFile, UserDocs } from "@/types/user-docs.types";

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function cleanFileUrl(url: string): string {
  return url.replace(/%22$/i, "").replace(/"$/, "").trim();
}

function parseMediaFile(raw: unknown): UserDocFile | null {
  if (!raw || typeof raw !== "object") return null;

  const file = raw as Record<string, unknown>;
  const id = toString(file._id);
  const fileName = toString(file.fileName) || toString(file.filename);
  const url = cleanFileUrl(
    normalizeProfilePicture(file.location) ||
      normalizeProfilePicture(file) ||
      toString(file.location) ||
      "",
  );

  if (!id || !url) return null;

  const isVideo =
    /\.(mp4|mov|webm)$/i.test(fileName) ||
    /\.(mp4|mov|webm)$/i.test(url) ||
    toString(file.mimetype).startsWith("video/");

  return {
    id,
    fileName: fileName || "Portfolio item",
    url,
    isVideo,
  };
}

export function parseUserDocsFromResponse(data: unknown): UserDocs | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const payload =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const portfolioRaw = Array.isArray(payload.portfolioMedia)
    ? payload.portfolioMedia
    : [];

  return {
    portfolioMedia: portfolioRaw
      .map(parseMediaFile)
      .filter((item): item is UserDocFile => item !== null),
  };
}
