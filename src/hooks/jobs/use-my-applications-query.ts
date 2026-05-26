"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseProviderFeedFromResponse } from "@/lib/parse-provider-feed";
import { jobService } from "@/services/job.service";
import type { RootState } from "@/store/index";

export type MyApplicationsTab = "applied" | "confirmed" | "completed";

export const MY_APPLICATIONS_QUERY_KEY = ["job", "my-applications"] as const;

type UseMyApplicationsQueryOptions = {
  tab: MyApplicationsTab;
  page?: number;
  limit?: number;
};

export function useMyApplicationsQuery({
  tab,
  page = 1,
  limit = 10,
}: UseMyApplicationsQueryOptions) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: [...MY_APPLICATIONS_QUERY_KEY, tab, page, limit],
    queryFn: async () => {
      const response = await jobService.getMyApplications({ tab, page, limit });
      const result = parseProviderFeedFromResponse(response);
      if (!result) {
        throw new Error("Invalid my applications response");
      }
      return result;
    },
    enabled: hasToken || isAuthenticated,
  });
}
