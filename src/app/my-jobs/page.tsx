"use client";

import MainAppShell from "@/components/layout/main-app-shell";
import PaginationControls from "@/components/ui/pagination-controls";
import AvailableJobsSkeleton from "@/app/home/_components/available-jobs-skeleton";
import {
  useMyApplicationsQuery,
  type MyApplicationsTab,
} from "@/hooks/jobs/use-my-applications-query";
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

const JOBS_PER_PAGE = 9;

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

        {!isLoading ? (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </MainAppShell>
  );
}
