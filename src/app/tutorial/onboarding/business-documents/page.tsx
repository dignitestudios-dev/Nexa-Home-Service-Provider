"use client";

import { useEffect, useRef } from "react";
import {
  BriefcaseBusiness,
  File,
  FileText,
  IdCard,
  Info,
  Upload,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { driver, type Driver } from "driver.js";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: true },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Card", icon: IdCard, active: false },
];

const documentFields = [
  {
    key: "businessLicense",
    label: "Business License",
    fileName: "state-contractor-license.pdf",
  },
  {
    key: "taxRegistration",
    label: "Tax Registration",
    fileName: "ein-tax-certificate.pdf",
  },
  {
    key: "ownershipCertificate",
    label: "Ownership Certificate",
    fileName: null,
  },
  {
    key: "proofOfAddress",
    label: "Proof Of Business Address",
    fileName: null,
  },
];

export default function TutorialBusinessDocumentsPage() {
  const router = useRouter();
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
      doneBtnText: "Next Step",
      progressText: "{{current}} of {{total}}",
      overlayClickBehavior: "none",
      steps: [
        {
          element: "#tutorial-docs-header",
          popover: {
            title: "Business Verification Documents",
            description:
              "Uploading your business license, tax registration, and liability insurance earns your profile the Verified Pro badge.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#tutorial-docs-notice",
          popover: {
            title: "Submission Flexibility",
            description:
              "Business documents are optional during registration. You can upload them now or skip and upload later in your profile settings.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tutorial-docs-grid",
          popover: {
            title: "Document Upload Cards",
            description:
              "Supports PDF, JPG, and PNG files up to 10MB each. All uploaded documents are strictly encrypted.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#tutorial-docs-buttons",
          popover: {
            title: "Continue to Step 3",
            description:
              "Click 'Next' to proceed to the Portfolio step of the onboarding tutorial.",
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
          <section className="mt-12 w-full max-w-[766px] lg:mt-6">
            <div className="mt-12 w-full max-w-[766px] lg:mt-6">
              <div id="tutorial-docs-header" className="text-center">
                <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#1C1C1C]">
                  Identification and Verification
                </h1>

                <p className="mt-4 text-[16px] leading-5 tracking-[-0.014em] text-black/80">
                  Upload your business license, proof of identity, and certifications.
                </p>
              </div>

              <div
                id="tutorial-docs-notice"
                className="mt-6 flex items-start gap-3.5 rounded-[14px] border border-[#005864]/20 bg-[#005864]/[0.04] p-4 text-left"
              >
                <Info size={20} className="mt-0.5 shrink-0 text-[#005864]" />
                <div className="text-[14px] leading-[21px] text-[#1C1C1C]/80">
                  <p className="font-semibold text-[#005864]">
                    Document Submission Notice
                  </p>
                  <p className="mt-1 text-[#333333]">
                    Uploading business documents is optional at this stage. You may upload your documents and select{" "}
                    <strong className="font-semibold text-[#1C1C1C]">Continue</strong>, or choose{" "}
                    <strong className="font-semibold text-[#1C1C1C]">Skip</strong> to proceed and provide them later.
                  </p>
                </div>
              </div>

              {/* Document Cards Grid */}
              <div id="tutorial-docs-grid" className="mt-10 grid gap-5 md:grid-cols-2">
                {documentFields.map((field) => {
                  const hasFile = Boolean(field.fileName);

                  return (
                    <div key={field.key}>
                      <p className="mb-[7px] text-[14px] font-medium leading-[127.5%] text-[#1C1C1C]">
                        {field.label}
                      </p>

                      <div className="relative flex h-[100px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] border border-[#BEBEBE] bg-[rgba(0,88,100,0.06)] px-3">
                        {hasFile ? (
                          <File size={28} className="text-[#005864]" />
                        ) : (
                          <Upload size={28} className="text-[#005864]" />
                        )}

                        <span className="mt-3 w-full truncate text-center text-[12px] leading-[127.5%] text-[#1C1C1C]">
                          {field.fileName || "Choose file to upload"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div
                id="tutorial-docs-buttons"
                className="mx-auto mt-10 flex w-full max-w-[500px] flex-col gap-4"
              >
                <button
                  type="button"
                  className="block h-12 w-full rounded-[12px] border border-[#005864] bg-transparent text-[16px] font-semibold text-[#005864]"
                >
                  Skip
                </button>
                <button
                  type="button"
                  className="block h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
