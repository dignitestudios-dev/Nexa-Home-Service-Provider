"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { AD_HISTORY_QUERY_KEY } from "@/hooks/advertisement/use-ad-history-query";
import { SUBSCRIPTION_PLANS_QUERY_KEY } from "@/hooks/billing/use-subscription-plans-query";

const PAYMENT_SUCCESS_GIF =
  "https://i.pinimg.com/originals/89/86/fe/8986fef7a58272135c7c5d006a312554.gif";

export default function AdPromotionSuccessPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_PLANS_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: AD_HISTORY_QUERY_KEY });
  }, [queryClient]);

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col items-center px-2 py-10 text-center">
      <img
        src={PAYMENT_SUCCESS_GIF}
        alt="Ad promotion purchase successful"
        className="h-[120px] w-[120px] object-contain"
      />
      <h2 className="mt-6 text-[32px] font-semibold leading-[40px] text-black">
        Ad Promotion Successful
      </h2>
      <p className="mt-4 text-[16px] leading-6 text-[#565656]">
        Your advertisement has been submitted successfully. Your promotion
        will be active once payment is confirmed.
      </p>
      <Link
        href="/profile-settings/ad-promotion"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#005864] px-8 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        Back to Ad Promotion
      </Link>
    </div>
  );
}
