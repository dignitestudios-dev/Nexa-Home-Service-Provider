"use client";

import { TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FREE_PROFILE_SERVICE_LIMIT } from "@/lib/schemas/profile-setup.schema";

interface ServiceLimitModalProps {
  open: boolean;
  onClose: () => void;
  onUpgradePlan?: () => void;
  maxServices?: number;
}

export function ServiceLimitModal({
  open,
  onClose,
  onUpgradePlan,
  maxServices = FREE_PROFILE_SERVICE_LIMIT,
}: ServiceLimitModalProps) {
  const handleUpgradePlan = () => {
    onClose();
    onUpgradePlan?.();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[460px] max-w-[calc(100%-2rem)] rounded-[24px] bg-white p-0 border-0"
      >
        <div className="flex flex-col items-center px-8 pb-8 pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
            <TriangleAlert className="text-white" size={32} strokeWidth={2} />
          </div>

          <DialogTitle className="mt-6 text-center text-[24px] font-semibold leading-[30px] tracking-[-0.008em] text-[#1C1C1C]">
            Service Limit Reached
          </DialogTitle>

          <DialogDescription className="mt-3 text-center text-[15px] leading-[22px] text-black/80">
            You can select up to {maxServices} services. To add more services,
            please upgrade to the Advance Plan.
          </DialogDescription>

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
              onClick={handleUpgradePlan}
              className="h-11 cursor-pointer rounded-[12px] bg-[#005864] text-[13px] font-[600] leading-[16px] text-white transition hover:opacity-95"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
