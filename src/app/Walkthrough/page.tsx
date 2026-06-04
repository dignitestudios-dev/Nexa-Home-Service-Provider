"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { WALKTHROUGH_CREDIT_PLANS_PATH } from "@/lib/walkthrough-storage";

const walkthroughItems = [
  {
    step: 1,
    title: "Discover New Projects",
    description:
      "Homeowner project requests appear on your homepage, and you'll be notified by text or email when new jobs are posted. You can adjust your notification preferences anytime.",
  },
  {
    step: 2,
    title: "Unlock Leads",
    description:
      "When a project interests you, use credits to unlock the homeowner's contact details so you can reach out and discuss the job.",
  },
  {
    step: 3,
    title: "Showcase Your Work",
    description:
      "Keep your profile and portfolio up to date so homeowners can see your experience and the quality of your work. Strong photos and positive reviews help you stand out.",
  },
  {
    step: 4,
    title: "Manage Your Jobs",
    description:
      "Track purchased leads, ongoing jobs, and completed projects in one place so you can easily manage your opportunities.",
  },
] as const;

export default function WalkthroughPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleContinue = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.replace(WALKTHROUGH_CREDIT_PLANS_PATH);
  };

  return (
    <>
      {isNavigating ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <span
            className="h-10 w-10 animate-spin rounded-full border-4 border-[#005864] border-t-transparent"
            aria-hidden="true"
          />
          <p className="mt-4 text-[16px] leading-5 text-black/70">
            Loading credit plans...
          </p>
        </div>
      ) : null}

      <div className="min-h-screen w-full bg-white p-3 md:p-5">
        <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[1200px] flex-col items-center rounded-[32px] bg-white px-4 py-8 md:px-8">
          <div className="mt-2 flex w-full max-w-[640px] flex-col items-center gap-3 text-center">
            <p className="text-[14px] font-[500] uppercase tracking-[0.08em] text-[#005864]">
              Step 1 of 3
            </p>
            <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#181818] capitalize md:text-[36px] md:leading-[44px]">
              App Walkthrough
            </h1>
            <p className="text-[15px] leading-[22px] tracking-[-0.014em] text-[#565656] md:text-[16px]">
              Let&apos;s take a quick tour to help you understand how NexaHome works and how to make
              the most of its features.
            </p>
          </div>

          <div className="mt-8 w-full overflow-x-auto md:mt-10">
            <div className="mx-auto flex w-max min-w-full justify-center gap-4 px-1">
              {walkthroughItems.map((item) => (
                <article
                  key={item.step}
                  className="relative flex h-[320px] w-[240px] shrink-0 flex-col rounded-[20px] bg-[#F8F8F8] p-3 sm:h-[340px] sm:w-[260px]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#005864] text-[24px] font-extrabold leading-none text-[#F8F8F8]">
                    {item.step}
                  </div>

                  <div className="mt-4 flex flex-1 flex-col rounded-[24px] bg-[rgba(0,88,100,0.06)] px-4 py-5 backdrop-blur-[13.75px] sm:px-5">
                    <h3 className="text-center text-[16px] font-semibold leading-[20px] text-[#1C1C1C] capitalize sm:text-[18px] sm:leading-[23px]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-center text-[13px] leading-[20px] text-black/80 sm:mt-4 sm:text-[14px] sm:leading-[22px]">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={isNavigating}
            className="mt-10 h-11 w-full max-w-[420px] rounded-[12px] bg-[#005864] px-[10px] py-3 text-[15px] font-semibold leading-5 text-white capitalize hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 md:mt-12"
          >
            {isNavigating ? "Please wait..." : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}
