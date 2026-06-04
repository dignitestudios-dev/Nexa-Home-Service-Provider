export type SubscriptionPlanInterval = "month" | "year" | string;

export type SubscriptionPlanMetadata = {
  isRecurring: boolean;
  quota: number;
  isUnlimited: boolean;
  currency: string;
  stripeProductId?: string;
};

export type BadgeEligibility = {
  minCompletedJobs: number;
  minAverageRating: number;
};

export type SubscriptionPlan = {
  id: string;
  slug: string;
  name: string;
  amount: number;
  interval: SubscriptionPlanInterval;
  description: string[];
  type: string;
  role: string;
  sortIndex: number;
  priceId: string;
  isSubscribed: boolean;
  isBadgeEligible: boolean;
  badgeEligibility?: BadgeEligibility;
  metadata: SubscriptionPlanMetadata;
};

export type SubscriptionPlanType = "category" | string;
