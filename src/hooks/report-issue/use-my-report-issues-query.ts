"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseReportIssuesFromResponse } from "@/lib/parse-report-issue-response";
import { reportIssueService } from "@/services/report-issue.service";
import type { ReportIssue } from "@/types/report-issue.types";
import type { RootState } from "@/store/index";

export const REPORT_ISSUES_QUERY_KEY = ["report-issue", "my"] as const;
export const REPORT_ISSUES_PER_PAGE = 8;

async function fetchAllMyReportIssues(): Promise<ReportIssue[]> {
  const allIssues: ReportIssue[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await reportIssueService.getMyIssues({
      page,
      limit: REPORT_ISSUES_PER_PAGE,
    });
    const parsed = parseReportIssuesFromResponse(response);

    if (!parsed) {
      throw new Error("Invalid report issues response");
    }

    allIssues.push(...parsed.issues);
    totalPages = parsed.pagination.totalPages;
    page += 1;
  }

  return allIssues;
}

export function useMyReportIssuesQuery() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: REPORT_ISSUES_QUERY_KEY,
    queryFn: fetchAllMyReportIssues,
    enabled: hasToken || isAuthenticated,
  });
}
