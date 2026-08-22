"use client";

import { Suspense, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import JobDetailSkeleton from "@/components/jobs/job-detail-skeleton";
import JobDetailView from "@/components/jobs/job-detail-view";
import MainAppShell from "@/components/layout/main-app-shell";
import { useJobDetailQuery } from "@/hooks/jobs/use-job-detail-query";
import { sanitizeHomeReturnTo } from "@/lib/home-job-filters-url";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

function JobDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = String(params.id ?? "");
  const backHref = useMemo(
    () => sanitizeHomeReturnTo(searchParams.get("returnTo")),
    [searchParams],
  );
  
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const { data: job, isLoading, isError } = useJobDetailQuery(jobId);

  return (
    <MainAppShell>
      {isLoading ? (
        <JobDetailSkeleton />
      ) : !isAuthenticated ? (
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center py-20">
          <h1 className="text-[24px] font-semibold text-[#1C1C1C]">Please login again</h1>
          <p className="mt-2 text-[#666666]">You must be logged in to view this job.</p>
          <button
            type="button"
            onClick={() => router.push(`/auth/login?redirect=/jobs/${jobId}`)}
            className="mt-4 cursor-pointer text-[16px] font-medium text-[#005864]"
          >
            Back to login
          </button>
        </div>
      ) : !job || isError ? (
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center py-20">
          <h1 className="text-[24px] font-semibold text-[#1C1C1C]">Job not found</h1>
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="mt-4 cursor-pointer text-[16px] font-medium text-[#005864]"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <JobDetailView job={job} backHref={backHref} />
      )}
    </MainAppShell>
  );
}

export default function JobDetailPage() {
  return (
    <Suspense fallback={<JobDetailSkeleton />}>
      <JobDetailPageContent />
    </Suspense>
  );
}
