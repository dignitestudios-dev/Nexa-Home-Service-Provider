"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  SUBSCRIPTION_PLANS_QUERY_KEY,
} from "@/hooks/billing/use-subscription-plans-query";
import { toast } from "@/lib/toast";
import { billingService } from "@/services/billing.service";

export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) =>
      billingService.cancelSubscription({ planId }),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({
        queryKey: SUBSCRIPTION_PLANS_QUERY_KEY,
      });
      toast.fromApiSuccess(response, "Subscription cancelled successfully.");
    },
  });
}
