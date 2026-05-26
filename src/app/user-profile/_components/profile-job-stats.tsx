"use client";

import { useProviderDashboardQuery } from "@/hooks/wallet/use-provider-dashboard-query";

const PROFILE_JOB_STATS = [
  { key: "totalCompletedJobs" as const, label: "Completed Jobs" },
  { key: "ongoingJobs" as const, label: "Ongoing Jobs" },
];

function ProfileJobStatSkeleton() {
  return (
    <div className="flex min-w-[140px] animate-pulse flex-col items-center justify-center px-6 py-4">
      <div className="h-7 w-10 rounded-md bg-[#E8E8E8]" />
      <div className="mt-2 h-5 w-24 rounded-md bg-[#E8E8E8]" />
    </div>
  );
}

export default function ProfileJobStats() {
  const { data, isLoading } = useProviderDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex gap-4 px-4">
        <ProfileJobStatSkeleton />
        <ProfileJobStatSkeleton />
      </div>
    );
  }

  return (
    <div className="flex gap-4 px-4">
      {PROFILE_JOB_STATS.map((stat) => (
        <div
          key={stat.key}
          className="flex min-w-[140px] flex-col items-center justify-center px-6 py-4"
        >
          <span className="text-[24px] font-bold leading-[30px] text-[#005864]">
            {(data?.[stat.key] ?? 0).toLocaleString("en-US")}
          </span>
          <span className="text-[16px] font-normal leading-[20px] text-[rgba(24,24,24,0.8)]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
