"use client";

import { Check, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type JobPurchasedSuccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function JobPurchasedSuccessModal({
  open,
  onClose,
}: JobPurchasedSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[515px] max-w-[calc(100%-2rem)] gap-0 rounded-[24px] border-0 bg-white p-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#181818] hover:bg-black/5"
          aria-label="Close modal"
        >
          <X size={22} strokeWidth={1.8} />
        </button>

        <div className="flex flex-col items-center px-[43px] py-[46px]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
            <Check className="text-white" size={40} strokeWidth={3.2} />
          </div>

          <DialogTitle className="mt-8 text-center text-[32px] font-semibold capitalize leading-10 tracking-[-0.008em] text-[#1C1C1C]">
            Job Purchased Successfully!
          </DialogTitle>

          <DialogDescription className="mt-4 text-center text-[18px] leading-[23px] text-black/80">
            You have successfully purchased this job lead.
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
