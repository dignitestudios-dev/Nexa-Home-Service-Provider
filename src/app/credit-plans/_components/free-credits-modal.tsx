"use client";

import { Sparkles, Gift } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type FreeCreditsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function FreeCreditsModal({
  open,
  onOpenChange,
}: FreeCreditsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] overflow-hidden rounded-[24px] border border-[#005864]/20 bg-white p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#005864]/10 text-[#005864] ring-8 ring-[#005864]/5">
            <Gift className="h-8 w-8 text-[#005864]" />
          </div>

          <div className="mt-4 flex items-center gap-1.5 rounded-full bg-[#005864]/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-[#005864]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pilot Program Offer</span>
          </div>

          <DialogTitle className="mt-3 text-[26px] font-bold leading-tight text-[#005864] sm:text-[28px]">
            1,500 Free Credits
          </DialogTitle>

          <p className="mt-3 text-[14px] leading-relaxed text-[#2D3748]">
            Credits will be automatically added to your account within 24 hours of successful account verification.
          </p>

          <div className="mt-5 w-full rounded-[16px] bg-[#F4F9FA] p-4 text-left border border-[#005864]/15">
            <p className="text-[14px] font-semibold text-[#181818]">
              Enjoy Free Credits During Our Pilot!
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#565656]">
              Explore NexaHome, connect with homeowners, and use your 1,500 complimentary credits to experience the platform.
            </p>
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-[#718096]">
            Your free credits are available for a limited time during the pilot program. Once the pilot ends, any remaining credits will be reset to zero. You will then be able to purchase credit packages to continue using NexaHome.
          </p>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="mt-6 h-12 w-full rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white transition hover:bg-[#004751] focus:outline-none focus:ring-2 focus:ring-[#005864] focus:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

