"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import SubscriptionPurchaseResultModal from "@/components/auth/subscription-purchase-result-modal";
import { SUBSCRIPTION_PLANS_QUERY_KEY } from "@/hooks/billing/use-subscription-plans-query";
import { CURRENT_USER_QUERY_KEY } from "@/hooks/user/use-current-user-query";

type ProfileSetupPlanPurchaseModalsProps = {
  onTryAgain: () => void;
};

function PlanPurchaseReturnHandler({
  onTryAgain,
}: ProfileSetupPlanPurchaseModalsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const planPurchase = searchParams.get("planPurchase");

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "cancel" | null>(null);

  useEffect(() => {
    if (planPurchase === "success" || planPurchase === "cancel") {
      setStatus(planPurchase);
      setOpen(true);

      if (planPurchase === "success") {
        void queryClient.invalidateQueries({
          queryKey: SUBSCRIPTION_PLANS_QUERY_KEY,
        });
        void queryClient.invalidateQueries({
          queryKey: CURRENT_USER_QUERY_KEY,
        });
      }
    }
  }, [planPurchase, queryClient]);

  const clearReturnQuery = () => {
    setOpen(false);
    router.replace("/onboarding/profile-setup");
  };

  const handleTryAgain = () => {
    setOpen(false);
    router.replace("/onboarding/profile-setup");
    onTryAgain();
  };

  if (!status) {
    return null;
  }

  return (
    <SubscriptionPurchaseResultModal
      open={open}
      status={status}
      onClose={clearReturnQuery}
      onTryAgain={status === "cancel" ? handleTryAgain : undefined}
    />
  );
}

export default function ProfileSetupPlanPurchaseModals({
  onTryAgain,
}: ProfileSetupPlanPurchaseModalsProps) {
  return (
    <Suspense fallback={null}>
      <PlanPurchaseReturnHandler onTryAgain={onTryAgain} />
    </Suspense>
  );
}
