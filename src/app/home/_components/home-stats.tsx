"use client";

import { useProviderDashboardQuery } from "@/hooks/wallet/use-provider-dashboard-query";

import HomeStatsSkeleton from "./home-stats-skeleton";

const STAT_LABELS = [
  { key: "totalLeadPurchased" as const, label: "Total Jobs Purchased" },
  { key: "totalHired" as const, label: "Hired" },
  { key: "availableCredits" as const, label: "Available Credits" },
];

function formatStatValue(value: number): string {
  return value.toLocaleString("en-US");
}

export default function HomeStats() {
  const { data, isLoading } = useProviderDashboardQuery();

  if (isLoading) {
    return <HomeStatsSkeleton />;
  }

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {STAT_LABELS.map((item) => (
        <div
          key={item.key}
          className="relative h-[118px] w-[206px] overflow-hidden rounded-[12px] bg-[#005864] p-5"
        >
          <div className="absolute -left-2 top-10 h-[117px] w-[117px] rounded-full bg-[#D7DF23] blur-[80px]" />
          <div className="relative">
            <p className="text-[36px] font-[700] leading-[45px] text-white">
              {formatStatValue(data?.[item.key] ?? 0)}
            </p>
            <p className="text-[16px] leading-6 text-white">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
