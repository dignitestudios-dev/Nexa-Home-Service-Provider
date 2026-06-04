import {
  getUserInitials,
  normalizeProfilePicture,
} from "@/lib/parse-user-profile";
import type {
  ReviewRatingDistribution,
  ReviewsPagination,
  ReviewsResult,
  ReviewsSummary,
  UserReview,
} from "@/types/review.types";

function toString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatReviewDate(value: unknown): string {
  const raw = toString(value);
  if (!raw.trim()) return "Not available";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function getReviewer(review: Record<string, unknown>): Record<string, unknown> | null {
  const nested =
    review.reviewer ??
    review.fromUser ??
    review.user ??
    review.client ??
    review.reviewedBy ??
    review.createdBy;

  if (nested && typeof nested === "object") {
    return nested as Record<string, unknown>;
  }

  return null;
}

function getReviewerName(review: Record<string, unknown>): string {
  const person = getReviewer(review);

  if (person) {
    const fullName =
      toString(person.name).trim() || toString(person.fullName).trim();
    if (fullName) return fullName;

    const firstName = toString(person.firstName).trim();
    const lastName = toString(person.lastName).trim();
    const combined = `${firstName} ${lastName}`.trim();
    if (combined) return combined;
  }

  return (
    toString(review.reviewerName).trim() ||
    toString(review.userName).trim() ||
    toString(review.name).trim() ||
    "Anonymous"
  );
}

function getReviewerProfilePictureUrl(
  review: Record<string, unknown>,
): string | null {
  const person = getReviewer(review);
  if (!person) return null;

  return normalizeProfilePicture(person.profilePicture);
}

function getJobTitle(review: Record<string, unknown>): string {
  const job = review.job;
  if (job && typeof job === "object") {
    const title = toString((job as Record<string, unknown>).title).trim();
    if (title) return title;
  }

  return (
    toString(review.jobTitle).trim() ||
    toString(review.title).trim() ||
    "Job not available"
  );
}

function parseReview(raw: unknown): UserReview | null {
  if (!raw || typeof raw !== "object") return null;

  const review = raw as Record<string, unknown>;
  const id = toString(review._id) || toString(review.id);
  if (!id) return null;

  const name = getReviewerName(review);
  const rating = Math.min(
    5,
    Math.max(0, Math.round(toNumber(review.rating ?? review.stars ?? review.score))),
  );
  const comment =
    toString(review.comment).trim() ||
    toString(review.review).trim() ||
    toString(review.text).trim() ||
    toString(review.feedback).trim() ||
    toString(review.description).trim();
  const date = formatReviewDate(
    review.createdAt ?? review.updatedAt ?? review.reviewedAt ?? review.date,
  );

  return {
    id,
    name,
    initials: getUserInitials(name),
    profilePictureUrl: getReviewerProfilePictureUrl(review),
    jobTitle: getJobTitle(review),
    rating,
    comment: comment || "No comment provided.",
    date,
  };
}

function parseDistribution(raw: unknown): ReviewRatingDistribution {
  const distribution =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    1: toNumber(distribution["1"]),
    2: toNumber(distribution["2"]),
    3: toNumber(distribution["3"]),
    4: toNumber(distribution["4"]),
    5: toNumber(distribution["5"]),
  };
}

function parseSummary(raw: unknown): ReviewsSummary {
  const summary =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    averageRating: toNumber(summary.averageRating),
    totalReviews: toNumber(summary.totalReviews),
    distribution: parseDistribution(summary.distribution),
  };
}

function parsePagination(raw: unknown): ReviewsPagination {
  const pagination =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    itemsPerPage: toNumber(pagination.itemsPerPage, 10),
    currentPage: toNumber(pagination.currentPage, 1),
    totalItems: toNumber(pagination.totalItems),
    totalPages: toNumber(pagination.totalPages),
  };
}

export function parseReviewsFromResponse(data: unknown): ReviewsResult | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  if (record.success === false) return null;

  const payload =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  if (!payload) return null;

  const reviewsRaw = Array.isArray(payload.reviews) ? payload.reviews : [];
  const reviews = reviewsRaw
    .map(parseReview)
    .filter((item): item is UserReview => item !== null);

  return {
    summary: parseSummary(payload.summary),
    reviews,
    pagination: parsePagination(payload.pagination),
  };
}
