"use client";

import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type LogoutConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isConfirming?: boolean;
};

export default function LogoutConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  isConfirming = false,
}: LogoutConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[360px] max-w-[calc(100%-2rem)] gap-0 rounded-[16px] border-0 bg-white p-0"
      >
        <div className="flex flex-col items-center px-5 pb-6 pt-8">
          <div className="flex h-[42px] w-[42px] items-center justify-center">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
              <AlertTriangle className="h-[22px] w-[22px] text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="mt-3 flex w-full max-w-[245px] flex-col items-center gap-2">
            <DialogTitle className="text-center text-[24px] font-bold capitalize leading-[30px] text-[#1C1C1C]">
              Logout
            </DialogTitle>
            <DialogDescription className="text-center text-[16px] leading-5 text-[rgba(24,24,24,0.8)]">
              Are you sure you want to logout?
            </DialogDescription>
          </div>

          <div className="mt-5 flex w-full gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isConfirming}
              className="h-[49px] flex-1 cursor-pointer rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[12px] font-semibold leading-4 text-[#005864] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirming}
              className="h-[49px] flex-1 cursor-pointer rounded-[12px] bg-[#FF0000] text-[12px] font-semibold leading-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isConfirming ? "Logging out..." : "Yes, Logout Now"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
