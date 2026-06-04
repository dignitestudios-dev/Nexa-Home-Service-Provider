"use client";

import type { AdHistoryFilter } from "@/types/advertisement.types";

const FILTERS: { id: AdHistoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

type AdHistoryFilterPillsProps = {
  activeFilter: AdHistoryFilter;
  onFilterChange: (filter: AdHistoryFilter) => void;
};

export default function AdHistoryFilterPills({
  activeFilter,
  onFilterChange,
}: AdHistoryFilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={`flex h-10 min-w-[56px] items-center justify-center rounded-full px-4 text-[16px] leading-5 transition ${
              isActive
                ? "bg-[#005864] font-[500] text-white shadow-[0_4px_14px_rgba(0,88,100,0.18)]"
                : "bg-[rgba(0,88,100,0.06)] font-[400] text-black hover:bg-[rgba(0,88,100,0.1)]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
