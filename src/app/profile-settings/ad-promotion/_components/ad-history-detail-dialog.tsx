"use client";

import {
  CalendarDays,
  CircleDot,
  Crosshair,
  ExternalLink,
  MapPin,
  Package,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdHistoryItem } from "@/types/advertisement.types";

type AdHistoryDetailDialogProps = {
  item: AdHistoryItem | null;
  index?: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-[rgba(0,88,100,0.08)] bg-[#FAFAFA] px-3.5 py-3">
      <div className="flex items-center gap-2 text-[rgba(24,24,24,0.55)]">
        {icon}
        <span className="text-[12px] font-[500] leading-4">{label}</span>
      </div>
      <div className="mt-1.5 text-[14px] font-[500] leading-5 text-[#1C1C1C]">
        {value}
      </div>
    </div>
  );
}

function formatAdStatusLabel(status: string): string {
  if (!status.trim()) return "-";

  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getAdStatusStyles(status: string): string {
  const normalized = status.trim().toLowerCase();

  if (normalized === "active") {
    return "bg-[#E8F7EF] text-[#0F7A45]";
  }

  if (
    normalized === "inactive" ||
    normalized === "expired" ||
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "canceled"
  ) {
    return "bg-[#FFF1F1] text-[#F01A1A]";
  }

  if (normalized === "pending" || normalized === "processing") {
    return "bg-[#FFF8E8] text-[#B8860B]";
  }

  return "bg-[rgba(0,88,100,0.08)] text-[rgba(24,24,24,0.75)]";
}

export default function AdHistoryDetailDialog({
  item,
  index,
  open,
  onOpenChange,
}: AdHistoryDetailDialogProps) {
  if (!item) return null;

  const isVideo = item.mediaType === "video";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[900px] max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[20px] border-none p-0 shadow-xl sm:max-w-[900px]"
      >
        <DialogTitle className="sr-only">Ad details</DialogTitle>

        <div className="flex items-center justify-between border-b border-[rgba(52,52,52,0.08)] bg-white px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {index ? (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[rgba(0,88,100,0.08)] px-3 py-1 text-[12px] font-[600] uppercase tracking-[0.04em] text-[#005864]">
              
                Ad #{index}
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="truncate text-[22px] font-bold leading-7 tracking-[-0.018em] text-[#1C1C1C]">
                Ad Details
              </p>
              <p className="truncate text-[13px] leading-5 text-[rgba(24,24,24,0.6)]">
                {item.serviceName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F8F8] transition hover:bg-[#EFEFEF]"
            aria-label="Close ad details dialog"
          >
            <X className="h-5 w-5 text-[#181818]" strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex max-h-[min(520px,78vh)] flex-col md:flex-row md:items-stretch">
          <div className="flex w-full shrink-0 flex-col bg-[rgba(0,88,100,0.04)] p-4 md:w-[42%] md:min-h-0 md:p-5">
            <div
              className={`relative w-full overflow-hidden rounded-[12px] border border-[rgba(0,88,100,0.12)] bg-black shadow-sm ${
                isVideo
                  ? "flex min-h-[240px] flex-1 items-center justify-center md:min-h-0"
                  : "aspect-[4/5]"
              }`}
            >
              {item.mediaUrl ? (
                isVideo ? (
                  <video
                    src={item.mediaUrl}
                    className="h-full max-h-[min(420px,70vh)] w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={item.mediaUrl}
                    alt="Advertisement media"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )
              ) : (
                <div className="flex h-full min-h-[220px] w-full items-center justify-center text-[rgba(24,24,24,0.5)]">
                  No media
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon={
                  <CalendarDays
                    className="h-3.5 w-3.5 text-[#005864]"
                    strokeWidth={2.2}
                  />
                }
                label="Created at"
                value={item.createdAt || "-"}
              />
              <InfoCard
                icon={
                  <CircleDot
                    className="h-3.5 w-3.5 text-[#005864]"
                    strokeWidth={2.2}
                  />
                }
                label="Status"
                value={
                  item.status ? (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-[600] ${getAdStatusStyles(item.status)}`}
                    >
                      {formatAdStatusLabel(item.status)}
                    </span>
                  ) : (
                    "-"
                  )
                }
              />
              <InfoCard
                icon={
                  <Package
                    className="h-3.5 w-3.5 text-[#005864]"
                    strokeWidth={2.2}
                  />
                }
                label="Package"
                value={
                  <span className="inline-flex rounded-full bg-[rgba(0,88,100,0.1)] px-2.5 py-0.5 text-[12px] font-[600] text-[#005864]">
                    {item.packageName || "-"}
                  </span>
                }
              />
              <InfoCard
                icon={
                  <MapPin
                    className="h-3.5 w-3.5 text-[#005864]"
                    strokeWidth={2.2}
                  />
                }
                label="Target Location"
                value={item.targetLocation || "-"}
              />
              <InfoCard
                icon={
                  <Wrench
                    className="h-3.5 w-3.5 text-[#005864]"
                    strokeWidth={2.2}
                  />
                }
                label="Service"
                value={item.serviceName || "-"}
              />
              <InfoCard
                icon={
                  <Crosshair
                    className="h-3.5 w-3.5 text-[#005864]"
                    strokeWidth={2.2}
                  />
                }
                label="Target Radius"
                value={
                  item.targetRadiusMiles != null
                    ? `${item.targetRadiusMiles} miles`
                    : "-"
                }
              />
            </div>

            <div className="mt-3 rounded-[12px] border border-[rgba(0,88,100,0.08)] bg-[#FAFAFA] px-3.5 py-3">
              <div className="flex items-center gap-2 text-[rgba(24,24,24,0.55)]">
                <ExternalLink
                  className="h-3.5 w-3.5 text-[#005864]"
                  strokeWidth={2.2}
                />
                <span className="text-[12px] font-[500] leading-4">Link</span>
              </div>

              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-[rgba(0,88,100,0.18)] bg-white text-[14px] font-[600] text-[#005864] transition hover:bg-[rgba(0,88,100,0.04)]"
                >
                  View Link
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <p className="mt-1.5 text-[14px] font-[500] text-[#1C1C1C]">-</p>
              )}
            </div>
            </div>

            <div className="shrink-0 border-t border-[rgba(52,52,52,0.08)] px-6 py-4">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-[600] leading-5 text-white hover:bg-[#004d57]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
