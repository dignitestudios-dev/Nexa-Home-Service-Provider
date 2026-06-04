"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type TransactionHistoryDateRange = {
  startDate?: string;
  endDate?: string;
};

type TransactionHistoryDateFilterProps = {
  startDate?: string;
  endDate?: string;
  onApply: (range: TransactionHistoryDateRange) => void;
};

export default function TransactionHistoryDateFilter({
  startDate,
  endDate,
  onApply,
}: TransactionHistoryDateFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState(startDate ?? "");
  const [draftEndDate, setDraftEndDate] = useState(endDate ?? "");

  const hasActiveFilter = Boolean(startDate && endDate);

  useEffect(() => {
    if (!isOpen) return;

    setDraftStartDate(startDate ?? "");
    setDraftEndDate(endDate ?? "");
  }, [isOpen, startDate, endDate]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const canApply = Boolean(draftStartDate && draftEndDate);
  const isInvalidRange =
    canApply && new Date(draftStartDate) > new Date(draftEndDate);

  const handleApply = () => {
    if (!canApply || isInvalidRange) return;

    onApply({
      startDate: draftStartDate,
      endDate: draftEndDate,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setDraftStartDate("");
    setDraftEndDate("");
    onApply({});
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)] transition hover:opacity-90 ${
          hasActiveFilter
            ? "bg-[#00424b] ring-2 ring-[#005864] ring-offset-2"
            : "bg-[#005864]"
        }`}
        aria-label="Filter by date range"
        aria-expanded={isOpen}
      >
        <CalendarDays className="h-6 w-6 text-white" strokeWidth={1.8} />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[min(320px,calc(100vw-2rem))] rounded-[16px] border border-[rgba(0,88,100,0.1)] bg-white p-4 shadow-[0_12px_32px_rgba(0,88,100,0.12)]">
          <p className="text-[15px] font-[600] text-[#1C1C1C]">Filter by date</p>
          <p className="mt-1 text-[13px] leading-5 text-[rgba(24,24,24,0.65)]">
            Select a start and end date to filter transactions.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label
                htmlFor="transaction-history-start-date"
                className="text-[13px] font-[500] text-[rgba(24,24,24,0.8)]"
              >
                Start date
              </label>
              <Input
                id="transaction-history-start-date"
                type="date"
                value={draftStartDate}
                onChange={(event) => setDraftStartDate(event.target.value)}
                className="mt-1.5 h-11 rounded-[10px] border border-[rgba(0,88,100,0.12)] bg-white px-3 text-[14px] shadow-none focus-visible:ring-[#005864]/20"
              />
            </div>

            <div>
              <label
                htmlFor="transaction-history-end-date"
                className="text-[13px] font-[500] text-[rgba(24,24,24,0.8)]"
              >
                End date
              </label>
              <Input
                id="transaction-history-end-date"
                type="date"
                value={draftEndDate}
                min={draftStartDate || undefined}
                onChange={(event) => setDraftEndDate(event.target.value)}
                className="mt-1.5 h-11 rounded-[10px] border border-[rgba(0,88,100,0.12)] bg-white px-3 text-[14px] shadow-none focus-visible:ring-[#005864]/20"
              />
            </div>
          </div>

          {isInvalidRange ? (
            <p className="mt-3 text-[13px] text-[#B42318]">
              Start date must be before or equal to end date.
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-2">
            <Button
              type="button"
              onClick={handleApply}
              disabled={!canApply || isInvalidRange}
              className="h-10 flex-1 rounded-[10px] bg-[#005864] text-[14px] font-[600] text-white hover:bg-[#004d57] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="h-10 rounded-[10px] border-[rgba(0,88,100,0.15)] px-4 text-[14px] font-[600] text-[#005864] hover:bg-[rgba(0,88,100,0.06)]"
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
