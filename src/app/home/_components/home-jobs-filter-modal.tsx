"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetCategories } from "@/lib/category-query";
import { toast } from "@/lib/toast";
import {
  DEFAULT_JOB_FILTERS,
  MAX_FILTER_CATEGORIES,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-0 right-0 left-auto flex h-full w-[490px] max-w-full translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-none p-0 shadow-xl data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right sm:max-w-[490px]"
      >
        <DialogTitle className="sr-only">Filters</DialogTitle>

        <div className="flex items-start justify-between px-[30px] pt-14">
          <h2 className="text-[32px] font-semibold capitalize leading-10 text-[#1C1C1C]">
            Filters
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 items-center justify-center"
            aria-label="Close filters"
          >
            <X className="h-5 w-5 text-[rgba(24,24,24,0.8)]" strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[30px] pb-6">
          <section className="mt-10">
            <h3 className="text-[20px] font-semibold capitalize leading-[25px] text-[#1C1C1C]">
              Job Type
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {JOB_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value ?? "all"}
                  className="flex cursor-pointer items-center gap-3"
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
                    className="h-6 w-6 border border-[rgba(24,24,24,0.8)] accent-[#005864]"
                  />
                  <span className="text-[16px] leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-[20px] font-semibold capitalize leading-[25px] text-[#1C1C1C]">
              Category
            </h3>
            <p className="mt-2 max-w-[384px] text-[14px] leading-[18px] text-black/70">
              You can select minimum 1 category and maximum 20 categories.
            </p>

            <div className="mt-4 flex max-h-[205px] flex-col gap-5 overflow-y-auto pr-1">
              {categoriesLoading ? (
                <p className="text-[14px] text-black/60">Loading categories...</p>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={draftFilters.categoryIds.includes(category._id)}
                      onChange={() => toggleCategory(category._id)}
                      className="h-6 w-6 rounded-[4px] border border-[rgba(24,24,24,0.8)] accent-[#005864]"
                    />
                    <span className="text-[18px] leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                      {category.name}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-[14px] text-black/60">No categories available.</p>
              )}
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-[20px] font-medium capitalize leading-[25px] text-[#1C1C1C]">
              Distance
            </h3>

            <div className="relative mt-6 pb-2">
              <div
                className="absolute -top-12 -translate-x-1/2 rounded-[10px] bg-[#005864] px-3 py-2 text-center text-[14px] leading-[18px] text-white"
                style={{
                  left: `${((draftFilters.distanceMiles - 1) / 49) * 100}%`,
                }}
              >
                {draftFilters.distanceMiles} miles
              </div>

              <input
                type="range"
                min={1}
                max={50}
                value={draftFilters.distanceMiles}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    distanceMiles: Number(event.target.value),
                  }))
                }
                className="h-[6px] w-full cursor-pointer appearance-none rounded-[13.5px] bg-[rgba(0,88,100,0.36)] accent-[#005864]"
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-[16px] font-medium capitalize leading-5 text-[#1C1C1C]">
                01 miles
              </span>
              <span className="text-[16px] font-medium capitalize leading-5 text-[#1C1C1C]">
                50 miles
              </span>
            </div>
          </section>
        </div>

        <div className="rounded-t-[24px] bg-[#F8F8F8] px-[30px] py-[30px]">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="h-12 flex-1 rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[16px] font-semibold capitalize leading-5 text-[#005864]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-12 flex-1 rounded-[12px] bg-[#005864] text-[16px] font-semibold capitalize leading-5 text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
