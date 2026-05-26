"use client";

import { useState } from "react";
import { MapPin, Phone, Star, SquarePen } from "lucide-react";
import Image from "next/image";
import MainAppShell from "@/components/layout/main-app-shell";
import { BasicInfoTab } from "./_components/basic-info-tab";
import ProfileJobStats from "./_components/profile-job-stats";
import { PortfolioTab } from "./_components/portfolio-tab";
import { ReviewsTab } from "./_components/reviews-tab";
import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  formatDisplayPhone,
  getUserDisplayName,
  getUserInitials,
  getUserProfilePictureUrl,
} from "@/lib/parse-user-profile";

// ── Main Profile Page ────────────────────────────────────────────────────────

const TABS = ["Basic Info", "Portfolio", "Reviews"] as const;
type Tab = (typeof TABS)[number];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Basic Info");

  const { data: currentUser } = useCurrentUserQuery();
  const storedUser = useSelector((state: RootState) => state.auth.user);
  const user = currentUser ?? storedUser;

  const companyName = user?.companyName?.trim() ?? "";
  const userName = user?.name?.trim() ?? "";
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(displayName);
  const profilePicture = getUserProfilePictureUrl(user);

  return (
    <MainAppShell>
      <div className="mt-10 px-0">
        <div className="flex items-start justify-between mb-6">
          {/* Page Heading */}
          <h1 className=" text-[32px] font-semibold leading-[40px] text-[#1C1C1C]">
            Profile
          </h1>
          {/* Edit Button */}
          <button
            type="button"
            className="  flex items-center gap-[8px] rounded-[16px] bg-[#005864] px-8 py-3 shadow-[0px_10px_24px_rgba(0,0,0,0.04)]"
          >
            <SquarePen className="h-5 w-5 text-white" />

            <span className="text-[16px] font-semibold capitalize text-white">
              Edit
            </span>
          </button>
        </div>
        {/* Profile Card */}
        <div className="relative mb-6 rounded-[12px] bg-[#F8F8F8] px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="relative h-[154px] w-[154px] shrink-0">
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt={displayName}
                    width={154}
                    height={154}
                    className="h-full w-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[rgba(0,88,100,0.15)] text-4xl font-bold text-[#005864] select-none">
                    {initials}
                  </div>
                )}

                {/* Online indicator */}
                <span className="absolute bottom-2 right-5 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <h2 className="text-[32px] font-semibold capitalize leading-[40px] text-[#1C1C1C]">
                    {companyName || userName || "User Name Not Available"}
                  </h2>
                  {companyName && userName ? (
                    <p className="text-[16px] leading-[20px] text-[rgba(24,24,24,0.6)]">
                      {userName}
                    </p>
                  ) : null}
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "fill-[#EDAF35] text-[#EDAF35]" : "fill-none text-[rgba(24,24,24,0.3)]"}`}
                    />
                  ))}
                  <span className="ml-1 text-[16px] leading-[20px] text-[#181818]">
                    4.5
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-[16px] leading-[20px] text-[rgba(24,24,24,0.8)]">
                  <MapPin className="h-4 w-4 text-[#005864]" />
                  Los Angeles, United States
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1 text-[16px] leading-[22px] tracking-[-0.408px] text-[#005864]">
                  <Phone className="h-4 w-4" />
                  {formatDisplayPhone(user?.phone)}
                </div>
              </div>
            </div>
            {/* Stat Cards */}
            <ProfileJobStats />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 inline-flex rounded-[12px] bg-[#F8F8F8] p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`h-[38px] w-[167px] rounded-[8px] text-[16px] cursor-pointer capitalize transition-all duration-200 ${activeTab === tab
                  ? "bg-[#005864] font-medium text-white"
                  : "bg-white font-normal text-[rgba(24,24,24,0.8)]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-w-0 overflow-hidden rounded-[12px] bg-[#F8F8F8] p-6">
          {activeTab === "Basic Info" && (
            <BasicInfoTab overview={user?.overview} user={user} />
          )}
          {activeTab === "Portfolio" && <PortfolioTab />}
          {activeTab === "Reviews" && <ReviewsTab />}
        </div>
      </div>
    </MainAppShell>
  );
}
