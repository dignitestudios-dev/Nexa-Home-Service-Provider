"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseSubscriptionPlansFromResponse } from "@/lib/parse-subscription-plans-response";
import { billingService } from "@/services/billing.service";
import type { SubscriptionPlanType } from "@/types/subscription-plan.types";
import type { RootState } from "@/store/index";

export const SUBSCRIPTION_PLANS_QUERY_KEY = ["billing", "subscription-plans"] as const;

type UseSubscriptionPlansQueryOptions = {
  type?: SubscriptionPlanType;
  enabled?: boolean;
};

export function useSubscriptionPlansQuery({
  type = "category",
  enabled = true,
}: UseSubscriptionPlansQueryOptions = {}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: [...SUBSCRIPTION_PLANS_QUERY_KEY, type],
    queryFn: async () => {
      const response = await billingService.getSubscriptionPlans({ type });
      return parseSubscriptionPlansFromResponse(response);
    },
    enabled: enabled && (hasToken || isAuthenticated),
  });
}
