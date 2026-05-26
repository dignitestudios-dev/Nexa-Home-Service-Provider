"use client";

import { useParams, useRouter } from "next/navigation";

import JobDetailSkeleton from "@/components/jobs/job-detail-skeleton";
import JobDetailView from "@/components/jobs/job-detail-view";
import MainAppShell from "@/components/layout/main-app-shell";
import { useJobDetailQuery } from "@/hooks/jobs/use-job-detail-query";

export default function MyJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = String(params.id ?? "");
  const { data: job, isLoading, isError } = useJobDetailQuery(jobId);

  return (
    <MainAppShell>
      {isLoading ? (
        <JobDetailSkeleton />
      ) : !job || isError ? (
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center py-20">
          <h1 className="text-[24px] font-semibold text-[#1C1C1C]">Job not found</h1>
          <button
            type="button"
            onClick={() => router.push("/my-jobs")}
            className="mt-4 cursor-pointer text-[16px] font-medium text-[#005864]"
          >
            Back to Jobs
          </button>
        </div>
      ) : (
        <JobDetailView job={job} backHref="/my-jobs" showPurchaseButton={false} />
      )}
    </MainAppShell>
  );
}
