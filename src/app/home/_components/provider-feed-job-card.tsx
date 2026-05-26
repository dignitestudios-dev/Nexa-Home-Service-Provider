import Link from "next/link";

import type { ProviderFeedJob } from "@/types/provider-feed.types";
import {
  cleanJobDescription,
  formatJobType,
  formatJobWhen,
} from "@/lib/parse-provider-feed";

export default function ProviderFeedJobCard({ job }: { job: ProviderFeedJob }) {
  const description = cleanJobDescription(job.description);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-[12px] bg-[#F8F8F8] p-4 transition-opacity hover:opacity-95"
    >
      <h3 className="text-[18px] font-[600] leading-[23px] text-[#1C1C1C]">
        {job.categoryName}
      </h3>
      <p className="mt-2 line-clamp-2 text-[16px] leading-[22px] text-black/80">
        {description || "No description provided."}
      </p>
      <p className="mt-3 text-[16px] font-[500] leading-5 text-[#005864]">
        {formatJobType(job.type)}
      </p>
      <div className="mt-4 rounded-[12px] bg-[rgba(0,88,100,0.06)] px-3 py-2">
        <span className="block text-[12px] leading-[15px] text-[#1C1C1C]">When</span>
        <span className="mt-0.5 block text-[14px] font-semibold leading-5 text-[#005864]">
          {formatJobWhen(job.when)}
        </span>
      </div>
    </Link>
  );
}
