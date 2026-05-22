"use client";

import { Suspense, useEffect, useState } from "react";
import { BriefcaseBusiness, Check, CircleAlert, FileText, IdCard, UserRound, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Card", icon: IdCard, active: true },
];

const statusContent = {
  submitted: {
    title: "ID Submitted for Verification",
    description:
      "Your ID has been uploaded successfully and is now under review. You'll be notified once the verification is complete.",
    icon: <Check size={40} className="text-white" strokeWidth={3.5} />,
    iconBg: "bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]",
  },
  resubmit: {
    title: "Resubmit Your ID",
    description:
      "We couldn't verify your ID because the uploaded image was unclear or missing details. Please upload a clearer photo to continue.",
    icon: <CircleAlert size={38} className="text-white" strokeWidth={2.8} />,
    iconBg: "bg-[linear-gradient(136.41deg,#C07600_30%,#F2B94B_120%)]",
  },
  rejected: {
    title: "Verification Rejected",
    description:
      "We couldn't verify your ID. The details you provided are invalid or don't match your profile. Due to this, your account creation has been restricted.",
    icon: <CircleAlert size={38} className="text-white" strokeWidth={2.8} />,
    iconBg: "bg-[linear-gradient(136.41deg,#B00020_30%,#FF6B6B_120%)]",
  },
  approved: {
    title: "Verification Approved",
    description: "The ID is successfully verified by the system/admin.",
    icon: <Check size={40} className="text-white" strokeWidth={3.5} />,
    iconBg: "bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]",
  },
} as const;

type StatusKey = keyof typeof statusContent;

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

function AccountStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawStatus = (searchParams.get("status") ?? "submitted").toLowerCase();
  const initialStatus = (Object.keys(statusContent).includes(rawStatus)
    ? rawStatus
    : "submitted") as StatusKey;
  const [status, setStatus] = useState<StatusKey>(initialStatus);
  const [isProfileSetupModalOpen, setIsProfileSetupModalOpen] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const HOME_REDIRECT_MS = 7500;

  useEffect(() => {
    setStatus(initialStatus);
    setIsProfileSetupModalOpen(false);
    setShowWalkthrough(false);
  }, [initialStatus]);

  useEffect(() => {
    if (initialStatus !== "submitted") return;

    const homeTimer = setTimeout(() => {
      router.replace("/home");
    }, HOME_REDIRECT_MS);

    return () => clearTimeout(homeTimer);
  }, [initialStatus, router]);

  useEffect(() => {
    if (status !== "submitted") return;

    const approvalTimer = setTimeout(() => {
      setStatus("approved");
    }, 3500);

    return () => clearTimeout(approvalTimer);
  }, [status]);

  const content = statusContent[status];
  const shouldShowWalkthrough = initialStatus === "submitted" && showWalkthrough;

  return (
    <>
      <Dialog
        open={isProfileSetupModalOpen}
        onOpenChange={setIsProfileSetupModalOpen}
      >
        <DialogContent
          showCloseButton={false}
          className="w-[515px] max-w-[calc(100%-2rem)] rounded-[24px] border-0 bg-white p-0"
        >
          <button
            type="button"
            onClick={() => setIsProfileSetupModalOpen(false)}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#181818]/80 hover:bg-black/5"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          <div className="px-[43px] py-[46px]">
            <div className="mx-auto flex w-full max-w-[428px] flex-col items-center gap-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
                <Check size={40} className="text-white" strokeWidth={4} />
              </div>

              <div className="flex w-full flex-col items-center gap-4">
                <DialogTitle className="w-full text-center text-[32px] leading-[40px] tracking-[-0.008em] font-semibold text-[#1C1C1C] capitalize">
                  Profile Setup Completed
                </DialogTitle>
                <DialogDescription className="w-full max-w-[439px] text-center text-[18px] leading-[23px] text-black/80">
                  Your profile has been successfully set up. You&apos;re all set to start
                  exploring NexaHome and connecting with trusted service providers.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-screen w-full overflow-hidden bg-white py-3 pr-3 pl-1 md:py-5 md:pr-10 md:pl-0">
      <div className="mx-auto flex h-full w-full max-w-[1440px] rounded-[32px] bg-white p-0">
        <aside className="relative hidden h-full w-[400px] shrink-0 overflow-hidden rounded-[24px] bg-[url('/asset/sidebarbg.png')] bg-cover bg-center bg-no-repeat lg:block">
          <div className="relative z-10 flex h-full w-full items-start px-20 pt-[6em]">
            <div className="flex w-full max-w-[199px] flex-col gap-1">
              {stepItems.map((step, index) => {
                const Icon = step.icon;
                const isLastStep = index === stepItems.length - 1;
                return (
                  <div key={step.label} className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${
                          step.active ? "bg-white" : "bg-white/30"
                        }`}
                      >
                        <Icon
                          size={23}
                          className={step.active ? "text-[#005864]" : "text-white/70"}
                        />
                      </div>
                      <span
                        className={`text-[14px] leading-[17px] tracking-[-0.008em] ${
                          step.active ? "text-white" : "text-white/60"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLastStep && (
                      <div className="ml-6 h-8 w-px bg-white/30" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex h-full flex-1 items-center justify-center px-4 sm:px-8">
          {shouldShowWalkthrough ? (
            <section className="relative flex h-full w-full max-w-[1040px] flex-col items-center px-2 py-8">
              <div className="mt-8 flex w-full max-w-[791px] flex-col items-center gap-4 text-center">
                <h1 className="text-[48px] font-semibold leading-[60px] tracking-[-0.008em] text-[#181818] capitalize">
                  App Walkthrough
                </h1>
                <p className="text-[20px] leading-[25px] tracking-[-0.014em] text-[#565656]">
                  Let&apos;s take a quick tour to help you understand how NexaHome works and how to
                  make the most of its features.
                </p>
              </div>

              <div className="mt-14 w-full overflow-hidden">
                <div className="flex gap-5">
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
                onClick={() => router.push("/home")}
                className="mt-16 h-12 w-full max-w-[500px] rounded-[12px] bg-[#005864] px-[10px] py-3 text-[16px] font-semibold leading-5 text-white capitalize hover:opacity-95"
              >
                Next
              </button>
            </section>
          ) : (
            <div className="flex w-full max-w-[520px] flex-col items-center gap-8 text-center">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full ${content.iconBg}`}>
                {content.icon}
              </div>

              <div className="flex flex-col items-center gap-4">
                <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#1C1C1C]">
                  {content.title}
                </h1>
                <p className="max-w-[420px] text-[16px] leading-[22px] tracking-[-0.014em] text-black/80">
                  {content.description}
                </p>
                {initialStatus === "submitted" && (
                  <p className="text-[14px] leading-[20px] text-black/50">
                    Redirecting to home in a few seconds…
                  </p>
                )}
              </div>

              {status === "resubmit" && (
                <button
                  type="button"
                  onClick={() => router.push("/onboarding/identity-card")}
                  className="mt-2 h-12 w-full max-w-[388px] rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white hover:opacity-95"
                >
                  Resubmit
                </button>
              )}
            </div>
          )}
        </main>
      </div>
      </div>
    </>
  );
}

export default function AccountStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-white" />}>
      <AccountStatusContent />
    </Suspense>
  );
}

