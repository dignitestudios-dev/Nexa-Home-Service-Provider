"use client";

import { useEffect, useRef } from "react";
import {
  BriefcaseBusiness,
  File,
  FileText,
  IdCard,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { driver, type Driver } from "driver.js";
import { markOnboardingTutorialCompleted } from "@/lib/onboarding-tutorial-storage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Card", icon: IdCard, active: true },
];

export default function TutorialIdentityCardPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const driverInstance = useRef<Driver | null>(null);

  useEffect(() => {
    const d = driver({
      showProgress: true,
      animate: true,
      allowClose: false,
      allowScroll: false,
      smoothScroll: false,
      disableActiveInteraction: true,
      overlayOpacity: 0.65,
      popoverClass: "nexa-driver-popover",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Next",
      progressText: "{{current}} of {{total}}",
      overlayClickBehavior: "none",
      steps: [
        {
          element: "#tutorial-id-header",
          popover: {
            title: "Identity Verification",
            description:
              "We verify every Expert's identity so users know they're hiring a real person or business.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tutorial-id-front-box",
          popover: {
            title: "Front of ID",
            description:
              "Upload a clear photo of the front of your driver's license, passport, or other government-issued ID.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tutorial-id-back-box",
          popover: {
            title: "Back of ID",
            description:
              "Upload a clear photo of the back. Make sure the barcode is readable.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tutorial-id-submit-btn",
          popover: {
            title: "You’re All Set",
            description:
              "Click 'Next' to start building your Expert profile.",
            side: "top",
            align: "center",
          },
        },
      ],
      onNextClick: (element, step, { driver: drv }) => {
        if (drv.isLastStep()) {
          drv.destroy();
          markOnboardingTutorialCompleted(user?._id);
          router.replace("/onboarding/profile-setup");
        } else {
          drv.moveNext();
        }
      },
      onDoneClick: () => {
        if (driverInstance.current) {
          driverInstance.current.destroy();
        }
        markOnboardingTutorialCompleted(user?._id);
        router.replace("/onboarding/profile-setup");
      },
    });

    driverInstance.current = d;

    const timer = setTimeout(() => {
      d.drive();
    }, 350);

    return () => {
      clearTimeout(timer);
      if (driverInstance.current) {
        driverInstance.current.destroy();
      }
    };
  }, [router, user]);

  return (
    <div className="h-screen w-full overflow-hidden select-none bg-white py-3 pr-3 pl-1 md:py-5 md:pr-10 md:pl-0">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col rounded-[32px] bg-white p-0 lg:flex-row">
        {/* ── Desktop sidebar ── */}
        <aside className="relative hidden h-full w-[400px] shrink-0 overflow-hidden rounded-[24px] bg-[url('/asset/sidebarbg.png')] bg-cover bg-center bg-no-repeat lg:sticky lg:top-0 lg:block">
          <div className="relative z-10 flex h-full w-full items-start px-20 md:pt-[6em]">
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
                          className={
                            step.active ? "text-[#005864]" : "text-white/70"
                          }
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
                      <div
                        className="ml-6 h-8 w-px bg-white/30"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Main content (Pointer events disabled to prevent manual editing) ── */}
        <main className="pointer-events-none flex min-h-0 flex-1 justify-center overflow-hidden px-4 py-6 sm:px-8 lg:px-16 lg:py-14">
          <div className="w-full max-w-[496px] pb-6">
            <div id="tutorial-id-header" className="text-center">
              <h1 className="text-[36px] font-semibold leading-[45px] tracking-[-0.82px] text-[#1C1C1C]">
                Upload Identity Card
              </h1>
              <p className="mt-4 text-[16px] leading-[22px] text-black/80">
                Please upload a clear photo of your government-issued ID (e.g.,
                driver&apos;s license, state ID, or passport). This helps us confirm
                your identity and keep NexaHome safe for everyone.
              </p>
            </div>

            <div className="mt-10">
              <div className="flex flex-col gap-10">
                {/* Front Side */}
                <div id="tutorial-id-front-box">
                  <p className="text-sm font-medium text-[#1C1C1C]">
                    Upload Front Side
                  </p>
                  <p className="mb-2 mt-1 text-xs text-[#181818]/60">
                    JPG, PNG or PDF (max 10MB). Files over 10MB cannot be uploaded.
                  </p>

                  <div className="relative mx-auto flex h-[140px] w-full max-w-[620px] flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#005864] bg-[#F9FAFA]">
                    <File size={24} className="text-[#005864]" />
                    <span className="mt-2 text-[13px] leading-[18px] text-[#1C1C1C]">
                      driver_license_front.jpg
                    </span>
                  </div>
                </div>

                {/* Back Side */}
                <div id="tutorial-id-back-box">
                  <p className="text-sm font-medium text-[#1C1C1C]">
                    Upload Back Side
                  </p>
                  <p className="mb-2 mt-1 text-xs text-[#181818]/60">
                    JPG, PNG or PDF (max 10MB). Files over 10MB cannot be uploaded.
                  </p>

                  <div className="relative mx-auto flex h-[140px] w-full max-w-[620px] flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#005864] bg-[#F9FAFA]">
                    <File size={24} className="text-[#005864]" />
                    <span className="mt-2 text-[13px] leading-[18px] text-[#1C1C1C]">
                      driver_license_back.jpg
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="tutorial-id-submit-btn"
                type="button"
                className="mt-8 h-[48px] w-full rounded-[12px] bg-[#005864] text-[16px] font-semibold leading-[20px] text-white shadow-md"
              >
                Submit
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
