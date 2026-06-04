"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import PaginationControls from "@/components/ui/pagination-controls";
import { useAdHistoryQuery } from "@/hooks/advertisement/use-ad-history-query";
import { filterAdHistoryByPackage } from "@/lib/parse-ad-history-response";
import {
  AD_HISTORY_PAGE_LIMIT,
  type AdHistoryFilter,
  type AdHistoryItem,
} from "@/types/advertisement.types";

import AdHistoryDetailDialog from "./ad-history-detail-dialog";
import AdHistoryDateFilter, {
  type AdHistoryDateRange,
} from "./ad-history-date-filter";
import AdHistoryFilterPills from "./ad-history-filter-pills";
import {
  AdHistoryRow,
  AdHistoryRowSkeleton,
  AdHistoryTableHeader,
} from "./ad-history-table";

export default function AdHistoryPanel() {
  const [activeFilter, setActiveFilter] = useState<AdHistoryFilter>("all");
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<AdHistoryDateRange>({});
  const [selectedItem, setSelectedItem] = useState<AdHistoryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    data: allItems = [],
    isLoading,
    isPending,
    isFetching,
    isFetched,
    isError,
    refetch,
  } = useAdHistoryQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const filteredItems = useMemo(
    () => filterAdHistoryByPackage(allItems, activeFilter),
    [activeFilter, allItems],
  );

  const isLoadingHistory =
    isLoading || isPending || (isFetching && !isFetched);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / AD_HISTORY_PAGE_LIMIT),
  );
  const safePage = Math.min(page, totalPages);

  const visibleItems = useMemo(
    () =>
      filteredItems.slice(
        (safePage - 1) * AD_HISTORY_PAGE_LIMIT,
        safePage * AD_HISTORY_PAGE_LIMIT,
      ),
    [filteredItems, safePage],
  );

  const rowOffset = (safePage - 1) * AD_HISTORY_PAGE_LIMIT;

  const handleFilterChange = (filter: AdHistoryFilter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleDateRangeApply = (range: AdHistoryDateRange) => {
    setDateRange(range);
    setPage(1);
  };

  const handleViewDetail = (item: AdHistoryItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
    setIsDetailOpen(true);
  };

  return (
    <div className="mt-6">
      <AdHistoryDetailDialog
        item={selectedItem}
        index={selectedIndex}
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open);
          if (!open) {
            setSelectedItem(null);
            setSelectedIndex(null);
          }
        }}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdHistoryFilterPills
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <AdHistoryDateFilter
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onApply={handleDateRangeApply}
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[814px]">
          <AdHistoryTableHeader />

          <div className="mt-4 overflow-hidden rounded-[24px] bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            {isLoadingHistory ? (
              <div className="space-y-1 py-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <AdHistoryRowSkeleton key={index} />
                ))}
              </div>
            ) : isError ? (
              <div className="px-5 py-12 text-center">
                <p className="text-[15px] text-black/70">
                  Unable to load ad history. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <Image
                  src="/asset/nofound.jpg"
                  alt="No ad history found"
                  width={280}
                  height={280}
                  className="h-auto max-h-[220px] w-auto max-w-full object-contain"
                  unoptimized
                />
                <p className="mt-2 text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
                  No ad history found.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EEEEEE]">
                {visibleItems.map((item, index) => (
                  <AdHistoryRow
                    key={item.id}
                    index={rowOffset + index + 1}
                    item={item}
                    onViewDetail={(selectedItem) =>
                      handleViewDetail(selectedItem, rowOffset + index + 1)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!isLoadingHistory && !isError ? (
        <PaginationControls
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}
