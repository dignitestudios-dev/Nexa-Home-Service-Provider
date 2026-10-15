"use client";

import { useEffect, useRef } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  IdCard,
  MapPin,
  Upload,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";
import { driver, type Driver } from "driver.js";
import { Input } from "@/components/ui/input";
import { markOnboardingTutorialCompleted } from "@/lib/onboarding-tutorial-storage";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: true },
  // { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Verification", icon: IdCard, active: false },
];

export default function TutorialProfileSetupPage() {
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
          element: "#tutorial-profile-upload",
          popover: {
            title: "Add Your Logo or Photo",
            description:
              "Upload a company logo or professional photo. Users will see it when your profile appears for their job.\n\nDon't have one handy? Skip for now.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tutorial-company-details",
          popover: {
            title: "Company & Phone Details",
            description:
              "Please provide your company name, an active SMS-capable phone number, and an optional secondary phone number.\n\n⚠️ Required Phone Acknowledgement:\n• Must be able to receive SMS notifications\n• Must be actively monitored by whoever is responsible for responding to leads\n• Should not be a landline or company mainline that cannot receive texts\n\nYou must check the confirmation box before proceeding.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#tutorial-service-selector",
          popover: {
            title: "Choose Your Services",
            description:
              "Choose the services your business offers. You'll appear for job requests in these categories.\n\nTip: Select your primary service now. Additional or secondary services can easily be added later in your account settings.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tutorial-location-details",
          popover: {
            title: "Location & Service Area",
            description:
              "Set your business address and select how far you're willing to travel for jobs. Your profile will appear in relevant job requests within your selected service area, helping homeowners nearby find and connect with you. You can also add and manage multiple service locations later through your account settings to expand your reach and receive project leads from additional areas.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#tutorial-submit-button",
          popover: {
            title: "Continue to Step 2",
            description: "Click 'Next' to add your portfolio.",
            side: "top",
            align: "center",
          },
        },
      ],
      onNextClick: (element, step, { driver: drv }) => {
        if (drv.isLastStep()) {
          drv.destroy();
          router.push("/tutorial/onboarding/portfolio");
        } else {
          drv.moveNext();
        }
      },
      onDoneClick: () => {
        if (driverInstance.current) {
          driverInstance.current.destroy();
        }
        router.push("/tutorial/onboarding/portfolio");
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
                          isActive ? "bg-white" : "bg-white/30"
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
                        className={`ml-6 h-8 w-px ${isActive ? "bg-white" : "bg-white/30"}`}
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
        <main className="pointer-events-none flex h-full flex-1 justify-center overflow-hidden px-4 py-6 sm:px-8 lg:px-16 lg:py-14">
          <div className="w-full max-w-[618px]">
            <h1 className="text-center text-[32px] font-bold leading-[40px] text-[#1C1C1C]">
              Profile Setup
            </h1>

            {/* Profile Image Section */}
            <div
              id="tutorial-profile-upload"
              className="mt-8 flex flex-col items-center"
            >
              <div className="flex h-[106px] w-[106px] items-center justify-center overflow-hidden rounded-full border border-dashed border-[#005864] bg-[#F9F9F9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <span className="mt-3 text-[16px] font-medium leading-5 text-[#1C1C1C] underline">
                Upload Profile Picture/Logo <span className="text-red-500">*</span>
              </span>

              <p className="mt-1 text-center text-xs text-[#181818]/60">
                PNG or JPG only, max 5MB <span className="text-red-500">(Required)</span>
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                  Full Name (Optional)
                </label>
                <Input
                  value="Alexander Wright"
                  readOnly
                  placeholder="Enter your name"
                  className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                />
              </div>

              {/* Company & Phone Container */}
              <div id="tutorial-company-details" className="space-y-4">
                {/* Company Name */}
                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value="Apex Home Solutions LLC"
                    readOnly
                    placeholder="ABC"
                    className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] placeholder:text-[rgba(24,24,24,0.8)]"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex gap-2">
                    <div className="flex h-12 w-[91px] shrink-0 items-center justify-center rounded-[12px] bg-[#F8F8F8]">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-[5px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/asset/usa.png"
                            alt="USA flag"
                            width={21}
                            height={15}
                            className="h-[15px] w-[21px] rounded-[2px] object-cover"
                          />
                          <span className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                            +1
                          </span>
                        </div>
                        <ChevronDown
                          size={16}
                          className="text-[rgba(24,24,24,0.8)]"
                          aria-hidden
                        />
                      </div>
                    </div>
                    <Input
                      type="text"
                      value="(555) 234-5678"
                      readOnly
                      placeholder="Add phone number"
                      className="h-12 flex-1 rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] placeholder:text-[rgba(24,24,24,0.8)]"
                    />
                  </div>

                  <div className="mt-3 rounded-[14px] border border-[#005864]/20 bg-[#005864]/[0.03] p-4 text-left">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        aria-label="SMS & Lead Monitoring Confirmation"
                        className="mt-1 h-5 w-5 shrink-0 rounded-[4px] border border-[#181818]/60 accent-[#005864]"
                      />
                      <div className="text-[13px] leading-[20px] text-[#1C1C1C]">
                        <p className="font-semibold text-[#005864]">
                          SMS & Lead Monitoring Confirmation <span className="text-red-500">*</span>
                        </p>
                        <p className="mt-1 text-black/80">
                          I acknowledge and confirm that the number entered:
                        </p>
                        <ul className="mt-1.5 list-disc space-y-1 pl-4.5 text-[13px] text-black/75">
                          <li>Can receive SMS.</li>
                          <li>Is actively monitored by whoever is responsible for responding to leads.</li>
                          <li>Should not be a landline or company mainline that cannot receive texts.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Phone Number (Optional) */}
                  <div className="mt-4">
                    <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                      Secondary Phone Number{" "}
                      <span className="text-xs font-normal text-[#181818]/60">(Optional)</span>
                    </label>
                    <div className="mt-1 flex gap-2">
                      <div className="flex h-12 w-[91px] shrink-0 items-center justify-center rounded-[12px] bg-[#F8F8F8]">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-[5px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/asset/usa.png"
                              alt="USA flag"
                              width={21}
                              height={15}
                              className="h-[15px] w-[21px] rounded-[2px] object-cover"
                            />
                            <span className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                              +1
                            </span>
                          </div>
                          <ChevronDown
                            size={16}
                            className="text-[rgba(24,24,24,0.8)]"
                            aria-hidden
                          />
                        </div>
                      </div>
                      <Input
                        type="text"
                        value="(555) 987-6543"
                        readOnly
                        placeholder="Add secondary phone number (optional)"
                        className="h-12 flex-1 rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] placeholder:text-[rgba(24,24,24,0.8)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div id="tutorial-service-selector">
                <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                  Select Service <span className="text-red-500">*</span>
                </label>

                <div className="mt-1 flex h-12 w-full items-center justify-between rounded-[12px] bg-[#F8F8F8] px-4 text-left text-[16px] text-[#1C1C1C]">
                  <span className="truncate pr-3 font-medium text-[#005864]">
                    Plumbing, Heating & Cooling (HVAC), Electrical
                  </span>
                  <ChevronDown size={18} className="text-black/70" />
                </div>
                <p className="mt-1.5 text-[13px] leading-5 text-black/60">
                  Additional or secondary services can easily be added later after selecting your primary service.
                </p>
              </div>

              {/* Overview */}
              <div>
                <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                  Overview <span className="text-red-500">*</span>
                </label>

                <div className="mt-1 rounded-[12px] bg-[#F8F8F8] p-3">
                  <textarea
                    rows={3}
                    value="Licensed general contractor with over 10 years of experience providing high-quality residential plumbing, heating, and cooling services across Philadelphia."
                    readOnly
                    placeholder="Write here"
                    className="h-[96px] w-full resize-none bg-transparent text-[16px] leading-5 text-[#1C1C1C] outline-none"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p className="ml-auto text-right text-[16px] leading-5 text-black/60">
                    152/1000
                  </p>
                </div>
              </div>

              {/* Address / Location Section */}
              <div id="tutorial-location-details" className="space-y-3">
                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Search Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value="1420 Market Street, Philadelphia, PA 19102"
                    readOnly
                    placeholder="Search for your address..."
                    className="mt-1 h-12 w-full rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] text-[#1C1C1C] outline-none"
                  />
                </div>

                <div className="relative h-[200px] w-full overflow-hidden rounded-[12px] border border-[#005864]/30 bg-[#E8F7F7]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(#b8c5c7_1px,transparent_1px)] [background-size:16px_16px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#005864] text-white shadow-md">
                      <MapPin size={22} />
                    </div>
                    <span className="mt-1 rounded bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-[#005864] shadow-sm">
                      1420 Market Street, Philadelphia, PA
                    </span>
                  </div>
                </div>

                <p className="text-[13px] text-black/50">
                  Click on the map or drag the marker to auto-fill the address fields below.
                </p>

                {/* LABEL */}
                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Label This Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value="Main Office"
                    readOnly
                    placeholder="e.g., Home, Office"
                    className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                  />
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value="1420 Market Street"
                    readOnly
                    className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                  />
                </div>

                {/* OFFICE + ZIP */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                      Office No.
                    </label>
                    <Input
                      value="Suite 400"
                      readOnly
                      className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                    />
                  </div>

                  <div>
                    <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value="19102"
                      readOnly
                      className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="mt-6">
                <label className="flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="mt-0.5 h-5 w-5 rounded-[4px] border border-[#181818]/80 accent-[#005864]"
                  />
                  <span className="text-[15px] leading-[19px] text-black/80">
                    I accept the{" "}
                    <span className="font-medium text-[#005864] underline">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-[#005864] underline">
                      Privacy Policy
                    </span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div id="tutorial-submit-button">
                <button
                  type="button"
                  className="mx-auto mt-6 block h-12 w-full max-w-[500px] rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white shadow-md"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
