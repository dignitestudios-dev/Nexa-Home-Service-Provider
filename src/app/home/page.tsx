"use client";

import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import MainAppShell from "@/components/layout/main-app-shell";
import HomeWelcomeHeading from "./_components/home-welcome-heading";
import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import { getUserDisplayName } from "@/lib/parse-user-profile";
import type { RootState } from "@/store/index";

const stats = [
  { value: "500", label: "Total Jobs Purchased" },
  { value: "8", label: "Hired" },
  { value: "700", label: "Available Credits" },
] as const;

const cardTitles = [
  "Need an expert right away",
  "Researching options",
  "Need an expert right away",
  "Ready to hire",
  "Need an expert right away",
  "Need an expert right away",
  "Need an expert right away",
  "Researching options",
  "Need an expert right away",
  "Need an expert right away",
  "Need an expert right away",
  "Need an expert right away",
] as const;

function ServiceCard({ title }: { title: string }) {
  return (
    <article className="rounded-[12px] bg-[#F8F8F8] p-4">
      <h3 className="text-[18px] font-[600] leading-[23px] text-[#1C1C1C]">Service Name</h3>
      <p className="mt-2 line-clamp-2 text-[16px] leading-[22px] text-black/80">
        Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae
        facilisi.
      </p>
      <p className="mt-3 text-[16px] font-[500] leading-5 text-[#005864]">{title}</p>
      <div className="mt-4 rounded-[12px] bg-[rgba(0,88,100,0.06)] px-3 py-2">
        <span className="text-[12px] leading-[15px] text-[#1C1C1C]">When: Today, 11:30 AM</span>
      </div>
    </article>
  );
}

export default function ServiceProviderHomePage() {
  return (
    <MainAppShell>
        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <HomeWelcomeHeading />

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="flex h-12 items-center gap-2 rounded-[24px] bg-[#F9FAFA] px-5 sm:w-[417px]">
              <Search className="h-[18px] w-[18px] text-[#005864]" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent text-[14px] text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C]"
              />
            </div>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#005864]"
            >
              <SlidersHorizontal className="h-5 w-5 text-[#FBFBFB]" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="relative h-[118px] w-[206px] overflow-hidden rounded-[12px] bg-[#005864] p-5"
            >
              <div className="absolute -left-2 top-10 h-[117px] w-[117px] rounded-full bg-[#D7DF23] blur-[80px]" />
              <div className="relative">
                <p className="text-[36px] font-[700] leading-[45px] text-white">{item.value}</p>
                <p className="text-[16px] leading-6 text-white">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-[24px] font-[700] leading-[30px] text-black">Available Jobs</h2>

        <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cardTitles.map((title, index) => (
            <ServiceCard key={`${title}-${index}`} title={title} />
          ))}
        </section>

        <div className="mt-10 flex justify-end">
          <div className="flex h-12 items-center gap-4 rounded-[24px] bg-[#F8F8F8] px-3">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,88,100,0.06)]"
            >
              <ChevronLeft className="h-4 w-4 text-[#005864]" />
            </button>
            <span className="text-[16px] font-[500] leading-5 text-black">01</span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#005864]"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
    </MainAppShell>
  );
}
