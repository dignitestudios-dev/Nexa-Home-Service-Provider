import type { ProviderDashboardCounts } from "@/types/provider-dashboard.types";

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseProviderDashboardFromResponse(
  data: unknown,
): ProviderDashboardCounts | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const counts =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  return {
    totalCompletedJobs: toNumber(counts.totalCompletedJobs),
    ongoingJobs: toNumber(counts.ongoingJobs),
    totalLeadPurchased: toNumber(counts.totalLeadPurchased),
    totalHired: toNumber(counts.totalHired),
    availableCredits: toNumber(counts.availableCredits),
  };
}
