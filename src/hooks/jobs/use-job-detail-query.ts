"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseJobDetailFromResponse } from "@/lib/parse-job-detail";
import { jobService } from "@/services/job.service";
import type { RootState } from "@/store/index";

export const JOB_DETAIL_QUERY_KEY = ["job", "detail"] as const;

export function useJobDetailQuery(jobId: string) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: [...JOB_DETAIL_QUERY_KEY, jobId],
    queryFn: async () => {
      const response = await jobService.getJobById(jobId);
      const job = parseJobDetailFromResponse(response);
      if (!job) {
        throw new Error("Invalid job detail response");
      }
      return job;
    },
    enabled: Boolean(jobId) && (hasToken || isAuthenticated),
  });
}
