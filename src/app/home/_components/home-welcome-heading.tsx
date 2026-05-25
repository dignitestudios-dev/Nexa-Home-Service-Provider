"use client";

import { useSelector } from "react-redux";

import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import {
  getUserDisplayName,
  truncateDisplayName,
} from "@/lib/parse-user-profile";
import type { RootState } from "@/store/index";

export default function HomeWelcomeHeading() {
  const { isLoading } = useCurrentUserQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const displayName = truncateDisplayName(getUserDisplayName(user));

  return (
    <h1 className="text-[32px] font-[600] leading-10 text-black">
      {isLoading ? "Welcome..." : `Welcome ${displayName}!`}
    </h1>
  );
}
