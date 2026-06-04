"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import PaginationControls from "@/components/ui/pagination-controls";
import { useProviderFeedQuery } from "@/hooks/jobs/use-provider-feed-query";
import type { HomeJobsPageParams } from "@/lib/home-job-filters-url";
import { jobMatchesSearch } from "@/lib/parse-provider-feed";
import type { JobFilters } from "@/types/job-filters.types";

import AvailableJobsSkeleton from "./available-jobs-skeleton";
import ProviderFeedJobCard from "./provider-feed-job-card";

const JOBS_PER_PAGE = 9;
const SEARCH_FETCH_LIMIT = 100;

type AvailableJobsProps = {
  searchQuery: string;
  filters: JobFilters;
  homePageParams: HomeJobsPageParams;
};

export default function AvailableJobs({
  searchQuery,
  filters,
  homePageParams,
}: AvailableJobsProps) {
  const [page, setPage] = useState(1);
  const trimmedSearch = searchQuery.trim();
  const isSearching = trimmedSearch.length > 0;

  const { data, isLoading, isFetching } = useProviderFeedQuery({
    page: isSearching ? 1 : page,
    limit: isSearching ? SEARCH_FETCH_LIMIT : JOBS_PER_PAGE,
    filters,
  });

  const showLoading = isLoading || isFetching;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  const filteredJobs = useMemo(() => {
    const jobs = data?.jobs ?? [];
    if (!isSearching) return jobs;
    return jobs.filter((job) => jobMatchesSearch(job, trimmedSearch));
  }, [data?.jobs, isSearching, trimmedSearch]);

  const jobs = useMemo(() => {
    if (!isSearching) return filteredJobs;

    const start = (page - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, isSearching, page]);

  const totalPages = isSearching
    ? Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE))
    : (data?.pagination.totalPages ?? 1);

  return (
    <>
      {showLoading ? (
        <AvailableJobsSkeleton count={JOBS_PER_PAGE} />
      ) : jobs.length > 0 ? (
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <ProviderFeedJobCard
              key={job.id}
              job={job}
              homePageParams={homePageParams}
            />
          ))}
        </section>
      ) : (
        <div className="mt-4 flex min-h-[300px] items-center justify-center py-8">
          <Image
            src="/asset/jobsnotfound.png"
            alt="No jobs available"
            width={480}
            height={360}
            className="h-auto max-h-[320px] w-auto max-w-full object-contain"
            unoptimized
          />
        </div>
      )}

      {!showLoading ? (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </>
  );
}
