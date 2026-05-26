"use client";

import { useEffect, useState } from "react";

import MainAppShell from "@/components/layout/main-app-shell";
import { DEFAULT_JOB_FILTERS, type JobFilters } from "@/types/job-filters.types";

import AvailableJobs from "./_components/available-jobs";
import HomeJobsFilterModal from "./_components/home-jobs-filter-modal";
import HomeSearchBar from "./_components/home-search-bar";
import HomeStats from "./_components/home-stats";
import HomeWelcomeHeading from "./_components/home-welcome-heading";

const SEARCH_DEBOUNCE_MS = 400;

export default function ServiceProviderHomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] =
    useState<JobFilters>(DEFAULT_JOB_FILTERS);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const submitSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  return (
    <MainAppShell>
      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <HomeWelcomeHeading />

        <HomeSearchBar
          searchQuery={searchInput}
          onSearchQueryChange={setSearchInput}
          onSearchSubmit={submitSearch}
          onFilterClick={() => setIsFilterModalOpen(true)}
        />
      </div>

      <HomeStats />

      <h2 className="mt-8 text-[24px] font-[700] leading-[30px] text-black">
        Available Jobs
      </h2>

      <AvailableJobs searchQuery={searchQuery} filters={appliedFilters} />

      <HomeJobsFilterModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        appliedFilters={appliedFilters}
        onApply={setAppliedFilters}
      />
    </MainAppShell>
  );
}
