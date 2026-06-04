"use client";

import { Search } from "lucide-react";
import Image from "next/image";

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
          placeholder="Search title, description or category"
          className="w-full bg-transparent text-[14px] text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C]"
          aria-label="Search jobs"
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="flex h-11 w-11 shrink-0 items-center justify-center cursor-pointer"
        aria-label="Open filters"
      >
        <Image
          src="/asset/filter.svg"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12"
          aria-hidden
        />
      </button>
    </div>
  );
}
