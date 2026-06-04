import { API } from "@/lib/axios";
import type { CreateReportIssuePayload } from "@/types/report-issue.types";

type GetMyReportIssuesParams = {
  page?: number;
  limit?: number;
};

export const reportIssueService = {
  create: async (payload: CreateReportIssuePayload) => {
    const { data } = await API.post("/report-issue", payload);
    return data;
  },

  getMyIssues: async ({ page = 1, limit = 8 }: GetMyReportIssuesParams = {}) => {
    const { data } = await API.get("/report-issue/my", {
      params: { page, limit },
    });
    return data;
  },

  getById: async (issueId: string) => {
    const { data } = await API.get(`/report-issue/${issueId}`);
    return data;
  },
};