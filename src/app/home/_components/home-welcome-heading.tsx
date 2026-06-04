"use client";

import { useSelector } from "react-redux";

import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import {
  getUserDisplayName,
} from "@/lib/parse-user-profile";
import type { RootState } from "@/store/index";

import HomeAddressSelector from "./home-address-selector";

export default function HomeWelcomeHeading() {
  const { isLoading } = useCurrentUserQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const welcomeName = getUserDisplayName(user);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <h1 className="max-w-full break-words text-[32px] font-[600] leading-10 text-black">
        {isLoading ? (
          "Welcome..."
        ) : (
          <>
            Welcome{" "}
            <span className="break-words">{welcomeName}!</span>
          </>
        )}
      </h1>

      <HomeAddressSelector />
    </div>
  );
}
