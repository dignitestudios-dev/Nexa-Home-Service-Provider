"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import SettingsSubscriptionPlan from "@/app/profile-settings/_components/settings-subscription-plan";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCancelSubscriptionMutation } from "@/hooks/billing/use-cancel-subscription-mutation";
import { usePurchaseSubscriptionMutation } from "@/hooks/billing/use-purchase-subscription-mutation";
import { useSubscriptionPlansQuery } from "@/hooks/billing/use-subscription-plans-query";
import {
  getBillingRedirectUrl,
  PROFILE_SETUP_PLAN_CANCEL_PATH,
  PROFILE_SETUP_PLAN_SUCCESS_PATH,
} from "@/lib/billing-redirect-urls";

type ServicePlanUpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  onBeforeCheckout?: () => void | Promise<void>;
};

export function ServicePlanUpgradeModal({
  open,
  onClose,
  onBeforeCheckout,
}: ServicePlanUpgradeModalProps) {
  const { data: plans = [], isLoading, isError, refetch } =
    useSubscriptionPlansQuery({ type: "category", enabled: open });
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] w-[calc(100%-2rem)] max-w-[580px] gap-0 overflow-hidden rounded-[24px] border-0 bg-white p-0"
      >
        <DialogTitle className="sr-only">Service Plan</DialogTitle>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#181818] hover:bg-black/5"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <div className="max-h-[90vh] overflow-y-auto px-5 pb-6 pt-5">
          <SettingsSubscriptionPlan
            title="Service Plan"
            variant="service"
            compact
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
            onPurchasePlan={(planId) => {
              void Promise.resolve(onBeforeCheckout?.()).finally(() => {
                purchaseSubscriptionMutation.mutate({
                  planId,
                  success_url: getBillingRedirectUrl(PROFILE_SETUP_PLAN_SUCCESS_PATH),
                  cancel_url: getBillingRedirectUrl(PROFILE_SETUP_PLAN_CANCEL_PATH),
                });
              });
            }}
            isPurchasing={purchaseSubscriptionMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
