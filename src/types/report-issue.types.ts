export type ReportIssueStatus = "under-review" | "resolved";

export type ReportIssue = {
  id: string;
  issueId: string;
  title: string;
  description: string;
  createdAt: string;
  status: ReportIssueStatus;
};

export type ReportIssueUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type ReportIssueDetail = ReportIssue & {
  apiStatus: string;
  reportedDate: string;
  resolvedDate: string | null;
  user: ReportIssueUser | null;
};

export type CreateReportIssuePayload = {
  title: string;
  description: string;
};

export type ReportIssuesPagination = {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type ReportIssuesResult = {
  issues: ReportIssue[];
  pagination: ReportIssuesPagination;
};
