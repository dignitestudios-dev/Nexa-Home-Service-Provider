"use client";

import { useEffect, useMemo, useState } from "react";

import SettingsSubscriptionPlan from "../_components/settings-subscription-plan";
import { useCancelSubscriptionMutation } from "@/hooks/billing/use-cancel-subscription-mutation";
import { usePurchaseSubscriptionMutation } from "@/hooks/billing/use-purchase-subscription-mutation";
import { useSubscriptionPlansQuery } from "@/hooks/billing/use-subscription-plans-query";

export default function ServicePlanPage() {
  const { data: plans = [], isLoading, isError, refetch } =
    useSubscriptionPlansQuery({ type: "category" });
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
      title="Service Plan"
      variant="service"
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
      onPurchasePlan={(planId) => purchaseSubscriptionMutation.mutate({ planId })}
      isPurchasing={purchaseSubscriptionMutation.isPending}
    />
  );
}
