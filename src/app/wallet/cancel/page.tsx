"use client";

import Link from "next/link";

import MainAppShell from "@/components/layout/main-app-shell";

const PAYMENT_CANCEL_GIF =
  "https://i0.wp.com/nrifuture.com/wp-content/uploads/2022/05/comp_3.gif?fit=800%2C600&ssl=1";

export default function WalletCancelPage() {
  return (
    <MainAppShell>
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center px-6 py-16 text-center">
        <img
          src={PAYMENT_CANCEL_GIF}
          alt="Payment cancelled"
          className="h-[120px] w-[120px] object-cover rounded-full"
        />
        <h1 className="mt-6 text-[32px] font-semibold leading-[40px] text-black">
          Payment Cancelled
        </h1>
        <p className="mt-4 text-[16px] leading-6 text-[#565656]">
          Your checkout was cancelled. No charges were made to your account.
        </p>
        <Link
          href="/credit-plans"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#005864] px-8 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Try Again
        </Link>
      </div>
    </MainAppShell>
  );
}
