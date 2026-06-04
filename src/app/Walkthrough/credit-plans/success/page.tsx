"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { WALKTHROUGH_VERIFIED_BADGE_PATH } from "@/lib/walkthrough-storage";
import { PROVIDER_DASHBOARD_QUERY_KEY } from "@/hooks/wallet/use-provider-dashboard-query";

const PAYMENT_SUCCESS_GIF =
  "https://i.pinimg.com/originals/89/86/fe/8986fef7a58272135c7c5d006a312554.gif";

export default function WalkthroughCreditSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: PROVIDER_DASHBOARD_QUERY_KEY });
  }, [queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center px-2 py-10 text-center">
        <img
          src={PAYMENT_SUCCESS_GIF}
          alt="Payment successful"
          className="h-[120px] w-[120px] object-contain"
        />
        <h2 className="mt-6 text-[32px] font-semibold leading-[40px] text-black">
          Payment Successful
        </h2>
        <p className="mt-4 text-[16px] leading-6 text-[#565656]">
          Your credits have been added to your wallet. You&apos;re all set to start
          exploring jobs on your dashboard.
        </p>
        <button
          type="button"
          onClick={() => router.replace(WALKTHROUGH_VERIFIED_BADGE_PATH)}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#005864] px-8 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
