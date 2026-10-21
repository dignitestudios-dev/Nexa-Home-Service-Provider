"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { driver, type Driver } from "driver.js";
import { ChevronDown, Filter, RefreshCw, Search, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";
import { getUserDisplayName, getUserInitials } from "@/lib/parse-user-profile";
import { markHomeTutorialCompleted } from "@/lib/onboarding-tutorial-storage";

const DUMMY_FEED_JOBS = [
  {
    id: "emergency-pipe-leak",
    title: "Plumbing Services",
    description:
      "High-pressure pipe burst under kitchen sink. Immediate repair and pipe fitting replacement needed to prevent water damage.",
    type: "One Time",
    when: "Need an expert right away",
    credits: 35,
    location: "*******, Philadelphia, PA",
  },
  {
    id: "hvac-compressor-repair",
    title: "HVAC & Air Conditioning",
    description:
      "Central air conditioner blowing warm air. Compressor making rattling noise and outdoor fan running intermittently.",
    type: "Fixed Price",
    when: "This Week",
    credits: 35,
    location: "South Philadelphia, PA",
  },
  {
    id: "electrical-panel-upgrade",
    title: "Electrical & Wiring",
    description:
      "Upgrade 100A residential panel to 200A service with whole-house surge protector and new breaker labeling.",
    type: "Fixed Price",
    when: "Flexible",
    credits: 30,
    location: "University City, Philadelphia, PA",
  },
  {
    id: "hardwood-floor-refinishing",
    title: "Carpentry & Woodwork",
    description:
      "Sand, stain, and seal 650 sq ft of red oak flooring in living and dining areas. Satin polyurethane finish.",
    type: "Fixed Price",
    when: "Next Week",
    credits: 25,
    location: "Fishtown, Philadelphia, PA",
  },
];

export default function TutorialHomePage() {
  const router = useRouter();
  const driverInstance = useRef<Driver | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const displayName = getUserDisplayName(user) || "Alexander Wright";
  const initials = getUserInitials(displayName) || "AW";

  const handleSkipTutorial = () => {
    if (driverInstance.current) {
      driverInstance.current.destroy();
    }
    markHomeTutorialCompleted(user?._id);
    router.replace("/home");
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
      doneBtnText: "View a Job",
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
          element: "#tutorial-home-welcome",
          popover: {
            title: "Welcome to Your Dashboard",
            description:
              "You're approved! Track your stats, manage credits, and find job requests in your area.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tutorial-home-stats",
          popover: {
            title: "Your Stats",
            description:
              "Track your leads purchased, active jobs, jobs you were hired for, and remaining credits.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#tutorial-available-jobs-heading",
          popover: {
            title: "Available Jobs",
            description:
              "Job requests from users in your service area, matched to the services you offer.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#tutorial-first-job-card",
          popover: {
            title: "View a Job",
            description:
              "Click any job to see the details and purchase the lead.",
            side: "top",
            align: "start",
          },
        },
      ],
      onNextClick: (element, step, { driver: drv }) => {
        if (drv.isLastStep()) {
          drv.destroy();
          router.push("/tutorial/home/jobs/emergency-pipe-leak");
        } else {
          drv.moveNext();
        }
      },
      onDoneClick: () => {
        if (driverInstance.current) {
          driverInstance.current.destroy();
        }
        router.push("/tutorial/home/jobs/emergency-pipe-leak");
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
    <div className="min-h-screen overflow-hidden select-none bg-[#ffff] p-3 md:p-5">
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
                <span className="mt-2 block h-[3px] w-full rounded bg-[#005864]" />
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
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#005864] text-[11px] font-bold text-white">
                2
              </span>
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

      {/* ── Main App Shell Body ── */}
      <div className="mx-auto w-full max-w-[1640px] rounded-[32px] bg-white p-4 md:p-8">
        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Welcome Heading */}
          <div id="tutorial-home-welcome">
            <h1 className="text-[32px] font-bold leading-[40px] text-[#1C1C1C]">
              Welcome back, {displayName}!
            </h1>
            <p className="mt-1 text-[16px] text-black/70">
              Explore new homeowner opportunities in your service area.
            </p>
          </div>

          {/* Search Bar & Refresh */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex h-12 w-full items-center gap-2 rounded-[24px] border border-[#E0EBEB] bg-[#F8F8F8] px-4 sm:w-[320px]">
              <Search size={18} className="text-black/50" />
              <input
                type="text"
                placeholder="Search jobs..."
                readOnly
                className="w-full bg-transparent text-sm text-[#1C1C1C] outline-none"
              />
              <button type="button" className="text-[#005864]">
                <Filter size={18} />
              </button>
            </div>

            <div className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-[24px] border border-[#E0EBEB] bg-white px-5 text-[14px] font-semibold text-[#005864] shadow-xs">
              <RefreshCw className="h-4 w-4 text-[#005864]" />
              <span>Refresh</span>
            </div>
          </div>
        </div>

        {/* Home Stats */}
        <div id="tutorial-home-stats" className="mt-8 flex flex-wrap gap-4">
          <div className="relative h-[118px] w-[206px] overflow-hidden rounded-[12px] bg-[#005864] p-5">
            <div className="absolute -left-2 top-10 h-[117px] w-[117px] rounded-full bg-[#D7DF23] blur-[80px]" />
            <div className="relative min-w-0">
              <p className="truncate font-[700] text-[36px] leading-[45px] text-white">
                0
              </p>
              <p className="truncate text-[16px] leading-6 text-white">
                Total Jobs Purchased
              </p>
            </div>
          </div>

          <div className="relative h-[118px] w-[206px] overflow-hidden rounded-[12px] bg-[#005864] p-5">
            <div className="absolute -left-2 top-10 h-[117px] w-[117px] rounded-full bg-[#D7DF23] blur-[80px]" />
            <div className="relative min-w-0">
              <p className="truncate font-[700] text-[36px] leading-[45px] text-white">
                0
              </p>
              <p className="truncate text-[16px] leading-6 text-white">
                Hired
              </p>
            </div>
          </div>

          <div className="relative h-[118px] w-[206px] overflow-hidden rounded-[12px] bg-[#005864] p-5">
            <div className="absolute -left-2 top-10 h-[117px] w-[117px] rounded-full bg-[#D7DF23] blur-[80px]" />
            <div className="relative min-w-0">
              <p className="truncate font-[700] text-[36px] leading-[45px] text-white">
                50
              </p>
              <p className="truncate text-[16px] leading-6 text-white">
                Available Credits
              </p>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <h2
          id="tutorial-available-jobs-heading"
          className="mt-8 text-[24px] font-[700] leading-[30px] text-black"
        >
          Available Jobs
        </h2>

        {/* Available Jobs Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DUMMY_FEED_JOBS.map((job, idx) => (
            <div
              key={job.id}
              id={idx === 0 ? "tutorial-first-job-card" : undefined}
              onClick={() => {
                if (idx === 0) {
                  if (driverInstance.current) {
                    driverInstance.current.destroy();
                  }
                  router.push("/tutorial/home/jobs/emergency-pipe-leak");
                }
              }}
              className="block cursor-pointer rounded-[12px] bg-[#F8F8F8] p-4 transition-all hover:shadow-md"
            >
              <h3 className="text-[18px] font-[600] leading-[23px] text-[#1C1C1C]">
                {job.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-[16px] leading-[22px] text-black/80">
                {job.description}
              </p>
              <p className="mt-3 text-[16px] font-[500] leading-5 text-[#005864]">
                {job.type}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] bg-[rgba(0,88,100,0.06)] px-3 py-2">
                <div className="min-w-0">
                  <span className="block text-[12px] leading-[15px] text-[#1C1C1C]">
                    When
                  </span>
                  <span className="mt-0.5 block text-[14px] font-semibold leading-5 text-[#005864]">
                    {job.when}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <span className="block text-[12px] leading-[15px] text-[#1C1C1C]">
                    Credits
                  </span>
                  <span className="mt-0.5 block text-[14px] font-semibold leading-5 text-[#005864]">
                    {job.credits}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
