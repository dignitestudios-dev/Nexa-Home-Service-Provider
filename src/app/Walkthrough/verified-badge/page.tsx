"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import SettingsSubscriptionPlan from "@/app/profile-settings/_components/settings-subscription-plan";
import { useCancelSubscriptionMutation } from "@/hooks/billing/use-cancel-subscription-mutation";
import { usePurchaseSubscriptionMutation } from "@/hooks/billing/use-purchase-subscription-mutation";
import { useSubscriptionPlansQuery } from "@/hooks/billing/use-subscription-plans-query";
import { getPersistedAuthUser } from "@/lib/auth-session";
import {
  WALKTHROUGH_VERIFIED_BADGE_CANCEL_PATH,
  WALKTHROUGH_VERIFIED_BADGE_SUCCESS_PATH,
  getBillingRedirectUrl,
} from "@/lib/billing-redirect-urls";
import { markWalkthroughCompleted } from "@/lib/walkthrough-storage";
import type { RootState } from "@/store/index";

export default function WalkthroughVerifiedBadgePage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isNavigating, setIsNavigating] = useState(false);
  const { data: plans = [], isLoading, isError, refetch } =
    useSubscriptionPlansQuery({ type: "badge" });
  const cancelSubscriptionMutation = useCancelSubscriptionMutation();
  const purchaseSubscriptionMutation = usePurchaseSubscriptionMutation();

  const defaultSelectedPlanId = useMemo(() => {
    const subscribedPlan = plans.find((plan) => plan.isSubscribed);
    return subscribedPlan?.id ?? plans[0]?.id ?? null;
  }, [plans]);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSelectedPlanId) {
      setSelectedPlanId(defaultSelectedPlanId);
    }
  }, [defaultSelectedPlanId]);

  const hasActiveBadgePlan = useMemo(
    () => plans.some((plan) => plan.isSubscribed),
    [plans],
  );

  const finishWalkthrough = () => {
    if (isNavigating) return;

    setIsNavigating(true);

    const effectiveUser = user ?? getPersistedAuthUser();
    if (effectiveUser?._id) {
      markWalkthroughCompleted(effectiveUser._id);
    }

    router.replace("/home");
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
            Taking you to dashboard...
          </p>
        </div>
      ) : null}

      <div className="min-h-screen w-full bg-white p-3 md:p-5">
        <div className="mx-auto min-h-[calc(100vh-2.5rem)] w-full max-w-[1200px] rounded-[32px] bg-white px-4 py-8 md:px-8">
          <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-3 text-center">
            <p className="text-[14px] font-[500] uppercase tracking-[0.08em] text-[#005864]">
              Step 3 of 3
            </p>
            <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#181818] capitalize md:text-[36px] md:leading-[44px]">
              Verified Badge Plan
            </h1>
            <p className="text-[15px] leading-[22px] tracking-[-0.014em] text-[#565656] md:text-[16px]">
            Boost your credibility with a verified badge. Stand out to homeowners and gain more trust with every job.
            </p>
          </div>

          <div className="mx-auto mt-6 w-full max-w-[866px]">
            <SettingsSubscriptionPlan
              title=""
              variant="verified-badge"
              plans={plans}
              selectedPlanId={selectedPlanId}
              onSelectPlan={setSelectedPlanId}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
              onCancelSubscription={(planId) =>
                cancelSubscriptionMutation.mutateAsync(planId)
              }
              isCancelling={cancelSubscriptionMutation.isPending}
              onPurchasePlan={(planId) =>
                purchaseSubscriptionMutation.mutate({
                  planId,
                  success_url: getBillingRedirectUrl(
                    WALKTHROUGH_VERIFIED_BADGE_SUCCESS_PATH,
                  ),
                  cancel_url: getBillingRedirectUrl(
                    WALKTHROUGH_VERIFIED_BADGE_CANCEL_PATH,
                  ),
                })
              }
              isPurchasing={purchaseSubscriptionMutation.isPending}
            />

            <div className="mx-auto mt-4 flex w-full max-w-[494px] flex-col gap-3">
              <button
                type="button"
                onClick={finishWalkthrough}
                disabled={isNavigating}
                className="h-11 w-full rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[15px] font-semibold leading-5 text-[#005864] transition hover:bg-[rgba(0,88,100,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {hasActiveBadgePlan ? "Continue" : "Skip for Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
