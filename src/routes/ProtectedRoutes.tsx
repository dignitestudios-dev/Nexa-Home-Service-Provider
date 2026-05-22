"use client";
import { RootState } from "@/store/index";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getRedirectPath } from "@/lib/auth-utils";
import {
  canAccessOnboardingPath,
  getNextOnboardingStepPath,
  isOnboardingComplete,
  isOnboardingPath,
  isPostIdentityOnboardingPath,
} from "@/lib/onboarding-steps";
import { isPasswordResetFlow } from "@/lib/reset-password-storage";
import { getPersistedAuthUser } from "@/lib/auth-session";
import {
  getPendingVerifyEmail,
  setPendingVerifyEmail,
} from "@/lib/verify-email-storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-otp",
  "/auth/signup-verify-otp",
  "/auth/verify-email",
  "/auth/change-password",
] as const;

const isResetPasswordPath = (path: string) =>
  path === "/auth/change-password" || path.startsWith("/auth/change-password/");

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );

  const isLoggedIn = Boolean(isAuthenticated);
  const isPublicAuthPath = PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  useEffect(() => {
    if (!isLoggedIn) {
      if (!isPublicAuthPath) {
        router.replace("/auth/login");
      }
      return;
    }

    if (isResetPasswordPath(pathname)) {
      return;
    }

    if (
      isPasswordResetFlow() &&
      (isPublicAuthPath || isResetPasswordPath(pathname))
    ) {
      return;
    }

    const effectiveUser = user ?? getPersistedAuthUser();
    if (!effectiveUser) {
      return;
    }

    const redirectPath = getRedirectPath(effectiveUser);

    const isOnHomeArea =
      pathname === "/home" || pathname.startsWith("/profile-settings");

    if (isPostIdentityOnboardingPath(pathname)) {
      return;
    }

    if (isOnboardingPath(pathname)) {
      if (canAccessOnboardingPath(pathname, effectiveUser)) {
        return;
      }
      router.replace(getNextOnboardingStepPath(effectiveUser));
      return;
    }

    if (
      isOnboardingComplete(effectiveUser) &&
      pathname.startsWith("/onboarding") &&
      !isPostIdentityOnboardingPath(pathname)
    ) {
      router.replace("/home");
      return;
    }

    if (redirectPath === "/home" && isOnHomeArea) {
      return;
    }

    if (pathname === redirectPath) {
      return;
    }

    if (
      redirectPath.startsWith("/onboarding") &&
      !isPublicAuthPath &&
      pathname !== redirectPath
    ) {
      router.replace(redirectPath);
      return;
    }

    if (redirectPath === "/auth/verify-email") {
      const email =
        effectiveUser.email?.trim().toLowerCase() ||
        effectiveUser.primaryIdentifier?.trim().toLowerCase() ||
        getPendingVerifyEmail();

      if (email) {
        setPendingVerifyEmail(email);
        router.replace(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        router.replace("/auth/verify-email");
      }
      return;
    }

    router.replace(redirectPath);
  }, [isLoggedIn, isPublicAuthPath, user, pathname, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
