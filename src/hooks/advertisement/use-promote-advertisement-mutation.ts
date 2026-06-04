"use client";

import { useMutation } from "@tanstack/react-query";

import {
  AD_PROMOTION_CANCEL_PATH,
  AD_PROMOTION_SUCCESS_PATH,
  getBillingRedirectUrl,
} from "@/lib/billing-redirect-urls";
import { parseCheckoutSessionUrl } from "@/lib/parse-checkout-session";
import { toast } from "@/lib/toast";
import { advertisementService } from "@/services/advertisement.service";
import type { PromoteAdvertisementPayload } from "@/types/advertisement.types";

type PromoteAdvertisementVariables = Omit<
  PromoteAdvertisementPayload,
  "success_url" | "cancel_url"
> & {
  success_url?: string;
  cancel_url?: string;
};

export function usePromoteAdvertisementMutation() {
  return useMutation({
    mutationFn: ({
      success_url = getBillingRedirectUrl(AD_PROMOTION_SUCCESS_PATH),
      cancel_url = getBillingRedirectUrl(AD_PROMOTION_CANCEL_PATH),
      ...payload
    }: PromoteAdvertisementVariables) =>
      advertisementService.promote({
        ...payload,
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
        "Failed to start ad promotion checkout. Please try again.",
      );
    },
  });
}
