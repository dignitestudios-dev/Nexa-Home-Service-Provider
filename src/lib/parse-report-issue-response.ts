import type {
  ReportIssue,
  ReportIssueDetail,
  ReportIssueStatus,
  ReportIssueUser,
  ReportIssuesPagination,
  ReportIssuesResult,
} from "@/types/report-issue.types";

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeStatus(value: unknown): ReportIssueStatus {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (normalized === "pending") {
    return "under-review";
  }

  return "resolved";
}

function formatIssueDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    }

    return value;
  }

  return new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function getIssueId(value: unknown): string {
  const id = typeof value === "string" ? value : "";
  if (!id) {
    return String(Math.floor(10000000 + Math.random() * 90000000));
  }

  return id.length > 8 ? id.slice(-8) : id;
}

function parseIssueItem(
  item: Record<string, unknown>,
  fallback?: Pick<ReportIssue, "title" | "description">,
): ReportIssue | null {
  const title =
    (typeof item.title === "string" && item.title.trim()) ||
    fallback?.title ||
    "";
  const description =
    (typeof item.description === "string" && item.description.trim()) ||
    fallback?.description ||
    "";

  if (!title || !description) {
    return null;
  }

  const id =
    (typeof item._id === "string" && item._id) ||
    (typeof item.id === "string" && item.id) ||
    crypto.randomUUID();

  return {
    id,
    issueId: getIssueId(id),
    title,
    description,
    createdAt: formatIssueDate(
      item.reportedDate ?? item.createdAt ?? item.created_at,
    ),
    status: normalizeStatus(item.status),
  };
}

function parsePagination(value: unknown): ReportIssuesPagination {
  const pagination = getRecord(value) ?? {};

  return {
    itemsPerPage: toNumber(pagination.itemsPerPage, 9),
    currentPage: toNumber(pagination.currentPage, 1),
    totalItems: toNumber(pagination.totalItems),
    totalPages: Math.max(1, toNumber(pagination.totalPages, 1)),
  };
}

function getIssuesPayload(data: unknown): Record<string, unknown> | null {
  const record = getRecord(data);
  if (!record) return null;

  return getRecord(record.data) ?? record;
}

export function parseReportIssuesFromResponse(
  data: unknown,
): ReportIssuesResult | null {
  const payload = getIssuesPayload(data);
  if (!payload) return null;

  const rawIssues = Array.isArray(payload.issues) ? payload.issues : [];

  const issues = rawIssues
    .map((item) => parseIssueItem(getRecord(item) ?? {}))
    .filter((issue): issue is ReportIssue => issue !== null);

  return {
    issues,
    pagination: parsePagination(payload.pagination),
  };
}

function getIssuePayload(data: unknown): Record<string, unknown> | null {
  const record = getRecord(data);
  if (!record) return null;

  const nested = getRecord(record.data);
  if (!nested) return record;

  const issue = getRecord(nested.issue);
  if (issue) return issue;

  if (!Array.isArray(nested.issues)) {
    return nested;
  }

  return record;
}

function parseIssueUser(value: unknown): ReportIssueUser | null {
  const user = getRecord(value);
  if (!user) return null;

  return {
    id:
      (typeof user._id === "string" && user._id) ||
      (typeof user.id === "string" && user.id) ||
      "",
    name: typeof user.name === "string" ? user.name : "",
    email: typeof user.email === "string" ? user.email : "",
    phone: typeof user.phone === "string" ? user.phone : "",
    role: typeof user.role === "string" ? user.role : "",
  };
}

export function parseReportIssueDetailFromResponse(
  data: unknown,
): ReportIssueDetail | null {
  const payload = getIssuePayload(data);
  if (!payload) return null;

  const issue = parseIssueItem(payload);
  if (!issue) return null;

  const resolvedDateRaw = payload.resolvedDate;

  return {
    ...issue,
    apiStatus: String(payload.status ?? ""),
    reportedDate: formatIssueDate(
      payload.reportedDate ?? payload.createdAt ?? payload.created_at,
    ),
    resolvedDate:
      resolvedDateRaw == null || resolvedDateRaw === ""
        ? null
        : formatIssueDate(resolvedDateRaw),
    user: parseIssueUser(payload.user),
  };
}

export function parseReportIssueFromResponse(
  data: unknown,
  fallback?: Pick<ReportIssue, "title" | "description">,
): ReportIssue | null {
  const payload = getIssuePayload(data);
  if (!payload) return null;

  return parseIssueItem(payload, fallback);
}
