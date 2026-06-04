"use client";

import {
  CalendarDays,
  CreditCard,
  Hash,
  Receipt,
  Tag,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactionDetailQuery } from "@/hooks/billing/use-transaction-detail-query";
import {
  formatTransactionAmount,
  formatTransactionLabel,
} from "@/lib/parse-transaction-history-response";

import { TransactionStatusBadge } from "./transaction-history-table";

type TransactionDetailDialogProps = {
  transactionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[12px] bg-[#F8F8F8] px-4 py-3">
      <div className="flex items-center gap-2 text-[rgba(24,24,24,0.6)]">
        {icon}
        <span className="text-[13px] font-[500] leading-4">{label}</span>
      </div>
      <p className="mt-2 break-words text-[15px] font-[500] leading-5 text-[#1C1C1C]">
        {value}
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-32 rounded bg-[#E8E8E8]" />
          <div className="h-7 w-24 rounded-full bg-[#E8E8E8]" />
        </div>
        <div className="mt-4 h-7 w-3/4 rounded bg-[#E8E8E8]" />
        <div className="mt-3 h-8 w-28 rounded bg-[#E8E8E8]" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[72px] rounded-[12px] bg-[#F8F8F8]"
          />
        ))}
      </div>
    </div>
  );
}

export default function TransactionDetailDialog({
  transactionId,
  open,
  onOpenChange,
}: TransactionDetailDialogProps) {
  const {
    data: transaction,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTransactionDetailQuery({
    transactionId,
    enabled: open,
  });

  const showLoading = isLoading || isFetching;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[560px] max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-[16px] border-none p-0 shadow-xl"
      >
        <DialogTitle className="sr-only">Transaction details</DialogTitle>

        <div className="border-b border-[rgba(52,52,52,0.08)] bg-white px-8 pb-5 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[24px] font-bold leading-[30px] tracking-[-0.018em] text-[#1C1C1C]">
                Transaction Details
              </p>
              <p className="mt-1 text-[14px] leading-5 text-[rgba(24,24,24,0.6)]">
                Review your billing transaction
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F8F8] transition hover:bg-[#EFEFEF]"
              aria-label="Close transaction details dialog"
            >
              <X className="h-5 w-5 text-[#181818]" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="min-w-0 max-h-[70vh] overflow-y-auto overflow-x-hidden px-8 pb-8 pt-6">
          {showLoading ? (
            <DetailSkeleton />
          ) : isError ? (
            <div className="rounded-[12px] bg-[#F8F8F8] px-4 py-8 text-center">
              <p className="text-[15px] text-[rgba(24,24,24,0.8)]">
                Unable to load transaction details. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          ) : transaction ? (
            <div className="min-w-0 space-y-5">
              <section className=" flex justify-between items-center min-w-0 overflow-hidden rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 py-4">
               

                <div>

                <h3 className="mt-0 break-words text-[20px] font-[600] leading-[26px] text-[#1C1C1C]">
                  {transaction.description}
                </h3>

                <p className="mt-2 text-[24px] font-[700] leading-8 text-[#005864]">
                  {formatTransactionAmount(
                    transaction.amount,
                    transaction.currency,
                  )}
                </p>
                </div>
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex min-w-0 items-center gap-2 text-[14px] leading-5 text-[#1C1C1C]">
                  </div>
                  <TransactionStatusBadge
                    status={transaction.status}
                    label={transaction.statusLabel}
                  />
                </div>
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MetaCard
                  icon={
                    <CalendarDays
                      className="h-4 w-4 text-[#005864]"
                      strokeWidth={2.2}
                    />
                  }
                  label="Date"
                  value={transaction.date || "-"}
                />
                <MetaCard
                  icon={
                    <Receipt
                      className="h-4 w-4 text-[#005864]"
                      strokeWidth={2.2}
                    />
                  }
                  label="Type"
                  value={formatTransactionLabel(transaction.transactionType)}
                />
                <MetaCard
                  icon={
                    <Tag className="h-4 w-4 text-[#005864]" strokeWidth={2.2} />
                  }
                  label="Purpose"
                  value={formatTransactionLabel(transaction.purpose)}
                />
                <MetaCard
                  icon={
                    <CreditCard
                      className="h-4 w-4 text-[#005864]"
                      strokeWidth={2.2}
                    />
                  }
                  label="Payment Method"
                  value={formatTransactionLabel(transaction.paymentMethodType)}
                />
              </section>

              <section className="rounded-[12px] bg-[#F8F8F8] px-4 py-4">
                <p className="text-[16px] font-[500] leading-5 text-[#1C1C1C]">
                  Amount Breakdown
                </p>
                <div className="mt-3 space-y-2 text-[15px] leading-5 text-[rgba(24,24,24,0.85)]">
                  <div className="flex items-center justify-between gap-3">
                    <span>Amount</span>
                    <span className="font-[500] text-[#1C1C1C]">
                      {formatTransactionAmount(
                        transaction.amount,
                        transaction.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Platform Fee</span>
                    <span className="font-[500] text-[#1C1C1C]">
                      {formatTransactionAmount(
                        transaction.platformFee,
                        transaction.currency,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Payment Fee</span>
                    <span className="font-[500] text-[#1C1C1C]">
                      {formatTransactionAmount(
                        transaction.paymentFee,
                        transaction.currency,
                      )}
                    </span>
                  </div>
                  {transaction.netAmount != null ? (
                    <div className="flex items-center justify-between gap-3 border-t border-[rgba(24,24,24,0.08)] pt-2">
                      <span className="font-[600] text-[#1C1C1C]">
                        Net Amount
                      </span>
                      <span className="font-[600] text-[#005864]">
                        {formatTransactionAmount(
                          transaction.netAmount,
                          transaction.currency,
                        )}
                      </span>
                    </div>
                  ) : null}
                </div>
              </section>

              {transaction.plan ? (
                <section className="rounded-[12px] border border-[rgba(0,88,100,0.12)] px-4 py-4">
                  <p className="text-[16px] font-[500] leading-5 text-[#1C1C1C]">
                    Plan
                  </p>
                  <div className="mt-3 space-y-2 text-[15px] leading-5 text-[rgba(24,24,24,0.85)]">
                    <div className="flex items-center justify-between gap-3">
                      <span>Name</span>
                      <span className="break-words text-right font-[500] text-[#1C1C1C]">
                        {transaction.plan.name || "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Type</span>
                      <span className="font-[500] text-[#1C1C1C]">
                        {formatTransactionLabel(transaction.plan.type)}
                      </span>
                    </div>
                    {transaction.plan.interval ? (
                      <div className="flex items-center justify-between gap-3">
                        <span>Interval</span>
                        <span className="font-[500] text-[#1C1C1C]">
                          {formatTransactionLabel(transaction.plan.interval)}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-3">
                      <span>Plan Amount</span>
                      <span className="font-[500] text-[#005864]">
                        {formatTransactionAmount(
                          transaction.plan.amount,
                          transaction.currency,
                        )}
                      </span>
                    </div>
                  </div>
                </section>
              ) : null}

              {transaction.errorMessage ? (
                <section className="rounded-[12px] bg-[#FFF1F1] px-4 py-4">
                  <p className="text-[16px] font-[500] leading-5 text-[#F01A1A]">
                    Error Message
                  </p>
                  <p className="mt-2 break-words text-[15px] leading-5 text-[rgba(24,24,24,0.85)]">
                    {transaction.errorMessage}
                  </p>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
