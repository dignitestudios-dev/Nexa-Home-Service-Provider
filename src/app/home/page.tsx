"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import MainAppShell from "@/components/layout/main-app-shell";
import {
  buildHomeJobsPageHref,
  parseHomeJobsPageParams,
  type HomeJobsPageParams,
} from "@/lib/home-job-filters-url";
import { type JobFilters } from "@/types/job-filters.types";

import AvailableJobs from "./_components/available-jobs";
import HomeJobsFilterModal from "./_components/home-jobs-filter-modal";
import HomeSearchBar from "./_components/home-search-bar";
import HomeStats from "./_components/home-stats";
import HomeWelcomeHeading from "./_components/home-welcome-heading";

const SEARCH_DEBOUNCE_MS = 400;

function HomePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParams = useMemo(
    () => parseHomeJobsPageParams(searchParams),
    [searchParams],
  );

  const [searchInput, setSearchInput] = useState(pageParams.search);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    setSearchInput(pageParams.search);
  }, [pageParams.search]);

  const replaceHomeParams = useCallback(
    (next: HomeJobsPageParams) => {
      const nextHref = buildHomeJobsPageHref(next);
      const currentHref =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");

      if (nextHref === currentHref) {
        return;
      }

      router.replace(nextHref, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmedSearch = searchInput.trim();
      if (trimmedSearch === pageParams.search) return;

      replaceHomeParams({
        filters: pageParams.filters,
        search: trimmedSearch,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput, pageParams.filters, pageParams.search, replaceHomeParams]);

  const submitSearch = () => {
    replaceHomeParams({
      filters: pageParams.filters,
      search: searchInput.trim(),
    });
  };

  const applyFilters = (filters: JobFilters) => {
    replaceHomeParams({
      filters,
      search: pageParams.search,
    });
  };

  return (
    <MainAppShell>
      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
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

      <AvailableJobs
        searchQuery={pageParams.search}
        filters={pageParams.filters}
        homePageParams={pageParams}
      />

      <HomeJobsFilterModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        appliedFilters={pageParams.filters}
        onApply={applyFilters}
      />
    </MainAppShell>
  );
}

export default function ServiceProviderHomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
