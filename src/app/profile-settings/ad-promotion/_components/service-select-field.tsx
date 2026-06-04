"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { useGetCategories } from "@/lib/category-query";

type ServiceSelectFieldProps = {
  selectedServiceIds: string[];
  onChange: (serviceIds: string[]) => void;
};

export default function ServiceSelectField({
  selectedServiceIds,
  onChange,
}: ServiceSelectFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: categoriesResponse, isLoading } = useGetCategories(1, 100);

  const categories = categoriesResponse?.data ?? [];

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categories, search]);

  const selectedLabel =
    selectedServiceIds.length === 0
      ? "Select Service"
      : categories.find((category) => category._id === selectedServiceIds[0])
          ?.name ?? "Select Service";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectService = (serviceId: string) => {
    onChange(selectedServiceIds[0] === serviceId ? [] : [serviceId]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <p className="text-[16px] font-[500] leading-[22px] tracking-[-0.408px] text-black">
        Select Service
      </p>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="mt-[7px] flex h-12 w-full items-center justify-between rounded-[12px] bg-white px-4 text-left"
      >
        <span
          className={`truncate text-[16px] leading-[22px] tracking-[-0.408px] ${
            selectedServiceIds.length
              ? "font-[300] text-[#1C1C1C]"
              : "font-[300] text-[rgba(24,24,24,0.6)]"
          }`}
        >
          {selectedLabel}
        </span>
        <ChevronDown
          className={`h-3 w-5 shrink-0 text-[rgba(24,24,24,0.8)] transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[6em] z-20 max-h-[294px] overflow-hidden rounded-[12px] bg-[#F9FAFA] p-4 shadow-lg">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ADADAD]" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search here"
              className="h-12 rounded-[24px] border-0 bg-[#E6E6E6] pl-10 text-[16px] shadow-none placeholder:text-[rgba(24,24,24,0.6)] focus-visible:ring-0"
            />
          </div>

          <div className="mt-3 max-h-[190px] space-y-3 overflow-y-auto pr-1">
            {isLoading ? (
              <p className="text-[14px] text-[rgba(24,24,24,0.6)]">Loading...</p>
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const isSelected = selectedServiceIds[0] === category._id;

                return (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-center gap-2 text-[16px] leading-[22px] tracking-[-0.408px] text-[#1C1C1C]"
                  >
                    <input
                      type="radio"
                      name="ad-promotion-service"
                      checked={isSelected}
                      onChange={() => selectService(category._id)}
                      className="h-5 w-5 border border-[rgba(24,24,24,0.8)] accent-[#005864]"
                    />
                    {category.name}
                  </label>
                );
              })
            ) : (
              <p className="text-[14px] text-[rgba(24,24,24,0.6)]">
                No services found.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
