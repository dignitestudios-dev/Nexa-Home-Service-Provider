"use client";

import { useProviderDashboardQuery } from "@/hooks/wallet/use-provider-dashboard-query";

import HomeStatsSkeleton from "./home-stats-skeleton";

const STAT_LABELS = [
  { key: "totalLeadPurchased" as const, label: "Total Jobs Purchased" },
  { key: "totalHired" as const, label: "Hired" },
  { key: "availableCredits" as const, label: "Available Credits" },
];

function normalizeStatNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value;
}

function formatStatValue(value: number): string {
  const normalized = normalizeStatNumber(value);
  const abs = Math.abs(normalized);

  if (abs >= 1_000_000_000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(normalized);
  }

  if (abs >= 1_000_000) {
    return Math.round(normalized).toLocaleString("en-US");
  }

  if (Number.isInteger(normalized) || abs >= 1_000) {
    return Math.round(normalized).toLocaleString("en-US");
  }

  return normalized.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function getStatValueFontClass(formatted: string): string {
  const length = formatted.length;

  if (length > 14) return "text-[18px] leading-[22px]";
  if (length > 10) return "text-[24px] leading-[30px]";
  if (length > 7) return "text-[30px] leading-[38px]";
  return "text-[36px] leading-[45px]";
}

export default function HomeStats() {
  const { data, isLoading } = useProviderDashboardQuery();

  if (isLoading) {
    return <HomeStatsSkeleton />;
  }

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {STAT_LABELS.map((item) => {
        const formattedValue = formatStatValue(data?.[item.key] ?? 0);

        return (
        <div
          key={item.key}
          className="relative h-[118px] w-[206px] overflow-hidden rounded-[12px] bg-[#005864] p-5"
        >
          <div className="absolute -left-2 top-10 h-[117px] w-[117px] rounded-full bg-[#D7DF23] blur-[80px]" />
          <div className="relative min-w-0">
            <p
              className={`truncate font-[700] tabular-nums text-white ${getStatValueFontClass(formattedValue)}`}
              title={formattedValue}
            >
              {formattedValue}
            </p>
            <p className="truncate text-[16px] leading-6 text-white">{item.label}</p>
          </div>
        </div>
        );
      })}
    </div>
  );
}
