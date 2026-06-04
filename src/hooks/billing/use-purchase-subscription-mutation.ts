"use client";

import { useMutation } from "@tanstack/react-query";

import {
  SERVICE_PLAN_CANCEL_PATH,
  SERVICE_PLAN_SUCCESS_PATH,
  getBillingRedirectUrl,
} from "@/lib/billing-redirect-urls";
import { parseCheckoutSessionUrl } from "@/lib/parse-checkout-session";
import { toast } from "@/lib/toast";
import { billingService } from "@/services/billing.service";

type PurchaseSubscriptionVariables = {
  planId: string;
  success_url?: string;
  cancel_url?: string;
};

export function usePurchaseSubscriptionMutation() {
  return useMutation({
    mutationFn: ({
      planId,
      success_url = getBillingRedirectUrl(SERVICE_PLAN_SUCCESS_PATH),
      cancel_url = getBillingRedirectUrl(SERVICE_PLAN_CANCEL_PATH),
    }: PurchaseSubscriptionVariables) =>
      billingService.purchaseSubscription({
        planId,
        success_url,
        cancel_url,
      }),
    onSuccess: (response) => {
      const checkoutUrl = parseCheckoutSessionUrl(response);

      if (!checkoutUrl) {
        toast.error("Checkout URL not found. Please try again.");
        return;
      }

      window.location.href = checkoutUrl;
    },
    onError: (error) => {
      toast.fromApiError(
        error,
        "Failed to start subscription checkout. Please try again.",
      );
    },
  });
}
