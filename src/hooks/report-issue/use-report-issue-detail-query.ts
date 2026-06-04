"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseReportIssueDetailFromResponse } from "@/lib/parse-report-issue-response";
import { reportIssueService } from "@/services/report-issue.service";
import type { RootState } from "@/store/index";

export const REPORT_ISSUE_DETAIL_QUERY_KEY = ["report-issue", "detail"] as const;

type UseReportIssueDetailQueryOptions = {
  issueId: string | null;
  enabled?: boolean;
};

export function useReportIssueDetailQuery({
  issueId,
  enabled = true,
}: UseReportIssueDetailQueryOptions) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: [...REPORT_ISSUE_DETAIL_QUERY_KEY, issueId],
    queryFn: async () => {
      const response = await reportIssueService.getById(issueId!);
      const issue = parseReportIssueDetailFromResponse(response);

      if (!issue) {
        throw new Error("Invalid report issue detail response");
      }

      return issue;
    },
    enabled:
      enabled && Boolean(issueId) && (hasToken || isAuthenticated),
  });
}
