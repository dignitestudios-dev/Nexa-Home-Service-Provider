"use client";

import { CalendarDays, Eye } from "lucide-react";

import { formatTransactionAmount } from "@/lib/parse-transaction-history-response";
import type { TransactionHistoryItem } from "@/types/transaction-history.types";

const TABLE_GRID =
  "grid grid-cols-[48px_120px_minmax(0,1fr)_100px_110px_48px] items-center gap-x-8 gap-y-1";

const STATUS_STYLES: Record<
  TransactionHistoryItem["status"],
  string
> = {
  success: "bg-[#E8F7EF] text-[#0F7A45]",
  failed: "bg-[#FFF1F1] text-[#F01A1A]",
  pending: "bg-[#FFF8E8] text-[#B8860B]",
  other: "bg-[rgba(0,88,100,0.08)] text-[rgba(24,24,24,0.75)]",
};

export function TransactionStatusBadge({
  status,
  label,
}: {
  status: TransactionHistoryItem["status"];
  label: string;
}) {
  return (
    <span
      className={`inline-flex min-w-[72px] items-center justify-center rounded-full px-2.5 py-1 text-[12px] font-[600] leading-4 ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
}

type TransactionHistoryTableHeaderProps = {
  className?: string;
};

export function TransactionHistoryTableHeader({
  className = "",
}: TransactionHistoryTableHeaderProps) {
  return (
    <div
      className={`${TABLE_GRID} rounded-[16px] bg-[rgba(0,88,100,0.06)] px-6 py-3.5 text-[13px] font-[600] uppercase tracking-[0.04em] text-[rgba(24,24,24,0.65)] ${className}`}
    >
      <span>No.</span>
      <span>Date</span>
      <span>Description</span>
      <span className="text-center">Status</span>
      <span className="text-right">Amount</span>
      <span className="text-center">Action</span>
    </div>
  );
}

type TransactionHistoryRowProps = {
  index: number;
  item: TransactionHistoryItem;
  onViewDetail: (item: TransactionHistoryItem) => void;
};

export function TransactionHistoryRow({
  index,
  item,
  onViewDetail,
}: TransactionHistoryRowProps) {
  return (
    <div
      className={`${TABLE_GRID} group px-6 py-4 transition-colors hover:bg-[rgba(0,88,100,0.03)]`}
    >
      <span className="tabular-nums text-[15px] font-[500] text-[rgba(24,24,24,0.55)]">
        {String(index).padStart(2, "0")}
      </span>
      <span className="whitespace-nowrap text-[15px] text-[rgba(24,24,24,0.85)]">
        {item.date || "-"}
      </span>
      <span className="truncate text-[15px] font-[500] text-[#1C1C1C]">
        {item.description}
      </span>
      <span className="flex justify-center">
        <TransactionStatusBadge
          status={item.status}
          label={item.statusLabel}
        />
      </span>
      <span className="text-right text-[15px] font-[600] tabular-nums text-[#005864]">
        {formatTransactionAmount(item.amount, item.currency)}
      </span>
      <span className="flex justify-center">
        <button
          type="button"
          onClick={() => onViewDetail(item)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white text-[#005864] shadow-sm transition group-hover:border-[rgba(0,88,100,0.12)] group-hover:bg-[rgba(0,88,100,0.08)]"
          aria-label={`View details for ${item.description}`}
        >
          <Eye className="h-4 w-4" strokeWidth={2} />
        </button>
      </span>
    </div>
  );
}

type TransactionHistoryCalendarButtonProps = {
  onClick?: () => void;
};

export function TransactionHistoryCalendarButton({
  onClick,
}: TransactionHistoryCalendarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#005864] shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)] transition hover:opacity-90"
      aria-label="Filter by date"
    >
      <CalendarDays className="h-6 w-6 text-white" strokeWidth={1.8} />
    </button>
  );
}

export function TransactionHistoryRowSkeleton() {
  return (
    <div className={`${TABLE_GRID} px-6 py-4`}>
      <div className="h-4 w-6 animate-pulse rounded bg-[#E8E8E8]" />
      <div className="h-4 w-20 animate-pulse rounded bg-[#E8E8E8]" />
      <div className="h-4 w-full max-w-[220px] animate-pulse rounded bg-[#E8E8E8]" />
      <div className="mx-auto h-6 w-16 animate-pulse rounded-full bg-[#E8E8E8]" />
      <div className="ml-auto h-4 w-16 animate-pulse rounded bg-[#E8E8E8]" />
      <div className="mx-auto h-9 w-9 animate-pulse rounded-full bg-[#E8E8E8]" />
    </div>
  );
}
