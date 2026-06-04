"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";

import CancelSubscriptionDialog from "./cancel-subscription-dialog";
import { Button } from "@/components/ui/button";
import {
  formatSubscriptionPlanPrice,
} from "@/lib/parse-subscription-plans-response";
import type { SubscriptionPlan } from "@/types/subscription-plan.types";
import Image from "next/image";

const DEFAULT_FEATURES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
] as const;

type PlanPriceSize = "hero" | "card" | "inline";

function getPlanPriceParts(
  plan?: SubscriptionPlan,
  fallbackPrice?: string,
): { amount: string; interval: string } {
  if (plan) {
    const suffix = plan.interval === "year" ? "year" : "month";
    return { amount: `$${plan.amount}`, interval: `/${suffix}` };
  }

  const price = fallbackPrice?.trim() ?? "";
  const match = price.match(/^(\$[\d,.]+)(\/\w+)$/i);
  if (match) {
    return { amount: match[1], interval: match[2] };
  }

  return { amount: price, interval: "" };
}

function PlanPriceDisplay({
  plan,
  price,
  size = "hero",
  compact = false,
}: {
  plan?: SubscriptionPlan;
  price?: string;
  size?: PlanPriceSize;
  compact?: boolean;
}) {
  const { amount, interval } = getPlanPriceParts(plan, price);

  const amountClass =
    size === "hero"
      ? compact
        ? "text-[40px] leading-[46px]"
        : "text-[56px] leading-[64px]"
      : size === "card"
        ? compact
          ? "text-[24px] leading-7"
          : "text-[32px] leading-9"
        : "text-[28px] leading-9";

  const intervalClass =
    size === "hero"
      ? compact
        ? "text-[15px] leading-5"
        : "text-[18px] leading-6"
      : size === "card"
        ? compact
          ? "text-[12px] leading-4"
          : "text-[14px] leading-5"
        : "text-[13px] leading-5";

  return (
    <span className="inline-flex items-baseline text-[#005864]">
      <span className={`font-[800] tracking-[-0.02em] ${amountClass}`}>{amount}</span>
      {interval ? (
        <span className={`ml-0.5 font-[600] ${intervalClass}`}>{interval}</span>
      ) : null}
    </span>
  );
}

type SettingsSubscriptionPlanProps = {
  title: string;
  variant: "service" | "verified-badge";
  price?: string;
  planName?: string;
  packageName?: string;
  expiryLabel?: string;
  features?: readonly string[];
  plans?: SubscriptionPlan[];
  selectedPlanId?: string | null;
  onSelectPlan?: (planId: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onCancelSubscription?: (planId: string) => void | Promise<void>;
  isCancelling?: boolean;
  onPurchasePlan?: (planId: string) => void;
  isPurchasing?: boolean;
  compact?: boolean;
};

function PlanSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto mt-10 w-full max-w-[494px] text-center">
        <div className="mx-auto h-10 w-40 rounded bg-[#E8E8E8]" />
        <div className="mx-auto mt-3 h-8 w-56 rounded bg-[#E8E8E8]" />
      </div>

      <div className="mx-auto mt-8 w-full max-w-[494px] rounded-[24px] bg-[rgba(0,88,100,0.06)] px-6 py-8">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-4 w-full rounded bg-[#E8E8E8]" />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 h-5 w-72 max-w-full rounded bg-[#E8E8E8]" />
      <div className="mx-auto mt-4 h-12 w-full max-w-[494px] rounded-[12px] bg-[#E8E8E8]" />
    </div>
  );
}

export default function SettingsSubscriptionPlan({
  title,
  variant,
  price,
  planName,
  packageName = "Package Name",
  expiryLabel,
  features = DEFAULT_FEATURES,
  plans = [],
  selectedPlanId,
  onSelectPlan,
  isLoading = false,
  isError = false,
  onRetry,
  onCancelSubscription,
  isCancelling = false,
  onPurchasePlan,
  isPurchasing = false,
  compact = false,
}: SettingsSubscriptionPlanProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ??
    plans.find((plan) => plan.isSubscribed) ??
    plans[0];

  const displayPrice = selectedPlan
    ? formatSubscriptionPlanPrice(selectedPlan)
    : price ?? "";
  const displayPlanName = selectedPlan?.name ?? planName;
  const displayFeatures =
    selectedPlan?.description.length ? selectedPlan.description : features;
  const displayExpiryLabel =
    expiryLabel ??
    (selectedPlan?.isSubscribed
      ? "Your subscription is currently active."
      : "Choose a plan to get started.");
  const isPlanSubscribed = selectedPlan?.isSubscribed ?? false;
  const isVerifiedBadgeActive =
    variant === "verified-badge" && (selectedPlan?.isBadgeEligible ?? false);
  const showCancelButton = Boolean(selectedPlan && isPlanSubscribed);
  const showBuyButton = Boolean(selectedPlan && !isPlanSubscribed);
  const isBuyNowDisabled = isPurchasing || isVerifiedBadgeActive;

  const handleCancelSubscription = () => {
    if (!selectedPlan?.id || isCancelling) return;
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancelSubscription = async () => {
    if (!selectedPlan?.id) return;
    await onCancelSubscription?.(selectedPlan.id);
  };

  const handlePurchasePlan = () => {
    if (!selectedPlan?.id || isPurchasing) return;
    onPurchasePlan?.(selectedPlan.id);
  };

  return (
    <div className="mx-auto flex w-full max-w-[866px] flex-col">
      <CancelSubscriptionDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        planName={displayPlanName}
        onConfirm={handleConfirmCancelSubscription}
        isConfirming={isCancelling}
      />

      <h2
        className={`font-[700] text-[#1C1C1C] ${
          compact
            ? "text-[24px] leading-[26px] text-center"
            : "text-[24px] leading-[30px] text-center"
        }`}
      >
        {title}
      </h2>

      {isLoading ? (
        <PlanSkeleton />
      ) : isError ? (
        <div className="mx-auto mt-10 w-full max-w-[494px] rounded-[12px] bg-white px-6 py-10 text-center">
          <p className="text-[16px] leading-[26px] text-[rgba(24,24,24,0.8)]">
            Unable to load subscription plans. Please try again.
          </p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : (
        <>
          {variant === "service" && plans.length > 1 ? (
            <div
              className={`mx-auto flex w-full max-w-[494px] flex-col gap-3 sm:flex-row ${
                compact ? "mt-5" : "mt-8"
              }`}
            >
              {plans.map((plan) => {
                const isSelected = selectedPlan?.id === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => onSelectPlan?.(plan.id)}
                    className={`relative flex-1 rounded-[16px] border text-left transition ${
                      compact ? "px-3 py-3" : "px-4 py-4"
                    } ${
                      isSelected
                        ? "border-[#005864] bg-[rgba(0,88,100,0.06)]"
                        : "border-transparent bg-[#F8F8F8] hover:bg-[#F3F5F5]"
                    }`}
                  >
                    {plan.isSubscribed ? (
                      <span className="absolute right-2 top-2 rounded-full bg-[#005864] px-2 py-0.5 text-[10px] font-[600] leading-4 text-white">
                        Active
                      </span>
                    ) : null}
                    <p
                      className={`pr-12 font-[600] text-[#1C1C1C] ${
                        compact
                          ? "text-[14px] leading-[18px]"
                          : "text-[16px] leading-5"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <div className="mt-1.5">
                      <PlanPriceDisplay plan={plan} size="card" compact={compact} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {variant === "service" ? (
            <div
              className={`mx-auto w-full max-w-[494px] text-center ${
                compact ? "mt-6" : "mt-10"
              }`}
            >
              <PlanPriceDisplay
                plan={selectedPlan}
                price={displayPrice}
                size="hero"
                compact={compact}
              />
              {displayPlanName ? (
                <p
                  className={`mt-1.5 font-[600] capitalize tracking-[-0.008em] text-[#1C1C1C] ${
                    compact
                      ? "text-[22px] leading-[28px]"
                      : "text-[30px] leading-[38px]"
                  }`}
                >
                  {displayPlanName}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mx-auto mt-8 flex  items-center justify-center">
              <Image
                src="/asset/verifybadge.png"
                alt="Verified badge"
                width={100}
                height={100}
                className="h-[130px] w-[130px] object-cover"
              />
            </div>
          )}

          <div
            className={`mx-auto w-full max-w-[494px] rounded-[24px] bg-[rgba(0,88,100,0.06)] px-5 ${
              compact ? "mt-5 py-5" : "mt-8 px-6 py-8"
            }`}
          >
            {variant === "verified-badge" ? (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-[24px] font-[600] capitalize leading-[30px] text-[#005864]">
                  {displayPlanName ?? packageName}
                </p>
                <PlanPriceDisplay
                  plan={selectedPlan}
                  price={displayPrice}
                  size="inline"
                  compact={compact}
                />
              </div>
            ) : null}

            <ul
              className={`list-disc pl-5 marker:text-[#005864] ${
                compact ? "space-y-3" : "space-y-5"
              }`}
            >
              {displayFeatures.map((feature) => (
                <li
                  key={feature}
                  className={`pl-1 text-[#1C1C1C] ${
                    compact
                      ? "text-[14px] leading-5 tracking-[0.04px]"
                      : "text-[16px] leading-6 tracking-[0.08px]"
                  }`}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <p
            className={`mx-auto w-full max-w-[494px] text-center font-[600] text-black ${
              compact
                ? "mt-5 text-[14px] leading-[18px]"
                : "mt-8 text-[16px] leading-5"
            }`}
          >
            {displayExpiryLabel}
          </p>

          {showBuyButton ? (
            <div className="mx-auto mt-3 w-full max-w-[494px]">
              <Button
                type="button"
                onClick={handlePurchasePlan}
                disabled={isBuyNowDisabled}
                className={`w-full cursor-pointer rounded-[12px] bg-[#005864] px-[10px] font-[600] capitalize text-white hover:bg-[#004d57] disabled:cursor-not-allowed disabled:opacity-60 ${
                  compact
                    ? "h-10 py-2 text-[14px] leading-[18px]"
                    : "h-12 py-3 text-[16px] leading-5"
                }`}
              >
                {isPurchasing ? "Processing..." : "Buy Now"}
              </Button>
              {isVerifiedBadgeActive ? (
                <p className="mt-3 text-center text-[14px] leading-5 text-[rgba(24,24,24,0.7)]">
                  You already have a verified badge on your profile.
                </p>
              ) : null}
            </div>
          ) : null}

          {showCancelButton ? (
            <div className="mx-auto mt-3 w-full max-w-[494px]">
              <Button
                type="button"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className={`w-full cursor-pointer rounded-[12px] bg-[#005864] px-[10px] font-[600] capitalize text-white hover:bg-[#004d57] disabled:cursor-not-allowed disabled:opacity-60 ${
                  compact
                    ? "h-10 py-2 text-[14px] leading-[18px]"
                    : "h-12 py-3 text-[16px] leading-5"
                }`}
              >
                {isCancelling ? "Cancelling..." : "Cancel Subscription"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
