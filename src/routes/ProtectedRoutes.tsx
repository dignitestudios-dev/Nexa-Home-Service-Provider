"use client";
import { RootState } from "@/store/index";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getRedirectPath } from "@/lib/auth-utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  console.log("🚀 ~ ProtectedRoute ~ user: 18-->", user);

  const isLoggedIn = Boolean(isAuthenticated);
  console.log("🚀 ~ ProtectedRoute ~ isLoggedIn:", isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    const redirectPath = getRedirectPath(user);
    console.log("🚀 ~ ProtectedRoute ~ redirectPath:", redirectPath);
    if (
      redirectPath !== "/app/dashboard" &&
      !pathname.startsWith("/onboarding")
    ) {
      router.push(redirectPath);
      return;
    }
  }, [isLoggedIn, user, pathname, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
