import { getApiErrorMessage } from "@/lib/api-error";
import { pushToast } from "@/lib/toast-store";

export function getApiSuccessMessage(
  data: unknown,
  fallback = "Operation completed successfully.",
): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }

  if (nested && typeof nested.message === "string" && nested.message.trim()) {
    return nested.message;
  }

  return fallback;
}

export const toast = {
  success(message: string, duration?: number) {
    pushToast({ message, variant: "success", duration });
  },

  error(message: string, duration?: number) {
    pushToast({ message, variant: "error", duration });
  },

  fromApiSuccess(data: unknown, fallback?: string) {
    this.success(getApiSuccessMessage(data, fallback));
  },

  fromApiError(error: unknown, fallback?: string) {
    this.error(getApiErrorMessage(error, fallback));
  },
};
