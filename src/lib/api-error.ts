import { AxiosError } from "axios";

import { showConnectivityLostModal } from "@/lib/connectivity-store";

let lastConnectivityModalAt = 0;

export function isConnectivityError(error: unknown): boolean {
  if (typeof window !== "undefined" && !navigator.onLine) {
    return true;
  }

  if (error instanceof AxiosError) {
    if (!error.response) return true;

    if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
      return true;
    }
  }

  if (error instanceof Error) {
    const message = error.message.trim().toLowerCase();
    if (message === "network error" || message.includes("network error")) {
      return true;
    }
  }

  return false;
}

export function notifyConnectivityLost(): void {
  const now = Date.now();
  if (now - lastConnectivityModalAt < 800) return;

  lastConnectivityModalAt = now;
  showConnectivityLostModal();
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string | null {
  if (isConnectivityError(error)) {
    notifyConnectivityLost();
    return null;
  }

  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;

      if (typeof record.message === "string") {
        return record.message;
      }

      if (typeof record.error === "string") {
        return record.error;
      }

      if (Array.isArray(record.errors)) {
        return record.errors.map(String).join(", ");
      }
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function isCategoryLimitExceededError(error: unknown): boolean {
  const message = getApiErrorMessage(error, "");
  if (!message) return false;

  const normalized = message.toLowerCase();
  return (
    normalized.includes("category limit") ||
    normalized.includes("upgrade your subscription")
  );
}
