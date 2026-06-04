import type { ReportIssue } from "@/types/report-issue.types";

type IssueCardProps = {
  issue: ReportIssue;
  onViewDetail?: (issue: ReportIssue) => void;
};

function truncateDescription(text: string, maxLength = 72): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}...`;
}

export default function IssueCard({ issue, onViewDetail }: IssueCardProps) {
  return (
    <article className="flex min-h-[163px] min-w-0 flex-col overflow-hidden rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 py-3">
      <div className="flex min-w-0 items-center justify-between gap-3 text-[14px] leading-[26px] text-[#1C1C1C]">
        <span className="min-w-0 break-words">Issue ID: {issue.issueId}</span>
        <span className="shrink-0">{issue.createdAt}</span>
      </div>

      <div className="my-3 border-t border-[rgba(52,52,52,0.25)]" />

      <h3 className="line-clamp-2 break-words text-[18px] font-[600] leading-[23px] text-[#1C1C1C]">
        {issue.title}
      </h3>

      <p className="mt-1 line-clamp-3 break-words text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
        {truncateDescription(issue.description)}
      </p>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => onViewDetail?.(issue)}
          className="cursor-pointer text-[14px] font-[600] leading-5 text-[#005864] underline underline-offset-2 transition hover:text-[#004d57]"
        >
          View Detail
        </button>
      </div>
    </article>
  );
}
