export type TransactionHistoryStatus = "success" | "failed" | "pending" | "other";

export type TransactionHistoryItem = {
  id: string;
  date: string;
  createdAt: string;
  description: string;
  status: TransactionHistoryStatus;
  statusLabel: string;
  amount: number;
  currency: string;
};

export type TransactionPlanSummary = {
  id: string;
  name: string;
  type: string;
  interval: string;
  amount: number;
};

export type TransactionDetail = TransactionHistoryItem & {
  transactionType: string;
  purpose: string;
  platformFee: number;
  paymentFee: number;
  netAmount: number | null;
  paymentMethodType: string;
  errorMessage: string | null;
  plan: TransactionPlanSummary | null;
};

export type TransactionHistoryPagination = {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type TransactionHistoryResult = {
  items: TransactionHistoryItem[];
  pagination: TransactionHistoryPagination;
};

export const TRANSACTION_HISTORY_PAGE_LIMIT = 20;
