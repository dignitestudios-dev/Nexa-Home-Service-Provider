"use client";

import { BriefcaseBusiness, Check, FileText, IdCard, UserRound } from "lucide-react";

const stepItems = [
  { label: "Identity Card", icon: IdCard, active: true },
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
];

export default function IdSubmittedPage() {
  return (
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
          <div className="flex w-full max-w-[488px] flex-col items-center gap-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
              <Check size={40} className="text-white" strokeWidth={3.5} />
            </div>

            <div className="flex flex-col items-center gap-4">
              <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#1C1C1C]">
                ID Submitted for Verification
              </h1>
              <p className="max-w-[364px] text-[16px] leading-[22px] tracking-[-0.014em] text-black/80">
                Your ID has been uploaded successfully and is now under review.
                You&apos;ll be notified once the verification is complete.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

