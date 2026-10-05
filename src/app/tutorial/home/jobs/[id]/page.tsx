"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { driver, type Driver } from "driver.js";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  Play,
  Sparkles,
  Bell,
  X,
} from "lucide-react";
import { markHomeTutorialCompleted } from "@/lib/onboarding-tutorial-storage";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";
import { getUserDisplayName, getUserInitials } from "@/lib/parse-user-profile";

function InfoRow({
  label,
  value,
  valueClassName = "text-[#005864]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[16px] leading-6 text-[rgba(24,24,24,0.8)]">{label}</span>
      <span className={`text-right text-[16px] font-medium leading-6 ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}

export default function TutorialJobDetailPage() {
  const router = useRouter();
  const driverInstance = useRef<Driver | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const displayName = getUserDisplayName(user) || "Alexander Wright";
  const initials = getUserInitials(displayName) || "AW";

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

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
      doneBtnText: "Purchase Job",
      progressText: "{{current}} of {{total}}",
      overlayClickBehavior: "none",
      steps: [
        {
          element: "#tutorial-job-detail-info",
          popover: {
            title: "Job Scope & Requirements",
            description:
              "Inspect homeowner description, urgency, preferred contact methods, and credits required before purchasing.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#tutorial-client-details-card",
          popover: {
            title: "Homeowner Contact Details",
            description:
              "Client phone number and exact address are safely masked until the lead is unlocked with your credits.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#tutorial-purchase-job-btn",
          popover: {
            title: "Purchase the Job Lead",
            description:
              "Click 'Purchase Job' to unlock homeowner phone and address details using 15 of your available credits.",
            side: "top",
            align: "center",
          },
        },
      ],
      onNextClick: (element, step, { driver: drv }) => {
        if (drv.isLastStep()) {
          drv.destroy();
          setIsPurchaseModalOpen(true);
        } else {
          drv.moveNext();
        }
      },
      onDoneClick: () => {
        if (driverInstance.current) {
          driverInstance.current.destroy();
        }
        setIsPurchaseModalOpen(true);
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
  }, []);

  const handleConfirmPurchase = () => {
    setIsPurchaseModalOpen(false);
    setIsPurchased(true);

    setTimeout(() => {
      markHomeTutorialCompleted(user?._id);
      router.replace("/home");
    }, 1600);
  };

  return (
    <div className="min-h-screen select-none bg-[#ffff] p-3 md:p-5">
      {/* ── Exact Home Header ── */}
      <header className="rounded-[50px] bg-[#F8F8F8] px-10 py-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex shrink-0 items-center gap-3">
            <Image
              src="/asset/darklogo.png"
              alt="NexaHome"
              width={200}
              height={200}
              className="h-auto w-[200px]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <nav className="flex items-center gap-2" aria-label="Main navigation">
              <span className="rounded-full px-4 py-3 text-[16px] font-[600] leading-5 text-[#005864]">
                Home
              </span>
              <span className="rounded-full px-4 py-3 text-[16px] font-[400] leading-5 text-black/70">
                My Jobs
              </span>
              <span className="rounded-full px-4 py-3 text-[16px] font-[400] leading-5 text-black/70">
                Wallet
              </span>
            </nav>

            <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#EFEFEF] text-[#181818]">
              <Bell size={20} />
            </div>

            <div className="flex items-center gap-2 rounded-full px-2 py-1">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#005864] text-sm font-[700] text-white">
                {initials}
              </div>
              <ChevronDown size={18} className="text-[#181818]" />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Shell ── */}
      <div className="mx-auto w-full max-w-[1640px] rounded-[32px] bg-white p-4 md:p-8">
        <div className="mx-auto w-full max-w-[1470px]">
          {/* Header Title Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/tutorial/home"
                className="flex h-12 w-12 shrink-0 items-center justify-center p-3 text-[rgba(24,24,24,0.8)]"
              >
                <ArrowLeft className="h-6 w-6" strokeWidth={2} />
              </Link>
              <h1 className="text-[32px] font-semibold leading-[40px] text-[#1C1C1C]">
                Job Detail
              </h1>
            </div>

            <span className="flex h-[40px] items-center justify-center rounded-full bg-[#005864] px-5 text-[16px] font-semibold capitalize leading-5 text-white">
              Available
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-6 xl:flex-row xl:items-stretch">
            {/* Left Column (Max 900px) */}
            <div id="tutorial-job-detail-info" className="flex w-full max-w-[900px] flex-col gap-6">
              {/* Category & Description */}
              <section className="rounded-[18px] bg-[#F8F8F8] p-6">
                <h2 className="text-[24px] font-bold capitalize leading-[22px] text-[#1C1C1C]">
                  Plumbing Services
                </h2>
                <p className="mt-[10px] whitespace-pre-wrap break-words text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
                  High-pressure water line cracked under kitchen sink and is actively leaking. Need an emergency licensed plumber immediately to diagnose, replace joint fittings, and confirm pipe integrity.
                </p>
              </section>

              {/* Info Rows */}
              <section className="rounded-[12px] bg-[#F8F8F8] px-6 py-6">
                <div className="flex flex-col gap-3">
                  <InfoRow label="Posted Date:" value="Today, 10:45 AM" />
                  <InfoRow label="Status:" value="Available" valueClassName="text-[#005864]" />
                  <InfoRow label="Job Type:" value="Urgent (Today)" />
                  <InfoRow label="Contact Preferences:" value="Phone Call, SMS" />
                  <InfoRow label="Credits:" value="15" />
                </div>
              </section>

              {/* Attachments */}
              <section className="rounded-[12px] bg-[#F8F8F8] px-4 py-6">
                <h3 className="text-[16px] font-semibold capitalize leading-[22px] text-[#1C1C1C]">
                  Attachment
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[12px] bg-[rgba(0,88,100,0.12)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=140&auto=format&fit=crop&q=80"
                      alt="Attachment 1"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[12px] bg-[rgba(0,88,100,0.12)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=140&auto=format&fit=crop&q=80"
                      alt="Attachment 2"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="rounded-[12px] bg-[#F8F8F8] px-4 py-6">
                <h3 className="text-[16px] font-semibold capitalize leading-[22px] text-[#1C1C1C]">
                  Location
                </h3>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[16px] font-medium capitalize leading-5 text-[#1C1C1C]">
                      Home Location
                    </p>
                    <p className="mt-2 max-w-[413px] break-words text-[16px] leading-5 text-[rgba(24,24,24,0.8)]">
                      {isPurchased
                        ? "1420 Market Street, Apt 4B, Philadelphia, PA 19102"
                        : "Center City, Philadelphia, PA (Masked)"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex h-[42px] shrink-0 items-center justify-center rounded-[6px] bg-[#005864] px-[15px] text-[16px] font-medium leading-5 text-white"
                  >
                    View on map
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column: Homeowner Contact & Purchase Action */}
            <div className="flex w-full flex-1 flex-col gap-6">
              <section
                id="tutorial-client-details-card"
                className="flex flex-1 flex-col justify-between rounded-[18px] bg-[#F8F8F8] p-6"
              >
                <div>
                  <h2 className="text-[24px] font-bold capitalize leading-[22px] text-[#1C1C1C]">
                    Client Detail
                  </h2>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#005864] text-lg font-bold text-white">
                      SJ
                    </div>
                    <div>
                      <h3 className="text-[18px] font-semibold text-[#1C1C1C]">Sarah J.</h3>
                      <p className="text-sm text-black/60">Verified Homeowner</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-3 text-[16px] text-[#1C1C1C]">
                      <Phone className="h-5 w-5 text-[#005864]" />
                      <span>{isPurchased ? "(555) 349-8821" : "(555) ***-****"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[16px] text-[#1C1C1C]">
                      <Mail className="h-5 w-5 text-[#005864]" />
                      <span>{isPurchased ? "sarah.jenkins@gmail.com" : "s***@gmail.com"}</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <div id="tutorial-purchase-job-btn" className="mt-8">
                  {isPurchased ? (
                    <div className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-emerald-600 font-semibold text-white">
                      <CheckCircle2 size={20} />
                      <span>Lead Unlocked Successfully!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsPurchaseModalOpen(true)}
                      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white shadow-md transition hover:bg-[#004852]"
                    >
                      <span>Purchase Job</span>
                    </button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* ── Exact Purchase Job Modal ── */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-[490px] rounded-[24px] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-[#005864]">
                Purchase Lead
              </span>
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#005864]/10 text-[#005864]">
                <Sparkles size={32} />
              </div>
              <h3 className="mt-4 text-[22px] font-bold text-[#1C1C1C]">
                Unlock Homeowner Details
              </h3>
              <p className="mt-2 text-sm text-black/70">
                Are you sure you want to purchase this lead? <strong>15 Credits</strong> will be deducted from your balance.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-[#F8F8F8] p-4 text-sm">
              <div className="flex justify-between py-1 text-black/80">
                <span>Available Credits:</span>
                <span className="font-semibold text-[#005864]">50</span>
              </div>
              <div className="flex justify-between py-1 text-black/80">
                <span>Lead Cost:</span>
                <span className="font-semibold text-red-500">15 Credits</span>
              </div>
              <div className="mt-2 border-t border-gray-200 pt-2 flex justify-between font-bold text-[#1C1C1C]">
                <span>Balance After Purchase:</span>
                <span className="text-[#005864]">35 Credits</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="h-12 flex-1 rounded-[12px] border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="h-12 flex-1 rounded-[12px] bg-[#005864] text-sm font-semibold text-white shadow-md hover:bg-[#004852]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
