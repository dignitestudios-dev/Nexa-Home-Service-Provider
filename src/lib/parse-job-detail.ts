import { normalizeProfilePicture } from "@/lib/profile-picture";
import type {
  JobDetail,
  JobDetailAddress,
  JobDetailAttachment,
  JobDetailClient,
} from "@/types/job-detail.types";

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toBoolean(value: unknown): boolean {
  return value === true;
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseClient(raw: unknown, fallbackId = ""): JobDetailClient {
  if (typeof raw === "string") {
    return {
      id: raw,
      name: "Client",
      email: null,
      phone: null,
      profilePicture: null,
    };
  }

  if (!raw || typeof raw !== "object") {
    return {
      id: fallbackId,
      name: "Client",
      email: null,
      phone: null,
      profilePicture: null,
    };
  }

  const user = raw as Record<string, unknown>;

  return {
    id: toString(user._id) || fallbackId,
    name: toString(user.name) || "Client",
    email: toString(user.email) || toString(user.contactEmail) || null,
    phone: toString(user.phone) || null,
    profilePicture: normalizeProfilePicture(user.profilePicture),
  };
}

function parseAddress(raw: unknown): JobDetailAddress {
  if (!raw || typeof raw !== "object") {
    return {
      label: "Location",
      address: "Not available",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      coordinates: null,
    };
  }

  const address = raw as Record<string, unknown>;
  const coordinatesRaw =
    address.coordinates && typeof address.coordinates === "object"
      ? (address.coordinates as Record<string, unknown>)
      : null;
  const coordinateValues = Array.isArray(coordinatesRaw?.coordinates)
    ? coordinatesRaw.coordinates
    : [];

  const lng = Number(coordinateValues[0]);
  const lat = Number(coordinateValues[1]);
  const city = toString(address.city);
  const state = toString(address.state);

  return {
    label: city || state || "Location",
    address: toString(address.address) || "Not available",
    city,
    state,
    country: toString(address.country),
    zipCode: toString(address.zipCode),
    coordinates:
      Number.isFinite(lng) && Number.isFinite(lat)
        ? [lng, lat]
        : null,
  };
}

function parseAttachment(raw: unknown, index: number): JobDetailAttachment | null {
  if (typeof raw === "string") {
    return {
      id: raw || String(index),
      url: null,
      isVideo: false,
    };
  }

  if (!raw || typeof raw !== "object") return null;

  const attachment = raw as Record<string, unknown>;
  const url =
    normalizeProfilePicture(attachment.location) ||
    normalizeProfilePicture(attachment.url) ||
    toString(attachment.location) ||
    null;
  const fileName =
    toString(attachment.fileName) ||
    toString(attachment.filename) ||
    toString(attachment.key);
  const mimetype = toString(attachment.mimetype);

  return {
    id: toString(attachment._id) || String(index),
    url,
    isVideo:
      mimetype.startsWith("video/") ||
      /\.(mp4|mov|webm)$/i.test(fileName) ||
      /\.(mp4|mov|webm)$/i.test(url ?? ""),
  };
}

function extractJobRecord(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;

  if (typeof record._id === "string") {
    return record;
  }

  const payload =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  if (!payload) return null;

  if (payload.job && typeof payload.job === "object") {
    return payload.job as Record<string, unknown>;
  }

  if (typeof payload._id === "string") {
    return payload;
  }

  return null;
}

export function parseJobDetailFromResponse(data: unknown): JobDetail | null {
  const job = extractJobRecord(data);

  if (!job || typeof job._id !== "string") return null;

  const category =
    job.category && typeof job.category === "object"
      ? (job.category as Record<string, unknown>)
      : null;
  const pricing =
    category?.pricing && typeof category.pricing === "object"
      ? (category.pricing as Record<string, unknown>)
      : null;
  const jobType = toString(job.type);
  const leadCost = toNumber(job.leadCost);
  const oneTimeCredits = toNumber(pricing?.oneTimeCredits);
  const recurringCredits = toNumber(pricing?.recurringCredits);
  const creditsToDeduct =
    leadCost ||
    (jobType === "recurring" ? recurringCredits : oneTimeCredits);

  const images = Array.isArray(job.images) ? job.images : [];
  const attachments = images
    .map(parseAttachment)
    .filter((item): item is JobDetailAttachment => item !== null);

  const contactPreference = Array.isArray(job.contactPreference)
    ? job.contactPreference.map((item) => toString(item)).filter(Boolean)
    : [];

  return {
    id: job._id,
    categoryName: toString(category?.name) || toString(job.title) || "Service",
    title: toString(job.title) || toString(category?.name) || "Service",
    description: toString(job.description),
    when: toString(job.when),
    type: toString(job.type),
    status: toString(job.status),
    jobProviderStatus: toString(job.jobProviderStatus),
    postedDate: toString(job.createdAt),
    contactPreferences: contactPreference,
    attachments,
    address: parseAddress(job.addressDetails),
    client: parseClient(job.user, toString(job.user)),
    isLocked: toBoolean(job.isLocked),
    hasApplied: toBoolean(job.hasApplied),
    applicationDisplayStatus: toString(job.applicationDisplayStatus),
    leadCost,
    creditsToDeduct,
    badge:
      toString(job.jobProviderStatus) === "ongoing" ? "Ongoing" : undefined,
  };
}

export function formatJobTypeShort(type: string): string {
  if (type === "one-time") return "One Time";
  if (type === "recurring") return "Recurring";
  return type.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatPurchaseModalDate(when: string): string {
  if (!when.trim()) return "Not available";

  const date = new Date(when.includes("T") ? when : `${when}T00:00:00`);
  if (Number.isNaN(date.getTime())) return when;

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatPurchaseModalTime(when: string): string {
  if (!when.includes("T")) return "Not specified";

  const date = new Date(when);
  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatJobStatus(status: string, jobProviderStatus: string): string {
  const value = jobProviderStatus || status;
  if (!value) return "Not available";

  const labels: Record<string, string> = {
    pending: "Pending",
    eligible: "Ready to hire",
    ongoing: "Ongoing",
    completed: "Completed",
    "ready-to-hire": "Ready to hire",
    "need-an-expert-right-away": "Need an expert right away",
    "researching-options": "Researching options",
  };

  return labels[value.toLowerCase()] ?? value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatContactPreferences(preferences: string[]): string {
  if (preferences.length === 0) return "Not available";

  const labels: Record<string, string> = {
    phone: "Call/Text",
    email: "Email",
  };

  return preferences
    .map((preference) => labels[preference.toLowerCase()] ?? preference)
    .join(", ");
}

export function formatPostedDate(isoDate: string): string {
  if (!isoDate.trim()) return "Not available";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function maskClientName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Client";

  const [firstName] = trimmed.split(/\s+/);
  return `${firstName}${"*".repeat(6)}`;
}

export function shouldMaskClientContact(job: JobDetail): boolean {
  const providerStatus = job.jobProviderStatus.toLowerCase();

  if (providerStatus === "applied" || job.hasApplied) {
    return false;
  }

  return job.applicationDisplayStatus.toLowerCase() === "pending";
}

export function getClientDisplay(job: JobDetail) {
  if (shouldMaskClientContact(job)) {
    return {
      name: maskClientName(job.client.name),
      phone: "*************",
      email: "*********************",
    };
  }

  return {
    name: job.client.name,
    phone: job.client.phone ?? "Not available",
    email: job.client.email ?? "Not available",
  };
}

export function getClientInitials(name: string): string {
  const parts = name.replace(/\*/g, "").trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return "CL";
}
