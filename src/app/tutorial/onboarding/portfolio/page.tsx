"use client";

import { useEffect, useRef } from "react";
import {
  BriefcaseBusiness,
  FileText,
  IdCard,
  Upload,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";
import { driver, type Driver } from "driver.js";
import { markOnboardingTutorialCompleted } from "@/lib/onboarding-tutorial-storage";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: true },
  { label: "Identity Card", icon: IdCard, active: false },
];

const SAMPLE_MEDIA = [
  {
    id: "sample-1",
    name: "kitchen-remodel-project.jpg",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-2",
    name: "bathroom-renovation.jpg",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "sample-3",
    name: "custom-hardwood-floor.jpg",
    url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=200&auto=format&fit=crop&q=80",
  },
];

export default function TutorialPortfolioPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const driverInstance = useRef<Driver | null>(null);

  const handleSkipTutorial = () => {
    if (driverInstance.current) {
      driverInstance.current.destroy();
    }
    markOnboardingTutorialCompleted(user?._id);
    router.replace("/onboarding/profile-setup");
  };

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
      onPopoverRender: (popover, { driver: drv }) => {
        if (!popover.footerButtons.querySelector(".driver-popover-skip-btn")) {
          const skipBtn = document.createElement("button");
          skipBtn.className = "driver-popover-btn driver-popover-skip-btn";
          skipBtn.type = "button";
          skipBtn.textContent = "Skip";
          skipBtn.setAttribute("aria-label", "Skip Tutorial");
          skipBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            drv.destroy();
            handleSkipTutorial();
          };
          popover.footerButtons.insertBefore(
            skipBtn,
            popover.footerButtons.firstChild,
          );
        }
      },
      onCloseClick: () => {
        handleSkipTutorial();
      },
      steps: [
        {
          element: "#tutorial-portfolio-header",
          popover: {
            title: "Showcase Your Work",
            description:
              "Photos and videos of your past work help users choose you with confidence.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tutorial-portfolio-upload-box",
          popover: {
            title: "Upload Your Work",
            description:
              "Add up to 10 photos or short videos (PNG, JPEG, MP4, WebM, MOV).",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tutorial-portfolio-items-grid",
          popover: {
            title: "Manage Your Portfolio",
            description:
              "Preview and arrange your photos and videos before submitting your profile for verification.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#tutorial-portfolio-continue-btn",
          popover: {
            title: "Continue to Step 3",
            description:
              "Click 'Next' for the final step: Identity Verification.",
            side: "top",
            align: "center",
          },
        },
      ],
      onNextClick: (element, step, { driver: drv }) => {
        if (drv.isLastStep()) {
          drv.destroy();
          router.push("/tutorial/onboarding/identity-card");
        } else {
          drv.moveNext();
        }
      },
      onDoneClick: () => {
        if (driverInstance.current) {
          driverInstance.current.destroy();
        }
        router.push("/tutorial/onboarding/identity-card");
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
  }, [router]);

  return (
    <div className="h-screen w-full overflow-hidden select-none bg-white py-3 pr-3 pl-1 md:py-5 md:pr-10 md:pl-0">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col rounded-[32px] bg-white p-0 lg:flex-row">
        {/* ── Mobile stepper ── */}
        <div className="rounded-[16px] bg-[#005864] p-3 lg:hidden">
          <div className="hide-scrollbar flex gap-3 overflow-x-auto">
            {stepItems.map((step) => {
              const Icon = step.icon;
              const isActive = step.active;
              return (
                <div
                  key={`mobile-${step.label}`}
                  className={`flex shrink-0 items-center gap-2 rounded-[10px] px-3 py-2 ${
                    isActive ? "bg-white" : "bg-white/20"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-[#005864]" : "text-white/80"}
                  />
                  <span
                    className={`text-[13px] font-medium ${
                      isActive ? "text-[#005864]" : "text-white"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Desktop sidebar ── */}
        <aside className="relative hidden h-full w-[400px] shrink-0 overflow-hidden rounded-[24px] bg-[url('/asset/sidebarbg.png')] bg-cover bg-center bg-no-repeat lg:block">
          <div className="relative z-10 flex h-full w-full items-start px-20 pt-[6em]">
            <div className="flex w-full max-w-[199px] flex-col gap-1">
              {stepItems.map((step, index) => {
                const Icon = step.icon;
                const isLastStep = index === stepItems.length - 1;
                const isActive = step.active;

                return (
                  <div key={step.label} className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${
                          isActive
                            ? "bg-white shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
                            : "bg-white/30"
                        }`}
                      >
                        <Icon
                          size={23}
                          className={
                            isActive ? "text-[#005864]" : "text-white/70"
                          }
                        />
                      </div>
                      <span
                        className={`text-[14px] leading-[17px] tracking-[-0.008em] ${
                          isActive ? "text-white" : "text-white/60"
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
        <main className="pointer-events-none relative flex h-full flex-1 justify-center overflow-hidden px-4 py-6 sm:px-8 lg:px-16 lg:py-14">
          <section className="mt-12 w-full max-w-[607px] lg:mt-6">
            <div className="mt-12 w-full max-w-[607px] lg:mt-6">
              <div id="tutorial-portfolio-header" className="text-center">
                <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#1C1C1C]">
                  Upload Portfolio
                </h1>

                <p className="mt-4 text-[16px] leading-5 tracking-[-0.014em] text-black/80">
                  Upload up to 10 items — PNG or JPEG images and MP4, WebM, or MOV videos.
                </p>
              </div>

              <div className="mt-12">
                <div
                  id="tutorial-portfolio-upload-box"
                  className="relative flex h-[151px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#005864] bg-[rgba(0,88,100,0.06)] px-3"
                >
                  <Upload size={30} className="text-[#005864]" />

                  <div className="mt-4 text-center">
                    <p className="text-[15px] font-medium leading-[19px] text-[#1C1C1C]">
                      Upload Image or Video
                    </p>

                    <p className="mt-1 text-[15px] leading-[19px] text-black/80">
                      PNG, JPEG · MP4, WebM, MOV (3/10)
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded items grid */}
              <div id="tutorial-portfolio-items-grid" className="mt-4 flex flex-wrap gap-3">
                {SAMPLE_MEDIA.map((item) => (
                  <div
                    key={item.id}
                    className="relative h-[90px] w-[90px] overflow-hidden rounded-[12px] bg-[#F1F3F4] shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Submit button */}
              <button
                id="tutorial-portfolio-continue-btn"
                type="button"
                className="mx-auto mt-10 block h-12 w-full max-w-[500px] rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white shadow-md"
              >
                Continue
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
