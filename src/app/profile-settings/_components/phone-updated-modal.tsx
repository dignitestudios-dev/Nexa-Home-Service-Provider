"use client";

import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhoneUpdatedModalProps {
  open: boolean;
  onClose: () => void;
}

export function PhoneUpdatedModal({ open, onClose }: PhoneUpdatedModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[360px] max-w-[calc(100%-2rem)] gap-0 rounded-[24px] border-0 bg-white p-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#181818] hover:bg-black/5"
          aria-label="Close modal"
        >
          <X size={22} strokeWidth={1.8} />
        </button>

        <div className="flex flex-col items-center gap-8 px-9 pb-9 pt-[33px]">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
            <Check className="text-white" size={40} strokeWidth={4} />
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <DialogTitle className="text-[24px] font-[600] capitalize leading-[30px] tracking-[-0.008em] text-[#181818]">
              Phone Number Updated
            </DialogTitle>

            <DialogDescription className="max-w-[308px] text-[16px] font-[400] leading-5 text-[#565656]">
              Your number has been updated successfully.
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
