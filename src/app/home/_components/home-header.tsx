"use client";

import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutAuth } from "@/hooks/auth/use-auth-mutations";
import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import { MAIN_NAV_ITEMS } from "@/lib/main-nav";
import {
  getUserDisplayName,
  getUserInitials,
} from "@/lib/parse-user-profile";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/index";

export default function HomeHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const logoutMutation = useLogoutAuth();
  const { isLoading: isLoadingUser } = useCurrentUserQuery();
  const user = useSelector((state: RootState) => state.auth.user);

  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(displayName);
  const profilePicture = user?.profilePicture?.trim() || null;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync().catch(() => undefined);
    router.push("/auth/login");
  };

  return (
    <header className="rounded-[50px] bg-[#F8F8F8] px-10 py-5">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/home" className="flex shrink-0 items-center gap-3">
          <Image
            src="/asset/darklogo.png"
            alt="NexaHome"
            width={200}
            height={200}
            className="h-auto w-[200px]"
          />
        </Link>

        <div className="flex flex-wrap items-center gap-5">
          <nav className="flex items-center gap-2" aria-label="Main navigation">
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = item.isActive(pathname);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-4 py-3 text-[16px] leading-5 transition-colors ${
                    isActive
                      ? "font-[600] text-[#005864]"
                      : "font-[400] text-black/70 hover:text-black"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {isActive ? (
                    <span className="mt-2 block h-[3px] w-full rounded bg-[#005864]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#181818] transition hover:bg-[#EDEDED]"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition hover:bg-[#EFEFEF]"
              >
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt={displayName}
                    width={46}
                    height={46}
                    className="h-[46px] w-[46px] rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#005864] text-sm font-[700] text-white">
                    {isLoadingUser ? "…" : initials}
                  </div>
                )}
                <span className="max-w-[180px] truncate text-[16px] font-[500] text-[#1C1C1C]">
                  {isLoadingUser ? "Loading..." : displayName}
                </span>
                <ChevronDown className="h-4 w-4 text-black/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[139px] rounded-[8px] border-none bg-white p-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="px-[11px] py-[10px]">
                <DropdownMenuItem
                  onClick={() => router.push("/profile-settings")}
                  className="h-[18px] cursor-pointer rounded-none px-0 text-[14px] font-[500] text-[#1C1C1C] focus:bg-transparent"
                >
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-3 bg-[#E4E4E4]" />
                <DropdownMenuItem
                  onClick={() => router.push("/profile-settings")}
                  className="h-[18px] cursor-pointer rounded-none px-0 text-[14px] font-[500] text-[#1C1C1C] focus:bg-transparent"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-3 bg-[#E4E4E4]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="h-[18px] cursor-pointer rounded-none px-0 text-[14px] font-[500] text-[#FF0000] focus:bg-transparent focus:text-[#FF0000] disabled:opacity-50"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Log Out"}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
