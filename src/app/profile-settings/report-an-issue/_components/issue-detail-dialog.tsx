"use client";

import { CalendarDays, CheckCircle2, Clock3, Hash, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReportIssueDetailQuery } from "@/hooks/report-issue/use-report-issue-detail-query";
import type { ReportIssueStatus } from "@/types/report-issue.types";

type IssueDetailDialogProps = {
  issueId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getStatusLabel(status: ReportIssueStatus, apiStatus: string): string {
  if (status === "under-review") {
    return "Under Review";
  }

  const normalized = apiStatus.trim();
  if (!normalized) {
    return "Resolved";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function StatusBadge({
  status,
  apiStatus,
}: {
  status: ReportIssueStatus;
  apiStatus: string;
}) {
  const isUnderReview = status === "under-review";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-[600] leading-4 ${
        isUnderReview
          ? "bg-[rgba(0,88,100,0.12)] text-[#005864]"
          : "bg-[rgba(34,197,94,0.12)] text-[#15803D]"
      }`}
    >
      {isUnderReview ? (
        <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
      ) : (
        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.2} />
      )}
      {getStatusLabel(status, apiStatus)}
    </span>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[12px] bg-[#F8F8F8] px-4 py-3">
      <div className="flex items-center gap-2 text-[rgba(24,24,24,0.6)]">
        {icon}
        <span className="text-[13px] font-[500] leading-4">{label}</span>
      </div>
      <p className="mt-2 break-words text-[15px] font-[500] leading-5 text-[#1C1C1C]">
        {value}
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-5 w-28 rounded bg-[#E8E8E8]" />
          <div className="h-7 w-28 rounded-full bg-[#E8E8E8]" />
        </div>
        <div className="mt-4 h-7 w-3/4 rounded bg-[#E8E8E8]" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-[#E8E8E8]" />
        <div className="h-[120px] rounded-[12px] bg-[#F8F8F8]" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="h-[72px] rounded-[12px] bg-[#F8F8F8]" />
        <div className="h-[72px] rounded-[12px] bg-[#F8F8F8]" />
      </div>
    </div>
  );
}

export default function IssueDetailDialog({
  issueId,
  open,
  onOpenChange,
}: IssueDetailDialogProps) {
  const {
    data: issue,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useReportIssueDetailQuery({
    issueId,
    enabled: open,
  });

  const showLoading = isLoading || isFetching;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[560px] max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-[16px] border-none p-0 shadow-xl"
      >
        <DialogTitle className="sr-only">Issue details</DialogTitle>

        <div className="border-b border-[rgba(52,52,52,0.08)] bg-white px-8 pb-5 pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[24px] font-bold leading-[30px] tracking-[-0.018em] text-[#1C1C1C]">
                Issue Details
              </p>
              <p className="mt-1 text-[14px] leading-5 text-[rgba(24,24,24,0.6)]">
                Review your submitted issue report
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8F8F8] transition hover:bg-[#EFEFEF]"
              aria-label="Close issue details dialog"
            >
              <X className="h-5 w-5 text-[#181818]" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="min-w-0 max-h-[70vh] overflow-y-auto overflow-x-hidden px-8 pb-8 pt-6">
          {showLoading ? (
            <DetailSkeleton />
          ) : isError ? (
            <div className="rounded-[12px] bg-[#F8F8F8] px-4 py-8 text-center">
              <p className="text-[15px] text-[rgba(24,24,24,0.8)]">
                Unable to load issue details. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
              >
                Retry
              </button>
            </div>
          ) : issue ? (
            <div className="min-w-0 space-y-5">
              <section className="min-w-0 overflow-hidden rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 py-4">
                <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex min-w-0 items-center gap-2 text-[14px] leading-5 text-[#1C1C1C]">
                    <Hash className="h-4 w-4 shrink-0 text-[#005864]" strokeWidth={2.2} />
                    <span className="shrink-0 font-[500]">Issue ID:</span>
                    <span className="break-words">{issue.issueId}</span>
                  </div>
                  <StatusBadge status={issue.status} apiStatus={issue.apiStatus} />
                </div>

                <h3 className="mt-4 break-words text-[20px] font-[600] leading-[26px] text-[#1C1C1C]">
                  {issue.title}
                </h3>
              </section>

              <section className="min-w-0">
                <p className="text-[16px] font-[500] leading-5 text-[#1C1C1C]">
                  Description
                </p>
                <div className="mt-2 max-h-[180px] min-w-0 overflow-y-auto overflow-x-hidden rounded-[12px] bg-[#F8F8F8] p-4">
                  <p className="break-words whitespace-pre-wrap text-[16px] leading-[26px] text-[rgba(24,24,24,0.85)]">
                    {issue.description}
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MetaCard
                  icon={
                    <CalendarDays
                      className="h-4 w-4 text-[#005864]"
                      strokeWidth={2.2}
                    />
                  }
                  label="Reported Date"
                  value={issue.reportedDate}
                />
                {issue.resolvedDate ? (
                  <MetaCard
                    icon={
                      <CheckCircle2
                        className="h-4 w-4 text-[#15803D]"
                        strokeWidth={2.2}
                      />
                    }
                    label="Resolved Date"
                    value={issue.resolvedDate}
                  />
                ) : (
                  <MetaCard
                    icon={
                      <Clock3
                        className="h-4 w-4 text-[#005864]"
                        strokeWidth={2.2}
                      />
                    }
                    label="Current Status"
                    value={getStatusLabel(issue.status, issue.apiStatus)}
                  />
                )}
              </section>

              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-[600] leading-5 text-white hover:bg-[#004d57]"
              >
                Close
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
