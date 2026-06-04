"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseTransactionDetailFromResponse } from "@/lib/parse-transaction-history-response";
import { billingService } from "@/services/billing.service";
import type { RootState } from "@/store/index";
import type { TransactionDetail } from "@/types/transaction-history.types";

export const TRANSACTION_DETAIL_QUERY_KEY = [
  "billing",
  "transaction-detail",
] as const;

type UseTransactionDetailQueryOptions = {
  transactionId: string | null;
  enabled?: boolean;
};

export function useTransactionDetailQuery({
  transactionId,
  enabled = true,
}: UseTransactionDetailQueryOptions) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery<TransactionDetail>({
    queryKey: [...TRANSACTION_DETAIL_QUERY_KEY, transactionId],
    queryFn: async () => {
      const response = await billingService.getTransactionById(transactionId!);
      const transaction = parseTransactionDetailFromResponse(response);

      if (!transaction) {
        throw new Error("Invalid transaction detail response");
      }

      return transaction;
    },
    enabled:
      enabled && Boolean(transactionId) && (hasToken || isAuthenticated),
  });
}
