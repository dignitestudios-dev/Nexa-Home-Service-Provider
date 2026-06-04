"use client";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cleanJobDescription, formatJobType } from "@/lib/parse-provider-feed";
import {
  formatContactPreferences,
  formatJobStatus,
  formatPostedDate,
} from "@/lib/parse-job-detail";
import type { JobDetail } from "@/types/job-detail.types";

type PurchaseJobModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobDetail;
  remainingCredits: number;
  onConfirm?: () => void;
  isConfirming?: boolean;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[14px] leading-6 text-[rgba(24,24,24,0.8)]">{label}</span>
      <span className="text-[14px] font-medium leading-6 text-[#1C1C1C]">{value}</span>
    </div>
  );
}

export default function PurchaseJobModal({
  open,
  onOpenChange,
  job,
  remainingCredits,
  onConfirm,
  isConfirming = false,
}: PurchaseJobModalProps) {
  const description = cleanJobDescription(job.description);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[525px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] border-none p-0 shadow-xl"
      >
        <DialogTitle className="sr-only">Purchase job summary</DialogTitle>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-[30px] top-5 flex h-10 w-10 items-center justify-center"
          aria-label="Close purchase summary"
        >
          <X className="h-5 w-5 text-[#181818]" strokeWidth={1.8} />
        </button>

        <div className="px-10 pb-10 pt-8">
          <p className="text-[16px] font-medium capitalize leading-5 tracking-[-0.018em] text-[#1C1C1C]">
            Summary
          </p>

          <h2 className="mt-6 text-[24px] font-bold capitalize leading-[30px] tracking-[-0.018em] text-[#1C1C1C]">
            {job.categoryName}
          </h2>

          <p className="mt-2 line-clamp-2 break-all text-[14px] leading-[26px] text-[rgba(24,24,24,0.8)]">
            {description || "No description provided."}
          </p>

          <div className="mt-4 flex flex-col gap-2.5">
            <SummaryRow label="Posted Date:" value={formatPostedDate(job.postedDate)} />
            <SummaryRow
              label="Status:"
              value={formatJobStatus(job.status, job.jobProviderStatus)}
            />
            <SummaryRow label="Job Type:" value={formatJobType(job.type)} />
            <SummaryRow
              label="Contact Preferences:"
              value={formatContactPreferences(job.contactPreferences)}
            />
          </div>

          <div className="mt-4 rounded-[8px] bg-[#F9FAFA] px-4 py-[19px]">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[14px] leading-[18px] text-[rgba(24,24,24,0.8)]">
                Remaining Credits:
              </span>
              <span className="text-[14px] font-medium leading-[18px] text-[rgba(24,24,24,0.8)]">
                {remainingCredits.toLocaleString("en-US")}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-[16px] font-medium leading-5 text-black">
                Credits to deduct:
              </span>
              <span className="text-[24px] font-bold leading-[30px] text-[#005864]">
                {job.creditsToDeduct.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="mt-6 h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-semibold leading-5 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? "Processing..." : "Confirm Purchase"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
