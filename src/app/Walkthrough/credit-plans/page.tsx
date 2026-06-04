"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CreditPlansContent from "@/app/credit-plans/_components/credit-plans-content";
import {
  WALKTHROUGH_CREDIT_CANCEL_PATH,
  WALKTHROUGH_CREDIT_SUCCESS_PATH,
} from "@/lib/billing-redirect-urls";
import { WALKTHROUGH_VERIFIED_BADGE_PATH } from "@/lib/walkthrough-storage";

export default function WalkthroughCreditPlansPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const goToVerifiedBadge = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.replace(WALKTHROUGH_VERIFIED_BADGE_PATH);
  };

  return (
    <>
      {isNavigating ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <span
            className="h-10 w-10 animate-spin rounded-full border-4 border-[#005864] border-t-transparent"
            aria-hidden="true"
          />
            <p className="mt-4 text-[16px] leading-5 text-black/70">
            Loading verified badge plan...
          </p>
        </div>
      ) : null}

      <div className="min-h-screen w-full bg-white p-3 md:p-5">
        <div className="mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-[1200px] rounded-[32px] bg-white px-4 py-8 md:px-8">
          <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-3 text-center">
            <p className="text-[14px] font-[500] uppercase tracking-[0.08em] text-[#005864]">
              Step 2 of 3
            </p>
            <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#181818] capitalize md:text-[36px] md:leading-[44px]">
              Choose Your Credit Plan
            </h1>
            
          </div>

          <CreditPlansContent
            titleClassName="sr-only"
            containerClassName="mx-auto w-full max-w-[700px] pb-4 pt-2"
            checkoutSuccessPath={WALKTHROUGH_CREDIT_SUCCESS_PATH}
            checkoutCancelPath={WALKTHROUGH_CREDIT_CANCEL_PATH}
            footer={
              <div className="mx-auto mt-4 flex w-full max-w-[500px] flex-col gap-3">
                <button
                  type="button"
                  onClick={goToVerifiedBadge}
                  disabled={isNavigating}
                  className="h-11 w-full rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[15px] font-semibold leading-5 text-[#005864] transition hover:bg-[rgba(0,88,100,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Skip for Now
                </button>
              
              </div>
            }
          />
        </div>
      </div>
    </>
  );
}
