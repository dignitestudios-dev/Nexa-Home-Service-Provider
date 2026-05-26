"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jobService } from "@/services/job.service";

import { PROVIDER_DASHBOARD_QUERY_KEY } from "../wallet/use-provider-dashboard-query";
import { JOB_DETAIL_QUERY_KEY } from "./use-job-detail-query";
import { MY_APPLICATIONS_QUERY_KEY } from "./use-my-applications-query";
import { PROVIDER_FEED_QUERY_KEY } from "./use-provider-feed-query";

export function useApplyJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.applyToJob(jobId),
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: [...JOB_DETAIL_QUERY_KEY, jobId] });
      queryClient.invalidateQueries({ queryKey: PROVIDER_DASHBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROVIDER_FEED_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: MY_APPLICATIONS_QUERY_KEY });
    },
  });
}
