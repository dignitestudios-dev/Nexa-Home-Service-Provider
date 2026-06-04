"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  REPORT_ISSUES_QUERY_KEY,
} from "@/hooks/report-issue/use-my-report-issues-query";
import { toast } from "@/lib/toast";
import { reportIssueService } from "@/services/report-issue.service";
import type { CreateReportIssuePayload } from "@/types/report-issue.types";

export function useCreateReportIssueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReportIssuePayload) =>
      reportIssueService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REPORT_ISSUES_QUERY_KEY });
    },
    onError: (error) => {
      toast.fromApiError(error, "Failed to submit report. Please try again.");
    },
  });
}