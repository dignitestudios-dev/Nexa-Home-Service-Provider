"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/lib/api-error";

type CancelSubscriptionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName?: string;
  onConfirm?: () => Promise<void> | void;
  isConfirming?: boolean;
};

export default function CancelSubscriptionDialog({
  open,
  onOpenChange,
  planName,
  onConfirm,
  isConfirming = false,
}: CancelSubscriptionDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setErrorMessage(null);
    }
  }, [open]);

  const handleKeep = () => {
    onOpenChange(false);
  };

  const handleConfirmCancel = async () => {
    setErrorMessage(null);

    try {
      await onConfirm?.();
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Failed to cancel subscription. Please try again.",
        ) ?? "Failed to cancel subscription. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="z-[210] w-[360px] max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-[16px] border-0 bg-white p-0 shadow-xl sm:max-w-[360px]"
      >
        <DialogTitle className="sr-only">Cancel subscription</DialogTitle>

        <div className="flex flex-col items-center px-5 pb-5 pt-8">
          <AlertTriangle
            className="h-[42px] w-[42px] text-[#F01A1A]"
            strokeWidth={2.2}
            aria-hidden
          />

          <div className="mt-3 flex w-full max-w-[280px] flex-col items-center gap-2 text-center">
            <h2 className="w-full text-[24px] font-[700] capitalize leading-[30px] text-[#181818]">
              Cancel Subscription
            </h2>
            <p className="w-full text-[16px] font-[400] leading-5 text-[rgba(24,24,24,0.8)]">
              {planName
                ? `Are you sure you want to cancel your ${planName}?`
                : "Are you sure you want to cancel your subscription?"}
            </p>
          </div>

          {errorMessage ? (
            <p className="mt-3 text-center text-[12px] text-[#F01A1A]">
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-6 grid w-full grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleKeep}
              disabled={isConfirming}
              className="h-[49px] cursor-pointer rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[12px] font-[600] leading-[15px] text-[#005864] transition hover:bg-[rgba(0,88,100,0.1)] disabled:opacity-60"
            >
              No
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={isConfirming}
              className="h-[49px] cursor-pointer rounded-[12px] bg-[#F01A1A] text-[12px] font-[600] leading-[15px] text-white transition hover:bg-[#d91717] disabled:opacity-60"
            >
              {isConfirming ? "Cancelling..." : "Yes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
