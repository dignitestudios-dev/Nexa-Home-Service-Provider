"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsMenu } from "./settings-menu";

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[24px] bg-[#F8F8F8] p-6">
      <div className="space-y-4">
        {settingsMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full cursor-pointer items-center justify-between rounded-[12px] border px-3 py-4 text-left transition ${
                isActive
                  ? "border-transparent bg-[#005864] text-white"
                  : "border-[#F1F1F1] bg-white text-black"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-[18px] w-[18px]" />
                <span className={`text-[16px] ${isActive ? "font-[500]" : "font-[400]"}`}>
                  {item.label}
                </span>
              </span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
