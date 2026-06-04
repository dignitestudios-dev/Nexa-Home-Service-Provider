"use client";
import { RootState } from "@/store/index";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthTokenCookie, getPersistedAuthUser } from "@/lib/auth-session";
import { isEmailOtpAuthPath } from "@/lib/auth-otp-paths";
import { getRedirectPath } from "@/lib/auth-utils";
import {
  canAccessOnboardingPath,
  getNextOnboardingStepPath,
  isOnboardingComplete,
  isOnboardingPath,
  isPostIdentityOnboardingPath,
} from "@/lib/onboarding-steps";
import {
  hasCompletedWalkthrough,
  isWalkthroughPath,
  shouldRequireWalkthrough,
  WALKTHROUGH_PATH,
} from "@/lib/walkthrough-storage";
import { isPasswordResetFlow } from "@/lib/reset-password-storage";
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

/** OTP success modal must close before redirect (signup-verify-otp page). */
const isSignupOtpHoldPath = (path: string) =>
  path === "/auth/signup-verify-otp" ||
  path.startsWith("/auth/signup-verify-otp/");

const BILLING_RETURN_PATHS = [
  "/profile-settings/service-plan/success",
  "/profile-settings/service-plan/cancel",
  "/profile-settings/verified-badge-plan/success",
  "/profile-settings/verified-badge-plan/cancel",
  "/profile-settings/ad-promotion/success",
  "/profile-settings/ad-promotion/cancel",
  "/Walkthrough/credit-plans/success",
  "/Walkthrough/credit-plans/cancel",
  "/Walkthrough/verified-badge/success",
  "/Walkthrough/verified-badge/cancel",
  "/wallet/success",
  "/wallet/cancel",
] as const;

const isBillingReturnPath = (path: string) =>
  BILLING_RETURN_PATHS.some(
    (billingPath) =>
      path === billingPath || path.startsWith(`${billingPath}/`),
  );

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
      const hasStoredAuth = Boolean(
        getAuthTokenCookie() || getPersistedAuthUser(),
      );

      if (!isPublicAuthPath && !hasStoredAuth) {
        router.replace("/auth/login");
      }
      return;
    }

    if (isBillingReturnPath(pathname)) {
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

    if (
      effectiveUser.isEmailVerified &&
      isEmailOtpAuthPath(pathname) &&
      !isSignupOtpHoldPath(pathname)
    ) {
      router.replace(getRedirectPath(effectiveUser));
      return;
    }

    if (isSignupOtpHoldPath(pathname)) {
      return;
    }

    const redirectPath = getRedirectPath(effectiveUser);

    const isOnHomeArea =
      pathname === "/home" || pathname.startsWith("/profile-settings");

    if (isPostIdentityOnboardingPath(pathname)) {
      return;
    }

    if (isWalkthroughPath(pathname)) {
      if (!isOnboardingComplete(effectiveUser)) {
        router.replace(getNextOnboardingStepPath(effectiveUser));
        return;
      }

      if (hasCompletedWalkthrough(effectiveUser._id)) {
        router.replace("/home");
        return;
      }

      return;
    }

    if (
      isOnboardingComplete(effectiveUser) &&
      shouldRequireWalkthrough(effectiveUser._id) &&
      !isPostIdentityOnboardingPath(pathname)
    ) {
      router.replace(WALKTHROUGH_PATH);
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
      router.replace(getNextOnboardingStepPath(effectiveUser));
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
      hasCompletedWalkthrough(effectiveUser._id)
    ) {
      router.replace("/home");
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
