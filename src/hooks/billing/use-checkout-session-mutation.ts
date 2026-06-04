"use client";

import { useMutation } from "@tanstack/react-query";

import {
  BILLING_CANCEL_PATH,
  BILLING_SUCCESS_PATH,
  getBillingRedirectUrl,
} from "@/lib/billing-redirect-urls";
import { parseCheckoutSessionUrl } from "@/lib/parse-checkout-session";
import { toast } from "@/lib/toast";
import { billingService } from "@/services/billing.service";

type CheckoutSessionVariables = {
  amount: number;
  success_url?: string;
  cancel_url?: string;
};

export function useCheckoutSessionMutation() {
  return useMutation({
    mutationFn: ({
      amount,
      success_url = getBillingRedirectUrl(BILLING_SUCCESS_PATH),
      cancel_url = getBillingRedirectUrl(BILLING_CANCEL_PATH),
    }: CheckoutSessionVariables) =>
      billingService.createCheckoutSession({
        amount,
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
      toast.fromApiError(error, "Failed to start checkout. Please try again.");
    },
  });
}
