"use client";

import Link from "next/link";

const PAYMENT_CANCEL_GIF =
  "https://i0.wp.com/nrifuture.com/wp-content/uploads/2022/05/comp_3.gif?fit=800%2C600&ssl=1";

export default function WalkthroughVerifiedBadgeCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="mx-auto flex w-full max-w-[600px] flex-col items-center px-2 py-10 text-center">
        <img
          src={PAYMENT_CANCEL_GIF}
          alt="Verified badge purchase cancelled"
          className="h-[120px] w-[120px] rounded-full object-cover"
        />
        <h2 className="mt-6 text-[32px] font-semibold leading-[40px] text-black">
          Purchase Cancelled
        </h2>
        <p className="mt-4 text-[16px] leading-6 text-[#565656]">
          Your verified badge checkout was cancelled. No charges were made to your
          account.
        </p>
        <Link
          href="/Walkthrough/verified-badge"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#005864] px-8 text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to Trusted Expert Badge
        </Link>
      </div>
    </div>
  );
}
