"use client";

import { useEffect, useMemo, useState } from "react";

import SettingsSubscriptionPlan from "../_components/settings-subscription-plan";
import { useCancelSubscriptionMutation } from "@/hooks/billing/use-cancel-subscription-mutation";
import { usePurchaseSubscriptionMutation } from "@/hooks/billing/use-purchase-subscription-mutation";
import { useSubscriptionPlansQuery } from "@/hooks/billing/use-subscription-plans-query";
import {
  VERIFIED_BADGE_PLAN_CANCEL_PATH,
  VERIFIED_BADGE_PLAN_SUCCESS_PATH,
  getBillingRedirectUrl,
} from "@/lib/billing-redirect-urls";

const VERIFIED_BADGE_FEATURES = [
  "After 5 completed jobs, you can add the badge for $9.99/month.",
  "Keep a 4.0★ average rating or higher. If it drops below that, you have until the end of your billing cycle to bring it back up before the badge is removed.",
  "Cancel anytime from your profile.",
] as const;

export default function VerifiedBadgePlanPage() {
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

  return (
    <SettingsSubscriptionPlan
      title="Trusted Expert Badge"
      variant="verified-badge"
      plans={plans}
      selectedPlanId={selectedPlanId}
      onSelectPlan={setSelectedPlanId}
      features={VERIFIED_BADGE_FEATURES}
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
          success_url: getBillingRedirectUrl(VERIFIED_BADGE_PLAN_SUCCESS_PATH),
          cancel_url: getBillingRedirectUrl(VERIFIED_BADGE_PLAN_CANCEL_PATH),
        })
      }
      isPurchasing={purchaseSubscriptionMutation.isPending}
    />
  );
}
