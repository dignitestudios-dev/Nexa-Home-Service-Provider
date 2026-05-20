import { AxiosError } from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
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
