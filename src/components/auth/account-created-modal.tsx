"use client";

import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccountCreatedModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  type?: "success" | "error";
}

export function AccountCreatedModal({
  open,
  onClose,
  title = "Email Verified",
  description = "Your email has been verified successfully",
  type = "success",
}: AccountCreatedModalProps) {
  const isError = type === "error";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[515px] max-w-[calc(100%-2rem)] rounded-[24px] bg-white p-0 border-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 w-10 h-10 inline-flex items-center justify-center rounded-full text-[#181818] hover:bg-black/5"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <div className="px-[43px] py-[46px] flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isError
                ? "bg-red-100"
                : "bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]"
            }`}
          >
            {isError ? (
              <X className="text-red-500" size={40} strokeWidth={3.2} />
            ) : (
              <Check className="text-white" size={40} strokeWidth={3.2} />
            )}
          </div>

          <DialogTitle className="mt-8 text-[32px] leading-[40px] tracking-[-0.008em] text-center font-semibold text-[#1C1C1C] capitalize">
            {title}
          </DialogTitle>

          <DialogDescription className="mt-4 text-[18px] leading-[23px] text-center text-black/80">
            {description}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
