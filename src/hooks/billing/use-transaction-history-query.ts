"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseTransactionHistoryFromResponse } from "@/lib/parse-transaction-history-response";
import { billingService } from "@/services/billing.service";
import type { RootState } from "@/store/index";
import {
  TRANSACTION_HISTORY_PAGE_LIMIT,
  type TransactionHistoryResult,
} from "@/types/transaction-history.types";

export const TRANSACTION_HISTORY_QUERY_KEY = ["billing", "transactions"] as const;

type UseTransactionHistoryQueryOptions = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
};

export function useTransactionHistoryQuery({
  page = 1,
  limit = TRANSACTION_HISTORY_PAGE_LIMIT,
  startDate,
  endDate,
  enabled = true,
}: UseTransactionHistoryQueryOptions = {}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery<TransactionHistoryResult>({
    queryKey: [
      ...TRANSACTION_HISTORY_QUERY_KEY,
      page,
      limit,
      startDate ?? "",
      endDate ?? "",
    ],
    queryFn: async () => {
      const response = await billingService.getTransactions({
        page,
        limit,
        startDate,
        endDate,
      });
      return parseTransactionHistoryFromResponse(response);
    },
    enabled: enabled && (hasToken || isAuthenticated),
    refetchOnMount: "always",
  });
}
