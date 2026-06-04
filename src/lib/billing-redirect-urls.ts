export const BILLING_SUCCESS_PATH = "/wallet/success";
export const BILLING_CANCEL_PATH = "/wallet/cancel";

export function getBillingRedirectUrl(path: string): string {
  if (typeof window === "undefined") {
    return path;
  }

  return `${window.location.origin}${path}`;
}
