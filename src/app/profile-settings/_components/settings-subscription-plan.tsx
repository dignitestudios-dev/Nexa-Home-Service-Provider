"use client";

import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_FEATURES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis interdum purus, eu placerat eros.",
] as const;

type SettingsSubscriptionPlanProps = {
  title: string;
  variant: "service" | "verified-badge";
  price: string;
  planName?: string;
  packageName?: string;
  expiryLabel?: string;
  features?: readonly string[];
};

export default function SettingsSubscriptionPlan({
  title,
  variant,
  price,
  planName,
  packageName = "Package Name",
  expiryLabel = "Your subscription will expire on 30 September",
  features = DEFAULT_FEATURES,
}: SettingsSubscriptionPlanProps) {
  const handleCancelSubscription = () => {
    // TODO: wire cancel subscription API
  };

  return (
    <div className="mx-auto flex w-full max-w-[766px] flex-col">
      <h2 className="text-[24px] font-[700] leading-[30px] text-[#1C1C1C]">{title}</h2>

      {variant === "service" ? (
        <div className="mx-auto mt-10 w-full max-w-[494px] text-center">
          <p className="text-[36px] font-[700] capitalize leading-[45px] text-[#005864]">
            {price}
          </p>
          {planName ? (
            <p className="mt-2 text-[30px] font-[600] capitalize leading-[38px] tracking-[-0.008em] text-[#1C1C1C]">
              {planName}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mx-auto mt-8 flex h-[138px] w-[138px] items-center justify-center rounded-full bg-[rgba(0,88,100,0.06)]">
          <BadgeCheck className="h-[62px] w-[51px] text-[#005864]" strokeWidth={1.5} />
        </div>
      )}

      <div className="mx-auto mt-8 w-full max-w-[494px] rounded-[24px] bg-[rgba(0,88,100,0.06)] px-6 py-8">
        {variant === "verified-badge" ? (
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <p className="text-[24px] font-[600] capitalize leading-[30px] text-[#005864]">
              {packageName}
            </p>
            <p className="text-[32px] font-[700] capitalize leading-10 text-[#005864]">
              {price}
            </p>
          </div>
        ) : null}

        <ul className="space-y-5">
          {features.map((feature) => (
            <li
              key={feature.slice(0, 40)}
              className="text-[16px] leading-6 tracking-[0.08px] text-[#1C1C1C]"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="mx-auto mt-8 w-full max-w-[494px] text-center text-[16px] font-[600] leading-5 text-black">
        {expiryLabel}
      </p>

      <div className="mx-auto mt-4 w-full max-w-[494px]">
        <Button
          type="button"
          onClick={handleCancelSubscription}
          className="h-12 w-full cursor-pointer rounded-[12px] bg-[#005864] px-[10px] py-3 text-[16px] font-[600] capitalize leading-5 text-white hover:bg-[#004d57]"
        >
          Cancel Subscription
        </Button>
      </div>
    </div>
  );
}
