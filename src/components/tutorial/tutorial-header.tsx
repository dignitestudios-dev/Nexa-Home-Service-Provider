"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sparkles, ArrowRight, RotateCcw, XCircle } from "lucide-react";
import {
  TUTORIAL_STEPS,
  markOnboardingTutorialCompleted,
} from "@/lib/onboarding-tutorial-storage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";

interface TutorialHeaderProps {
  onReplayTour?: () => void;
}

export default function TutorialHeader({ onReplayTour }: TutorialHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const currentStep =
    TUTORIAL_STEPS.find((s) => s.path === pathname) || TUTORIAL_STEPS[0];

  const handleSkipTutorial = () => {
    markOnboardingTutorialCompleted(user?._id);
    router.replace("/onboarding/profile-setup");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-teal-800/20 bg-[#005864] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-[#D7DF23]">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D7DF23]">
                Onboarding Interactive Walkthrough
              </span>
              <span className="hidden rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium sm:inline-block">
                Dummy Preview (No API Calls)
              </span>
            </div>
            <p className="text-xs text-white/90">
              Step {currentStep.step} of {TUTORIAL_STEPS.length}:{" "}
              <strong className="font-semibold text-white">
                {currentStep.title}
              </strong>
            </p>
          </div>
        </div>

        {/* Center: Steps indicators */}
        <div className="hidden items-center gap-2 md:flex">
          {TUTORIAL_STEPS.map((s) => {
            const isCurrent = s.path === pathname;
            const isCompleted = s.step < currentStep.step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => router.push(s.path)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-white text-[#005864] shadow-sm font-semibold"
                    : isCompleted
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-black/20 text-white/60 hover:bg-black/30"
                }`}
              >
                <span>{s.step}.</span>
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onReplayTour && (
            <button
              type="button"
              onClick={onReplayTour}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 active:scale-95"
              title="Restart Driver.js Guide"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Replay Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSkipTutorial}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#D7DF23] px-3.5 py-1.5 text-xs font-semibold text-[#005864] shadow-sm transition hover:bg-[#c9d11e] active:scale-95"
          >
            <span>Start Real Onboarding</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
