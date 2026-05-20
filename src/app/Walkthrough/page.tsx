"use client";

import { useRouter } from "next/navigation";

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

  return (
    <div className="min-h-screen w-full bg-white p-3 md:p-5">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[1440px] flex-col items-center rounded-[32px] bg-white px-6 py-12 md:px-10">
        <div className="mt-4 flex w-full max-w-[791px] flex-col items-center gap-4 text-center">
          <h1 className="text-[48px] font-semibold leading-[60px] tracking-[-0.008em] text-[#181818] capitalize">
            App Walkthrough
          </h1>
          <p className="text-[20px] leading-[25px] tracking-[-0.014em] text-[#565656]">
            Let&apos;s take a quick tour to help you understand how NexaHome works and how to make
            the most of its features.
          </p>
        </div>

        <div className="mt-14 w-full overflow-x-auto">
          <div className="mx-auto flex w-max min-w-full gap-5">
            {walkthroughItems.map((item) => (
              <article
                key={item.step}
                className="relative h-[405px] w-[314px] shrink-0 rounded-3xl bg-[#F8F8F8] p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#005864] text-[36px] font-extrabold leading-[45px] text-[#F8F8F8]">
                  {item.step}
                </div>

                <div className="mt-5 h-[311px] rounded-[31px] bg-[rgba(0,88,100,0.06)] px-6 py-7 backdrop-blur-[13.75px]">
                  <h3 className="text-center text-[20px] font-semibold leading-[25px] text-[#1C1C1C] capitalize">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-center text-[16px] leading-[26px] text-black/80">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/app/dashboard")}
          className="mt-16 h-12 w-full max-w-[500px] rounded-[12px] bg-[#005864] px-[10px] py-3 text-[16px] font-semibold leading-5 text-white capitalize hover:opacity-95"
        >
          Next
        </button>
      </div>
    </div>
  );
}
