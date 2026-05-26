"use client";

import MainAppShell from "@/components/layout/main-app-shell";
import AvailableJobsSkeleton from "@/app/home/_components/available-jobs-skeleton";
import {
  useMyApplicationsQuery,
  type MyApplicationsTab,
} from "@/hooks/jobs/use-my-applications-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { JobCard } from "./_components/job-card";

type TabType = "applied" | "one-time" | "completed";

const TABS: { id: TabType; label: string }[] = [
  { id: "applied", label: "Applied Jobs" },
  { id: "one-time", label: "Ongoing Jobs" },
  { id: "completed", label: "Completed Jobs" },
];

const TAB_API_MAP: Record<TabType, MyApplicationsTab> = {
  applied: "applied",
  "one-time": "confirmed",
  completed: "completed",
};

const JOBS_PER_PAGE = 10;

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`my-jobs-tab ${active ? "my-jobs-tab--active" : "my-jobs-tab--inactive"}`}
    >
      <span className="my-jobs-tab__label">{label}</span>
    </button>
  );
}

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("applied");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useMyApplicationsQuery({
    tab: TAB_API_MAP[activeTab],
    page,
    limit: JOBS_PER_PAGE,
  });

  const jobs = data?.jobs ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <MainAppShell>
      <div className="mx-auto w-full max-w-[1420px]">
        <h1 className="text-[32px] font-semibold capitalize leading-[40px] text-black">
          Jobs
        </h1>

        <div className="mt-6 flex h-[46px] w-[509px] max-w-full items-center gap-0 bg-[#F8F8F8] p-1 rounded-[6px]">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            />
          ))}
        </div>

        {isLoading ? (
          <AvailableJobsSkeleton count={JOBS_PER_PAGE} />
        ) : jobs.length > 0 ? (
          <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showApplicationStatus={activeTab === "applied"}
              />
            ))}
          </section>
        ) : (
          <div className="mt-4 flex min-h-[300px] items-center justify-center py-8">
            <Image
              src="/asset/jobsnotfound.png"
              alt="No jobs found"
              width={600}
              height={600}
              className="h-auto max-h-[440px] w-auto max-w-full object-contain"
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

              <span className="text-[16px] font-medium leading-5 text-black">
                {String(page).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
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
      </div>
    </MainAppShell>
  );
}
