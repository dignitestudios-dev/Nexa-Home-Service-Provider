"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className = "mt-10 flex justify-end",
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex h-12 w-[161px] items-center justify-between rounded-[24px] bg-[#F8F8F8] px-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            page === 1
              ? "cursor-not-allowed bg-[rgba(0,88,100,0.06)] opacity-40"
              : "cursor-pointer bg-[#095E62] hover:opacity-90"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft
            className={`h-5 w-5 ${page === 1 ? "text-[#005864]" : "text-white"}`}
            strokeWidth={2.5}
          />
        </button>

        <span className="min-w-[2ch] text-center text-[16px] font-semibold leading-5 text-[#005864]">
          {String(page).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            page === totalPages
              ? "cursor-not-allowed bg-[rgba(0,88,100,0.06)] opacity-40"
              : "cursor-pointer bg-[#095E62] hover:opacity-90"
          }`}
          aria-label="Next page"
        >
          <ChevronRight
            className={`h-5 w-5 ${page === totalPages ? "text-[#005864]" : "text-white"}`}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}
