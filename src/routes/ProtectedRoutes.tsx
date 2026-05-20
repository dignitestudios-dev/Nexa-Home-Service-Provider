"use client";
import { RootState } from "@/store/index";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getRedirectPath } from "@/lib/auth-utils";
import { getPendingVerifyEmail, setPendingVerifyEmail } from "@/lib/verify-email-storage";

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
] as const;

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

    const redirectPath = getRedirectPath(user);

    const isOnHomeArea =
      pathname === "/home" || pathname.startsWith("/profile-settings");

    if (redirectPath === "/home" && isOnHomeArea) {
      return;
    }

    if (pathname === redirectPath) {
      return;
    }

    if (redirectPath === "/auth/verify-email") {
      const email =
        user?.email?.trim().toLowerCase() ||
        user?.primaryIdentifier?.trim().toLowerCase() ||
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
