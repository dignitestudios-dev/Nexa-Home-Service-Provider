"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { getPersistedAuthUser } from "@/lib/auth-session";
import { isEmailOtpAuthPath } from "@/lib/auth-otp-paths";
import { getRedirectPath } from "@/lib/auth-utils";
import { isOnboardingPath } from "@/lib/onboarding-steps";
import type { RootState } from "@/store/index";

/** Keeps verified users from returning to OTP screens via the browser back button. */
export function PreventOtpBackNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!isOnboardingPath(pathname)) return;

    const effectiveUser = user ?? getPersistedAuthUser();
    if (!effectiveUser?.isEmailVerified) return;

    const redirectPath = getRedirectPath(effectiveUser);

    const handlePopState = () => {
      if (isEmailOtpAuthPath(window.location.pathname)) {
        router.replace(redirectPath);
        return;
      }

      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname, router, user]);

  return null;
}
