"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useProviderFeedQuery } from "@/hooks/jobs/use-provider-feed-query";
import type { JobFilters } from "@/types/job-filters.types";

import AvailableJobsSkeleton from "./available-jobs-skeleton";
import ProviderFeedJobCard from "./provider-feed-job-card";

const JOBS_PER_PAGE = 10;

type AvailableJobsProps = {
  searchQuery: string;
  filters: JobFilters;
};

export default function AvailableJobs({ searchQuery, filters }: AvailableJobsProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProviderFeedQuery({
    page,
    limit: JOBS_PER_PAGE,
    search: searchQuery,
    filters,
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  const jobs = data?.jobs ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <>
      {isLoading ? (
        <AvailableJobsSkeleton count={JOBS_PER_PAGE} />
      ) : jobs.length > 0 ? (
        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <ProviderFeedJobCard key={job.id} job={job} />
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

      {!isLoading && totalPages > 1 ? (
        <div className="mt-10 flex justify-end">
          <div className="flex h-12 w-[161px] items-center justify-between rounded-[24px] bg-[#F8F8F8] px-0">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(0,88,100,0.06)] ${
                page === 1
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:bg-[rgba(0,88,100,0.12)]"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3 w-3 text-[#005864]" strokeWidth={2.5} />
            </button>

            <span className="text-[16px] font-[500] leading-5 text-black">
              {String(page).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#005864] ${
                page === totalPages
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:opacity-90"
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="h-3 w-3 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
