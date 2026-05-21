import type { CheckEmailResponse } from "@/types/auth.types";
import type { User } from "@/store/slices/auth-slice";
import { getOnboardingRedirectPath } from "@/lib/onboarding-steps";

export function parseEmailExists(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }

  const response = data as CheckEmailResponse;

  if (typeof response.exists === "boolean") return response.exists;
  if (typeof response.emailExists === "boolean") return response.emailExists;
  if (typeof response.isRegistered === "boolean") return response.isRegistered;
  if (typeof response.registered === "boolean") return response.registered;
  if (typeof response.userExists === "boolean") return response.userExists;

  if (response.data) {
    return parseEmailExists(response.data);
  }

  const message = response.message?.toLowerCase() ?? "";
  if (message.includes("already") || message.includes("exists")) {
    return true;
  }

  return false;
}

export function formatUsPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits.length ? `(${digits}` : "";
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Converts US display phone to E.164 (+1 + 10 digits). */
export function toE164UsPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

/** Post-login / post-step redirect (sequential onboarding). */
export const getRedirectPath = (user: User | null): string =>
  getOnboardingRedirectPath(user);
