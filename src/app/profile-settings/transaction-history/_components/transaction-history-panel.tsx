"use client";

import Image from "next/image";
import { useState } from "react";

import PaginationControls from "@/components/ui/pagination-controls";
import { useTransactionHistoryQuery } from "@/hooks/billing/use-transaction-history-query";
import { TRANSACTION_HISTORY_PAGE_LIMIT } from "@/types/transaction-history.types";

import TransactionHistoryDateFilter, {
  type TransactionHistoryDateRange,
} from "./transaction-history-date-filter";
import TransactionDetailDialog from "./transaction-detail-dialog";
import {
  TransactionHistoryRow,
  TransactionHistoryRowSkeleton,
  TransactionHistoryTableHeader,
} from "./transaction-history-table";

export default function TransactionHistoryPanel() {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<TransactionHistoryDateRange>({});
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    data,
    isLoading,
    isPending,
    isFetching,
    isFetched,
    isError,
    refetch,
  } = useTransactionHistoryQuery({
    page,
    limit: TRANSACTION_HISTORY_PAGE_LIMIT,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const isLoadingHistory =
    isLoading || isPending || (isFetching && !isFetched);

  const items = data?.items ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;
  const currentPage = data?.pagination.currentPage ?? page;
  const safePage = Math.min(currentPage, totalPages);
  const rowOffset = (safePage - 1) * TRANSACTION_HISTORY_PAGE_LIMIT;

  const handleDateRangeApply = (range: TransactionHistoryDateRange) => {
    setDateRange(range);
    setPage(1);
  };

  const handleViewDetail = (id: string) => {
    setSelectedTransactionId(id);
    setIsDetailOpen(true);
  };

  const handleDetailOpenChange = (open: boolean) => {
    setIsDetailOpen(open);
    if (!open) {
      setSelectedTransactionId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-end">
        <TransactionHistoryDateFilter
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleDateRangeApply}
        />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[740px] overflow-hidden rounded-[24px] border border-[rgba(0,88,100,0.08)] bg-white shadow-[0_8px_24px_rgba(0,88,100,0.06)]">
          <div className="p-4 pb-0">
            <TransactionHistoryTableHeader />
          </div>

          {isLoadingHistory ? (
            <div className="divide-y divide-[#F0F0F0] py-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <TransactionHistoryRowSkeleton key={index} />
              ))}
            </div>
          ) : isError ? (
            <div className="px-6 py-14 text-center">
              <p className="text-[15px] text-black/70">
                Unable to load transaction history. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <Image
                src="/asset/nofound.jpg"
                alt="No transactions found"
                width={280}
                height={280}
                className="h-auto max-h-[220px] w-auto max-w-full object-contain"
                unoptimized
              />
              <p className="mt-2 text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
                No transactions found.
              </p>
            </div>
          ) : (
            <div className="mt-3 max-h-[720px] divide-y divide-[#F0F0F0] overflow-y-auto">
              {items.map((item, index) => (
                <TransactionHistoryRow
                  key={item.id}
                  index={rowOffset + index + 1}
                  item={item}
                  onViewDetail={() => handleViewDetail(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {!isLoadingHistory && !isError ? (
        <PaginationControls
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-6 flex justify-end"
        />
      ) : null}

      <TransactionDetailDialog
        transactionId={selectedTransactionId}
        open={isDetailOpen}
        onOpenChange={handleDetailOpenChange}
      />
    </div>
  );
}
