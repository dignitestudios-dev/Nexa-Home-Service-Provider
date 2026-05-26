"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseProviderDashboardFromResponse } from "@/lib/parse-provider-dashboard";
import { walletService } from "@/services/wallet.service";
import type { RootState } from "@/store/index";

export const PROVIDER_DASHBOARD_QUERY_KEY = [
  "wallet",
  "provider",
  "dashboard",
] as const;

export function useProviderDashboardQuery() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: PROVIDER_DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const response = await walletService.getProviderDashboard();
      const counts = parseProviderDashboardFromResponse(response);
      if (!counts) {
        throw new Error("Invalid provider dashboard response");
      }
      return counts;
    },
    enabled: hasToken || isAuthenticated,
  });
}
