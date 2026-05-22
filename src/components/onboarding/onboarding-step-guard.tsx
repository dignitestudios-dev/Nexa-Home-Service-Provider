"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { getPersistedAuthUser } from "@/lib/auth-session";
import {
  canAccessOnboardingPath,
  getNextOnboardingStepPath,
  isOnboardingPath,
} from "@/lib/onboarding-steps";
import type { RootState } from "@/store/index";

/** Blocks browser back / direct URL to completed or future onboarding steps. */
export function OnboardingStepGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!isOnboardingPath(pathname)) return;

    const effectiveUser = user ?? getPersistedAuthUser();
    if (!effectiveUser) return;

    if (!canAccessOnboardingPath(pathname, effectiveUser)) {
      router.replace(getNextOnboardingStepPath(effectiveUser));
    }
  }, [pathname, user, router]);

  return null;
}
