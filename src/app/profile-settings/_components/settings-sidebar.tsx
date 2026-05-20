"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsMenu } from "./settings-menu";

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[24px] bg-[#F8F8F8] p-6">
      <div className="flex flex-col gap-4">
        {settingsMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-[12px] border-[0.8px] px-3 text-left transition ${
                isActive
                  ? "border-transparent bg-[#005864] text-white"
                  : "border-[#F9F9F9] bg-white text-black"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-[rgba(24,24,24,0.8)]"}`}
                />
                <span
                  className={`text-[16px] capitalize leading-5 ${isActive ? "font-[500]" : "font-[400]"}`}
                >
                  {item.label}
                </span>
              </span>
              <ChevronRight
                className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-[rgba(24,24,24,0.8)]"}`}
              />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
