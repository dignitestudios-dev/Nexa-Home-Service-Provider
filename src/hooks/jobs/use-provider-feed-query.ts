"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseProviderFeedFromResponse } from "@/lib/parse-provider-feed";
import { jobService } from "@/services/job.service";
import type { RootState } from "@/store/index";
import type { JobFilters } from "@/types/job-filters.types";

export const PROVIDER_FEED_QUERY_KEY = ["job", "provider-feed"] as const;

type UseProviderFeedQueryOptions = {
  page?: number;
  limit?: number;
  search?: string;
  filters?: JobFilters;
};

export function useProviderFeedQuery({
  page = 1,
  limit = 10,
  search = "",
  filters,
}: UseProviderFeedQueryOptions = {}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  const jobType =
    filters?.jobType === "one-time" || filters?.jobType === "recurring"
      ? filters.jobType
      : undefined;

  return useQuery({
    queryKey: [
      ...PROVIDER_FEED_QUERY_KEY,
      page,
      limit,
      search.trim(),
      filters?.jobType ?? null,
      filters?.categoryIds ?? [],
      filters?.distanceMiles ?? null,
    ],
    queryFn: async () => {
      const response = await jobService.getProviderFeed({
        page,
        limit,
        search: search.trim() || undefined,
        type: jobType,
        categoryIds: filters?.categoryIds,
        radius: filters?.distanceMiles,
      });
      const result = parseProviderFeedFromResponse(response);
      if (!result) {
        throw new Error("Invalid provider feed response");
      }
      return result;
    },
    enabled: hasToken || isAuthenticated,
  });
}
