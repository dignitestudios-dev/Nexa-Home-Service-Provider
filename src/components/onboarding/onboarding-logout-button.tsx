"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { useLogoutAuth } from "@/hooks/auth/use-auth-mutations";
import { clearAuthSession } from "@/lib/auth-session";

export default function OnboardingLogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutAuth();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      clearAuthSession(dispatch);
    }

    queryClient.clear();
    router.replace("/auth/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      aria-label="Log out"
      title="Log out"
      className="fixed right-30 top-4 z-[100] inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-red-500 text-[#fff] transition hover:bg-[#005864] disabled:cursor-not-allowed disabled:opacity-60 md:right-30 md:top-10 lg:right-30 lg:top-12"
      >
      <LogOut className="h-5 w-5" strokeWidth={2} />
    </button>
  );
}
