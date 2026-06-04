export const BILLING_SUCCESS_PATH = "/wallet/success";
export const BILLING_CANCEL_PATH = "/wallet/cancel";
export const SERVICE_PLAN_SUCCESS_PATH = "/profile-settings/service-plan/success";
export const SERVICE_PLAN_CANCEL_PATH = "/profile-settings/service-plan/cancel";
export const PROFILE_SETUP_PLAN_SUCCESS_PATH =
  "/onboarding/profile-setup?planPurchase=success";
export const PROFILE_SETUP_PLAN_CANCEL_PATH =
  "/onboarding/profile-setup?planPurchase=cancel";
export const VERIFIED_BADGE_PLAN_SUCCESS_PATH =
  "/profile-settings/verified-badge-plan/success";
export const VERIFIED_BADGE_PLAN_CANCEL_PATH =
  "/profile-settings/verified-badge-plan/cancel";
export const AD_PROMOTION_SUCCESS_PATH =
  "/profile-settings/ad-promotion/success";
export const AD_PROMOTION_CANCEL_PATH =
  "/profile-settings/ad-promotion/cancel";
export const WALKTHROUGH_CREDIT_SUCCESS_PATH =
  "/Walkthrough/credit-plans/success";
export const WALKTHROUGH_CREDIT_CANCEL_PATH =
  "/Walkthrough/credit-plans/cancel";
export const WALKTHROUGH_VERIFIED_BADGE_SUCCESS_PATH =
  "/Walkthrough/verified-badge/success";
export const WALKTHROUGH_VERIFIED_BADGE_CANCEL_PATH =
  "/Walkthrough/verified-badge/cancel";

export function getBillingRedirectUrl(path: string): string {
  if (typeof window === "undefined") {
    return path;
  }

  return `${window.location.origin}${path}`;
}
