"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import MainAppShell from "@/components/layout/main-app-shell";
import { PROVIDER_DASHBOARD_QUERY_KEY } from "@/hooks/wallet/use-provider-dashboard-query";

const PAYMENT_SUCCESS_GIF =
  "https://i.pinimg.com/originals/89/86/fe/8986fef7a58272135c7c5d006a312554.gif";

export default function WalletSuccessPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: PROVIDER_DASHBOARD_QUERY_KEY });
  }, [queryClient]);

  return (
    <MainAppShell>
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center px-6 py-16 text-center">
        <img
          src={PAYMENT_SUCCESS_GIF}
          alt="Payment successful"
          className="h-[120px] w-[120px] object-contain"
        />
        <h1 className="mt-6 text-[32px] font-semibold leading-[40px] text-black">
          Payment Successful
        </h1>
        <p className="mt-4 text-[16px] leading-6 text-[#565656]">
          Your credits have been added to your wallet. You can start purchasing
          jobs right away.
        </p>
        <Link
          href="/credit-plans"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#005864] px-8 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to Credit Plans
        </Link>
      </div>
    </MainAppShell>
  );
}
