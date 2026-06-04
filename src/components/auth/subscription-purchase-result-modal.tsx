"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const PAYMENT_SUCCESS_GIF =
  "https://i.pinimg.com/originals/89/86/fe/8986fef7a58272135c7c5d006a312554.gif";

const PAYMENT_CANCEL_GIF =
  "https://i0.wp.com/nrifuture.com/wp-content/uploads/2022/05/comp_3.gif?fit=800%2C600&ssl=1";

type SubscriptionPurchaseResultModalProps = {
  open: boolean;
  status: "success" | "cancel";
  onClose: () => void;
  onTryAgain?: () => void;
};

export default function SubscriptionPurchaseResultModal({
  open,
  status,
  onClose,
  onTryAgain,
}: SubscriptionPurchaseResultModalProps) {
  const isSuccess = status === "success";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[460px] max-w-[calc(100%-2rem)] gap-0 rounded-[24px] border-0 bg-white p-0"
      >
        <div className="flex flex-col items-center px-8 pb-8 pt-8">
          <img
            src={isSuccess ? PAYMENT_SUCCESS_GIF : PAYMENT_CANCEL_GIF}
            alt={
              isSuccess
                ? "Subscription purchase successful"
                : "Subscription purchase cancelled"
            }
            className={`object-contain ${
              isSuccess
                ? "h-[96px] w-[96px]"
                : "h-[96px] w-[96px] rounded-full object-cover"
            }`}
          />

          <DialogTitle className="mt-5 text-center text-[24px] font-semibold leading-[30px] text-[#1C1C1C]">
            {isSuccess ? "Subscription Successful" : "Subscription Cancelled"}
          </DialogTitle>

          <DialogDescription className="mt-3 text-center text-[15px] leading-[22px] text-black/80">
            {isSuccess
              ? "Your service plan has been activated successfully. You can now select more services."
              : "Your checkout was cancelled. No charges were made to your account."}
          </DialogDescription>

          {isSuccess ? (
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 w-full cursor-pointer rounded-[12px] bg-[#005864] text-[13px] font-[600] leading-[16px] text-white transition hover:opacity-95"
            >
              Continue
            </button>
          ) : (
            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-11 cursor-pointer rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[13px] font-[600] leading-[16px] text-[#005864] transition hover:bg-[rgba(0,88,100,0.1)]"
              >
                Not Now
              </button>
              <button
                type="button"
                onClick={onTryAgain ?? onClose}
                className="h-11 cursor-pointer rounded-[12px] bg-[#005864] text-[13px] font-[600] leading-[16px] text-white transition hover:opacity-95"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
