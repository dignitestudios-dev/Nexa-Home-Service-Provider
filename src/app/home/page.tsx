"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

import MainAppShell from "@/components/layout/main-app-shell";
import { Button } from "@/components/ui/button";
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

  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        queryClient.invalidateQueries(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
      router.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <MainAppShell>
      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <HomeWelcomeHeading />

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <HomeSearchBar
            searchQuery={searchInput}
            onSearchQueryChange={setSearchInput}
            onSearchSubmit={submitSearch}
            onFilterClick={() => setIsFilterModalOpen(true)}
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[24px] border border-[#E0EBEB] bg-white px-5 text-[14px] font-semibold text-[#005864] shadow-xs hover:bg-[#F4F9F9] hover:text-[#004852] transition-all cursor-pointer disabled:opacity-60 active:scale-95"
            aria-label="Refresh dashboard"
          >
            <RefreshCw
              className={`h-4 w-4 text-[#005864] transition-transform duration-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
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
