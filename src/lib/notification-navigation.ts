import type { NotificationMetadata } from "@/types/notification.types";

function normalizeNotificationType(value: string): string {
  return value.trim().toUpperCase();
}

export function getNotificationRoute(
  metadata: NotificationMetadata | null | undefined,
): string | null {
  if (!metadata) return null;

  const cta = metadata.cta?.trim() ?? "";
  if (cta.startsWith("/")) {
    return cta;
  }

  const type = normalizeNotificationType(metadata.type);
  const resourceId = metadata.resourceId?.trim() ?? "";

  switch (type) {
    case "NEW_JOB_MATCH":
    case "NEW_JOB_POSTED":
    case "JOB":
      return resourceId ? `/jobs/${resourceId}` : "/home";
    case "JOB_COMPLETED":
      return resourceId ? `/my-jobs/${resourceId}` : "/my-jobs";
    case "JOB_ACCEPTED":
      return resourceId ? `/my-jobs/${resourceId}` : "/my-jobs";
    case "JOB_APPLIED":
    case "JOB_UPDATED":
    case "JOB_CANCELLED":
      return resourceId ? `/my-jobs/${resourceId}` : "/my-jobs";
    case "TRANSACTION":
    case "PAYMENT_SUCCEEDED":
    case "PAYMENT_FAILED":
    case "SUBSCRIPTION":
      return "/profile-settings/transaction-history";
    case "SERVICE_PLAN":
    case "SUBSCRIPTION_PLAN":
      return "/profile-settings/service-plan";
    case "AD_PROMOTION":
    case "ADVERTISEMENT":
      return "/profile-settings/ad-promotion";
    case "REVIEW":
    case "NEW_REVIEW":
    case "NEW_REVIEW_RECEIVED":
      return resourceId
        ? `/user-profile?tab=reviews&reviewId=${resourceId}`
        : "/user-profile?tab=reviews";
    case "RATING":
    case "RATING_IMPROVED":
    case "RATING_UPDATED":
      return "/user-profile?tab=reviews";
    default:
      if (resourceId) {
        return `/my-jobs/${resourceId}`;
      }

      return "/home";
  }
}
