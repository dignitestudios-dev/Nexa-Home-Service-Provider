"use client";

import { CalendarDays, Eye, Play } from "lucide-react";
import Image from "next/image";

import type { AdHistoryItem } from "@/types/advertisement.types";

const TABLE_GRID =
  "grid grid-cols-[34px_102px_63px_126px_95px_72px_60px_40px] items-center gap-[38px]";

type AdHistoryTableHeaderProps = {
  className?: string;
};

export function AdHistoryTableHeader({ className = "" }: AdHistoryTableHeaderProps) {
  return (
    <div
      className={`${TABLE_GRID} h-[50px] rounded-[39px] bg-[rgba(0,88,100,0.06)] px-5 text-[14px] font-[500] leading-[18px] text-black ${className}`}
    >
      <span>No.</span>
      <span>Date</span>
      <span>Ad Type</span>
      <span>Target Location</span>
      <span>Service</span>
      <span>Link</span>
      <span>Package</span>
      <span className="sr-only">View</span>
    </div>
  );
}

type AdHistoryRowProps = {
  index: number;
  item: AdHistoryItem;
  onViewDetail: (item: AdHistoryItem) => void;
};

export function AdHistoryRow({ index, item, onViewDetail }: AdHistoryRowProps) {
  const isVideo = item.mediaType === "video";

  return (
    <div
      className={`${TABLE_GRID} group px-5 py-3 text-[16px] font-[400] leading-5 text-black transition hover:bg-[rgba(0,88,100,0.03)]`}
    >
      <span className="font-[500] text-[rgba(24,24,24,0.85)]">{index}</span>
      <span className="text-[rgba(24,24,24,0.9)]">{item.createdAt || "-"}</span>

      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[8px] bg-[#888888] ring-1 ring-black/5">
        {item.mediaUrl ? (
          isVideo ? (
            <video
              src={item.mediaUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={item.mediaUrl}
              alt="Advertisement media"
              fill
              className="object-cover transition duration-200 group-hover:scale-105"
              unoptimized
            />
          )
        ) : null}

        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,88,100,0.4)] backdrop-blur-[2px]">
            <Play className="h-[7px] w-[7px] fill-white text-white" />
          </div>
        ) : null}
      </div>

      <span className="truncate text-[rgba(24,24,24,0.9)]">
        {item.targetLocation}
      </span>
      <span className="truncate font-[500] text-[#1C1C1C]">
        {item.serviceName}
      </span>

      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="truncate text-[#005864] underline-offset-2 hover:underline"
        >
          View Link
        </a>
      ) : (
        <span className="text-[rgba(24,24,24,0.45)]">-</span>
      )}

      <span className="inline-flex max-w-full">
        <span className="truncate rounded-full bg-[rgba(0,88,100,0.08)] px-2.5 py-1 text-[13px] font-[600] text-[#005864]">
          {item.packageName}
        </span>
      </span>

      <button
        type="button"
        onClick={() => onViewDetail(item)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white text-[#005864] shadow-sm transition group-hover:border-[rgba(0,88,100,0.12)] group-hover:bg-[rgba(0,88,100,0.08)]"
        aria-label={`View details for ${item.serviceName}`}
      >
        <Eye className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

type AdHistoryCalendarButtonProps = {
  onClick?: () => void;
};

export function AdHistoryCalendarButton({
  onClick,
}: AdHistoryCalendarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#005864] shadow-[0px_4px_45.9px_6px_rgba(0,88,100,0.08)] transition hover:opacity-90"
      aria-label="Filter by date"
    >
      <CalendarDays className="h-6 w-6 text-white" strokeWidth={1.8} />
    </button>
  );
}

export function AdHistoryRowSkeleton() {
  return (
    <div className={`${TABLE_GRID} px-5 py-3`}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse rounded bg-[#E8E8E8] ${
            index === 2 ? "h-10 w-10" : index === 7 ? "h-9 w-9 rounded-full" : "h-5 w-full"
          }`}
        />
      ))}
    </div>
  );
}
