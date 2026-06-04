"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import PaginationControls from "@/components/ui/pagination-controls";
import AddReportDialog, {
  AddReportButton,
} from "./_components/add-report-dialog";
import IssueCard from "./_components/issue-card";
import IssueDetailDialog from "./_components/issue-detail-dialog";
import {
  REPORT_ISSUES_PER_PAGE,
  useMyReportIssuesQuery,
} from "@/hooks/report-issue/use-my-report-issues-query";
import type { ReportIssueStatus } from "@/types/report-issue.types";

const TABS: { id: ReportIssueStatus; label: string }[] = [
  { id: "under-review", label: "Under Review" },
  { id: "resolved", label: "Resolved" },
];

function IssueCardSkeleton() {
  return (
    <div className="min-h-[163px] animate-pulse rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 w-28 rounded bg-[#E8E8E8]" />
        <div className="h-4 w-20 rounded bg-[#E8E8E8]" />
      </div>
      <div className="my-3 border-t border-[rgba(52,52,52,0.25)]" />
      <div className="h-6 w-40 rounded bg-[#E8E8E8]" />
      <div className="mt-3 h-4 w-full rounded bg-[#E8E8E8]" />
      <div className="mt-2 h-4 w-4/5 rounded bg-[#E8E8E8]" />
    </div>
  );
}

export default function ReportAnIssuePage() {
  const [activeTab, setActiveTab] = useState<ReportIssueStatus>("under-review");
  const [page, setPage] = useState(1);
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const {
    data: allIssues = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useMyReportIssuesQuery();

  const filteredIssues = useMemo(
    () => allIssues.filter((issue) => issue.status === activeTab),
    [activeTab, allIssues],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredIssues.length / REPORT_ISSUES_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);

  const visibleIssues = useMemo(
    () =>
      filteredIssues.slice(
        (safePage - 1) * REPORT_ISSUES_PER_PAGE,
        safePage * REPORT_ISSUES_PER_PAGE,
      ),
    [filteredIssues, safePage],
  );

  const showLoading = isLoading || isFetching;

  const handleTabChange = (tab: ReportIssueStatus) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[966px] flex-col">
      <AddReportDialog
        open={isAddReportOpen}
        onOpenChange={setIsAddReportOpen}
        onSuccess={() => {
          setActiveTab("under-review");
          setPage(1);
        }}
      />

      <IssueDetailDialog
        issueId={selectedIssueId}
        open={Boolean(selectedIssueId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedIssueId(null);
          }
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[32px] font-[600] leading-[40px] text-black">
          Report An Issue
        </h2>
        <AddReportButton onClick={() => setIsAddReportOpen(true)} />
      </div>

      <div className="mt-6 inline-flex h-[46px] w-full max-w-[343px] rounded-[12px] bg-white p-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`h-[38px] flex-1 rounded-[8px] text-[16px] capitalize leading-5 transition ${
                isActive
                  ? "bg-[#005864] font-[500] text-white"
                  : "bg-white font-[400] text-[rgba(24,24,24,0.8)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[500px]">
        {showLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: REPORT_ISSUES_PER_PAGE }).map((_, index) => (
              <IssueCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[12px] bg-white px-6 py-10 text-center">
            <p className="text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
              Unable to load issues. Please try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : visibleIssues.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onViewDetail={(selectedIssue) =>
                  setSelectedIssueId(selectedIssue.id)
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[12px] bg-white px-6 py-10 text-center">
            <Image
              src="/asset/nofound.jpg"
              alt="No issues found"
              width={400}
              height={400}
              className="h-auto max-h-[280px] w-auto max-w-full object-contain"
              unoptimized
            />
            <p className="mt-4 text-[16px] leading-[26px] !-mt-8 text-[rgba(24,24,24,0.8)]">
              {activeTab === "under-review"
                ? "No issues under review yet."
                : "No resolved issues yet."}
            </p>
          </div>
        )}

      </div>

      {!showLoading && !isError ? (
        <PaginationControls
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}
