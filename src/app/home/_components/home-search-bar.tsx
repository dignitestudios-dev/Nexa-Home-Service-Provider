"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type HomeSearchBarProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onFilterClick: () => void;
};

export default function HomeSearchBar({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onFilterClick,
}: HomeSearchBarProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
      <div className="flex h-12 items-center gap-2 rounded-[24px] bg-[#F9FAFA] px-5 sm:w-[417px]">
        <Search className="h-[18px] w-[18px] text-[#005864]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSearchSubmit?.();
            }
          }}
          placeholder="Search job title or description"
          className="w-full bg-transparent text-[14px] text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C]"
          aria-label="Search jobs"
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#005864]"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-5 w-5 text-[#FBFBFB]" />
      </button>
    </div>
  );
}
