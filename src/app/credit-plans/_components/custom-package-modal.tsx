"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  BASE_CREDIT_RATE,
  MIN_CUSTOM_CREDITS,
  MAX_CUSTOM_CREDITS,
  calculateCreditPackagePrice,
  formatCreditPrice,
} from "@/lib/credit-pricing";

type CustomPackageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (payload: { credits: number; price: number }) => void;
  isConfirming?: boolean;
};

export default function CustomPackageModal({
  open,
  onOpenChange,
  onConfirm,
  isConfirming = false,
}: CustomPackageModalProps) {
  const [creditsInput, setCreditsInput] = useState(
    String(BASE_CREDIT_RATE.credits),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setCreditsInput(String(BASE_CREDIT_RATE.credits));
    setErrorMessage(null);
  }, [open]);

  const parsedCredits = Number(creditsInput.replace(/\D/g, ""));
  const credits = Number.isFinite(parsedCredits) ? parsedCredits : 0;
  const price = calculateCreditPackagePrice(credits);

  const handleCreditsChange = (value: string) => {
    setCreditsInput(value.replace(/\D/g, ""));
    setErrorMessage(null);
  };

  const handleConfirm = () => {
    if (!credits || credits < MIN_CUSTOM_CREDITS) {
      setErrorMessage(`Minimum ${MIN_CUSTOM_CREDITS} credits required.`);
      return;
    }

    if (credits > MAX_CUSTOM_CREDITS) {
      setErrorMessage(`Maximum ${MAX_CUSTOM_CREDITS.toLocaleString("en-US")} credits allowed.`);
      return;
    }

    onConfirm?.({ credits, price });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[525px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] border-none p-0 shadow-xl"
      >
        <DialogTitle className="sr-only">Custom credit package</DialogTitle>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-[30px] top-5 flex h-10 w-10 items-center justify-center"
          aria-label="Close custom package modal"
        >
          <X className="h-5 w-5 text-[#181818]" strokeWidth={1.8} />
        </button>

        <div className="px-10 pb-10 pt-8">
          <p className="text-[16px] font-medium capitalize leading-5 tracking-[-0.018em] text-[#1C1C1C]">
            Custom Package
          </p>

          <p className="mt-3 text-[14px] leading-[22px] text-[rgba(24,24,24,0.8)]">
            Choose how many credits you want to buy. Pricing is calculated at{" "}
            {formatCreditPrice(BASE_CREDIT_RATE.price)} for{" "}
            {BASE_CREDIT_RATE.credits.toLocaleString("en-US")} credits.
          </p>

          <div className="mt-6">
            <label
              htmlFor="custom-credits"
              className="text-[14px] font-medium leading-5 text-[#1C1C1C]"
            >
              Credits
            </label>
            <Input
              id="custom-credits"
              type="text"
              inputMode="numeric"
              value={creditsInput}
              onChange={(event) => handleCreditsChange(event.target.value)}
              placeholder="Enter credits"
              className="mt-2 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] text-[#1C1C1C] shadow-none focus-visible:ring-0"
            />
            <p className="mt-2 text-[12px] leading-4 text-black/60">
              Min {MIN_CUSTOM_CREDITS.toLocaleString("en-US")} · Max{" "}
              {MAX_CUSTOM_CREDITS.toLocaleString("en-US")} credits
            </p>
          </div>

          <div className="mt-6 rounded-[8px] bg-[#F9FAFA] px-4 py-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[14px] leading-[18px] text-[rgba(24,24,24,0.8)]">
                Selected Credits
              </span>
              <span className="text-[24px] font-bold leading-[30px] text-[#005864]">
                {credits > 0 ? credits.toLocaleString("en-US") : "0"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 border-t border-[#E4E4E4] pt-3">
              <span className="text-[16px] font-medium leading-5 text-black">
                Total Price
              </span>
              <span className="text-[24px] font-bold leading-[30px] text-[#1C1C1C]">
                {formatCreditPrice(price)}
              </span>
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-3 text-sm text-[#F01A1A]">{errorMessage}</p>
          ) : null}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="mt-6 h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-semibold leading-5 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
