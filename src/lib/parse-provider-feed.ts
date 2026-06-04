import type {
  ProviderFeedJob,
  ProviderFeedPagination,
  ProviderFeedResult,
} from "@/types/provider-feed.types";

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseJobCredits(
  job: Record<string, unknown>,
  category: Record<string, unknown> | null,
  type: string,
): number | null {
  const directCredits = toNullableNumber(job.credits);
  if (directCredits !== null) return directCredits;

  const pricing = getRecord(job.pricing) ?? getRecord(category?.pricing);
  if (!pricing) return null;

  const oneTimeCredits = toNullableNumber(pricing.oneTimeCredits);
  const recurringCredits = toNullableNumber(pricing.recurringCredits);

  if (type === "recurring") {
    return recurringCredits ?? oneTimeCredits;
  }

  return oneTimeCredits ?? recurringCredits;
}

function parseJob(raw: unknown): ProviderFeedJob | null {
  if (!raw || typeof raw !== "object") return null;

  const job = raw as Record<string, unknown>;
  const id = toString(job._id);
  if (!id) return null;

  const category = getRecord(job.category);
  const type = toString(job.type);

  return {
    id,
    categoryName: toString(category?.name) || toString(job.title) || "Service",
    title: toString(job.title),
    description: toString(job.description),
    when: toString(job.when),
    type,
    status: toString(job.status),
    jobProviderStatus: toString(job.jobProviderStatus),
    applicationDisplayStatus: toString(job.applicationDisplayStatus),
    credits: parseJobCredits(job, category, type),
  };
}

function parsePagination(raw: unknown): ProviderFeedPagination {
  const pagination =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    itemsPerPage: toNumber(pagination.itemsPerPage, 10),
    currentPage: toNumber(pagination.currentPage, 1),
    totalItems: toNumber(pagination.totalItems),
    totalPages: Math.max(1, toNumber(pagination.totalPages, 1)),
  };
}

export function parseProviderFeedFromResponse(
  data: unknown,
): ProviderFeedResult | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const payload =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const jobsRaw = Array.isArray(payload.jobs) ? payload.jobs : [];
  const jobs = jobsRaw
    .map(parseJob)
    .filter((job): job is ProviderFeedJob => job !== null);

  return {
    jobs,
    pagination: parsePagination(payload.pagination),
  };
}

export function cleanJobDescription(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}

export function jobMatchesSearch(job: ProviderFeedJob, query: string): boolean {
  const normalizedQuery = cleanJobDescription(query).toLowerCase();
  if (!normalizedQuery) return true;

  const searchableText = [
    job.title,
    job.description,
    cleanJobDescription(job.description),
    job.categoryName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function formatJobWhen(when: string): string {
  if (!when.trim()) return "Not specified";

  const date = new Date(`${when}T00:00:00`);
  if (Number.isNaN(date.getTime())) return when;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatJobType(type: string): string {
  if (type === "one-time") return "One Time";
  if (type === "recurring") return "Recurring Job";
  return type.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatApplicationDisplayStatus(status: string): string {
  if (!status.trim()) return "Not available";

  const labels: Record<string, string> = {
    pending: "Pending",
    accepted: "Accepted",
    confirmed: "Confirmed",
    eligible: "Ready to hire",
    ongoing: "Ongoing",
    completed: "Completed",
    no_longer_available: "No Longer Available",
    "ready-to-hire": "Ready to hire",
    "need-an-expert-right-away": "Need an expert right away",
    "researching-options": "Researching options",
  };

  return (
    labels[status.toLowerCase()] ??
    status
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function getApplicationStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
    case "accepted":
      return "bg-[#27AE60]";
    case "confirmed":
      return "bg-[#005864]";
    case "ongoing":
    case "completed":
      return "bg-[#2F80ED]";
    case "no_longer_available":
      return "bg-red-600";
    default:
      return "bg-red-600";
  }
}
