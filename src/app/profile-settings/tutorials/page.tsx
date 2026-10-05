"use client";

import { Briefcase, CheckCircle2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { TUTORIAL_HOME_PATH } from "@/lib/onboarding-tutorial-storage";

export default function TutorialsSettingsPage() {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-[24px] font-[700] leading-[30px] text-black">
        Dashboard Walkthrough
      </h2>
      <p className="mt-1 text-[15px] text-black/60">
        Replay the interactive dashboard and lead purchasing walkthrough anytime.
      </p>

      <div className="mt-8 space-y-5">
        {/* Home & Jobs Tutorial Card */}
        <div className="rounded-[16px] border border-gray-200 bg-white p-6 shadow-xs transition hover:border-[#005864]/30 hover:shadow-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#005864]/10 text-[#005864]">
                <Briefcase size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-bold text-[#1C1C1C]">
                    Dashboard & Available Jobs Guide
                  </h3>
                  <span className="rounded-full bg-[#005864]/10 px-2.5 py-0.5 text-xs font-semibold text-[#005864]">
                    Interactive
                  </span>
                </div>
                <p className="mt-1.5 max-w-xl text-[14px] leading-5 text-black/70">
                  Explore how the main dashboard works, how to filter incoming homeowner requests, review project specifications, and purchase leads using your credit balance.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-black/60">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-[#005864]" /> Available Jobs Feed
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-[#005864]" /> Job Details View
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-[#005864]" /> Lead Purchase Flow
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(TUTORIAL_HOME_PATH)}
              className="mt-2 flex shrink-0 items-center justify-center gap-2 rounded-[12px] bg-[#005864] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004852] active:scale-95 sm:mt-0"
            >
              <RotateCcw size={16} />
              <span>Replay Dashboard Tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
