import type { SubscriptionPlan } from "@/types/subscription-plan.types";

function getRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }
  return false;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function getPlansPayload(data: unknown): unknown[] {
  const record = getRecord(data);
  if (!record) return [];

  if (Array.isArray(record.data)) {
    return record.data;
  }

  if (Array.isArray(record)) {
    return record;
  }

  return [];
}

function parsePlanMetadata(value: unknown): SubscriptionPlan["metadata"] {
  const metadata = getRecord(value) ?? {};

  return {
    isRecurring: toBoolean(metadata.isRecurring),
    quota: toNumber(metadata.quota),
    isUnlimited: toBoolean(metadata.isUnlimited),
    currency:
      typeof metadata.currency === "string"
        ? metadata.currency.toLowerCase()
        : "usd",
    stripeProductId:
      typeof metadata.stripeProductId === "string"
        ? metadata.stripeProductId
        : undefined,
  };
}

function parseBadgeEligibility(
  value: unknown,
): SubscriptionPlan["badgeEligibility"] {
  const record = getRecord(value);
  if (!record) return undefined;

  return {
    minCompletedJobs: toNumber(
      record.min_completed_jobs ?? record.minCompletedJobs,
    ),
    minAverageRating: toNumber(
      record.min_average_rating ?? record.minAverageRating,
    ),
  };
}

function parsePlanItem(value: unknown): SubscriptionPlan | null {
  const item = getRecord(value);
  if (!item) return null;

  const id =
    (typeof item._id === "string" && item._id) ||
    (typeof item.id === "string" && item.id) ||
    "";

  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!id || !name) return null;

  return {
    id,
    slug: typeof item.slug === "string" ? item.slug : "",
    name,
    amount: toNumber(item.amount),
    interval:
      typeof item.interval === "string" ? item.interval.toLowerCase() : "month",
    description: toStringArray(item.description),
    type: typeof item.type === "string" ? item.type : "",
    role: typeof item.role === "string" ? item.role : "",
    sortIndex: toNumber(item.sortIndex),
    priceId: typeof item.priceId === "string" ? item.priceId : "",
    isSubscribed: toBoolean(item.is_subscribed ?? item.isSubscribed),
    isBadgeEligible: toBoolean(
      item.isBagdeEligible ??
        item.isBadgeEligible ??
        item.is_badge_eligible ??
        false,
    ),
    badgeEligibility: parseBadgeEligibility(
      item.badge_eligibility ?? item.badgeEligibility,
    ),
    metadata: parsePlanMetadata(item.metadata),
  };
}

export function parseSubscriptionPlansFromResponse(
  data: unknown,
): SubscriptionPlan[] {
  return getPlansPayload(data)
    .map(parsePlanItem)
    .filter((plan): plan is SubscriptionPlan => plan !== null)
    .sort((left, right) => left.sortIndex - right.sortIndex);
}

export function formatSubscriptionPlanPrice(plan: SubscriptionPlan): string {
  const suffix = plan.interval === "year" ? "year" : "month";
  return `$${plan.amount}/${suffix}`;
}

export function formatBadgeEligibilityMessage(
  eligibility?: SubscriptionPlan["badgeEligibility"],
): string {
  if (!eligibility) {
    return "You are not eligible to purchase the verified badge yet.";
  }

  const requirements: string[] = [];

  if (eligibility.minCompletedJobs > 0) {
    requirements.push(
      `complete at least ${eligibility.minCompletedJobs.toLocaleString("en-US")} jobs`,
    );
  }

  if (eligibility.minAverageRating > 0) {
    requirements.push(
      `maintain a ${eligibility.minAverageRating.toLocaleString("en-US")}.0 average rating`,
    );
  }

  if (!requirements.length) {
    return "You are not eligible to purchase the verified badge yet.";
  }

  return `Please ${requirements.join(" and ")} to purchase the verified badge.`;
}
