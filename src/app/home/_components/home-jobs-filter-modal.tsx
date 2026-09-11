"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetCategories } from "@/lib/category-query";
import { toast } from "@/lib/toast";
import {
  DEFAULT_JOB_FILTERS,
  MAX_FILTER_CATEGORIES,
  MAX_FILTER_DISTANCE_MILES,
  MIN_FILTER_DISTANCE_MILES,
  type JobFilters,
  type JobTypeFilter,
} from "@/types/job-filters.types";

type HomeJobsFilterModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appliedFilters: JobFilters;
  onApply: (filters: JobFilters) => void;
};

const JOB_TYPE_OPTIONS: { value: JobTypeFilter; label: string }[] = [
  { value: null, label: "All Job Types" },
  { value: "one-time", label: "One Time Job" },
  { value: "recurring", label: "Recurring Job" },
];

function getMileUnit(count: number): string {
  return count === 1 ? "mile" : "miles";
}

export default function HomeJobsFilterModal({
  open,
  onOpenChange,
  appliedFilters,
  onApply,
}: HomeJobsFilterModalProps) {
  const [draftFilters, setDraftFilters] = useState<JobFilters>(appliedFilters);
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategories(1, 100);
  const categories = categoriesResponse?.data ?? [];

  useEffect(() => {
    if (open) {
      setDraftFilters(appliedFilters);
    }
  }, [open, appliedFilters]);

  const toggleCategory = (categoryId: string) => {
    setDraftFilters((current) => {
      const isSelected = current.categoryIds.includes(categoryId);

      if (isSelected) {
        return {
          ...current,
          categoryIds: current.categoryIds.filter((id) => id !== categoryId),
        };
      }

      if (current.categoryIds.length >= MAX_FILTER_CATEGORIES) {
        toast.error(`You can select up to ${MAX_FILTER_CATEGORIES} categories.`);
        return current;
      }

      return {
        ...current,
        categoryIds: [...current.categoryIds, categoryId],
      };
    });
  };

  const handleCancel = () => {
    setDraftFilters(appliedFilters);
    onOpenChange(false);
  };

  const handleApply = () => {
    onApply(draftFilters);
    onOpenChange(false);
  };

  const handleResetAll = () => {
    setDraftFilters({
      ...DEFAULT_JOB_FILTERS,
      categoryIds: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-0 right-0 left-auto flex h-full w-full sm:w-[420px] max-w-full translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-none bg-white p-0 shadow-2xl data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right"
      >
        <DialogTitle className="sr-only">Filters</DialogTitle>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="text-[20px] font-semibold text-[#1C1C1C]">
            Filters
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-black/60 transition hover:bg-black/5 hover:text-black cursor-pointer"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Job Type Section */}
          <section>
            <h3 className="text-[15px] font-semibold capitalize text-[#1C1C1C]">
              Job Type
            </h3>

            <div className="mt-2.5 flex flex-col gap-2">
              {JOB_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value ?? "all"}
                  className="flex cursor-pointer items-center gap-3 py-0.5 text-[14px] text-[#1C1C1C] hover:text-[#005864] transition-colors"
                >
                  <input
                    type="radio"
                    name="job-type-filter"
                    checked={draftFilters.jobType === option.value}
                    onChange={() =>
                      setDraftFilters((current) => ({
                        ...current,
                        jobType: option.value,
                      }))
                    }
                    className="h-4 w-4 cursor-pointer accent-[#005864]"
                  />
                  <span className="font-medium text-[#1C1C1C]/90">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Category Section */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold capitalize text-[#1C1C1C]">
                Category
              </h3>
              {draftFilters.categoryIds.length > 0 ? (
                <span className="text-[12px] font-medium text-[#005864]">
                  {draftFilters.categoryIds.length}/{MAX_FILTER_CATEGORIES} selected
                </span>
              ) : null}
            </div>

            <p className="mt-1 text-[12.5px] leading-4 text-black/60">
              Select 1 to {MAX_FILTER_CATEGORIES} categories.
            </p>

            <div className="mt-2.5 max-h-[170px] space-y-1.5 overflow-y-auto rounded-[10px] border border-black/8 bg-[#FBFBFA] p-3 pr-2">
              {categoriesLoading ? (
                <p className="py-2 text-center text-[13px] text-black/50">
                  Loading categories...
                </p>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-center gap-2.5 py-1 text-[13.5px] text-[#1C1C1C] hover:text-[#005864] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={draftFilters.categoryIds.includes(category._id)}
                      onChange={() => toggleCategory(category._id)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#005864]"
                    />
                    <span className="font-medium">{category.name}</span>
                  </label>
                ))
              ) : (
                <p className="py-2 text-center text-[13px] text-black/50">
                  No categories available.
                </p>
              )}
            </div>
          </section>

          {/* Distance Section */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold capitalize text-[#1C1C1C]">
                Distance
              </h3>
              <span className="rounded-full bg-[#005864]/10 px-2.5 py-0.5 text-[12px] font-semibold text-[#005864]">
                {draftFilters.distanceMiles} {getMileUnit(draftFilters.distanceMiles)}
              </span>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={MIN_FILTER_DISTANCE_MILES}
                max={MAX_FILTER_DISTANCE_MILES}
                value={draftFilters.distanceMiles}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    distanceMiles: Number(event.target.value),
                  }))
                }
                className="h-[5px] w-full cursor-pointer appearance-none rounded-full bg-[rgba(0,88,100,0.2)] accent-[#005864]"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[12.5px] font-medium text-black/60">
              <span>
                {String(MIN_FILTER_DISTANCE_MILES).padStart(2, "0")}{" "}
                {getMileUnit(MIN_FILTER_DISTANCE_MILES)}
              </span>
              <span>
                {MAX_FILTER_DISTANCE_MILES} {getMileUnit(MAX_FILTER_DISTANCE_MILES)}
              </span>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-black/5 bg-[#F9FAFA] px-6 py-4">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetAll}
              className="text-[13px] font-semibold text-[#005864] transition hover:text-[#004851] hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="h-10 flex-1 cursor-pointer rounded-[10px] border border-black/10 bg-white text-[14px] font-semibold text-[#1C1C1C] transition hover:bg-black/[0.02]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-10 flex-1 cursor-pointer rounded-[10px] bg-[#005864] text-[14px] font-semibold text-white transition hover:bg-[#004851]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
