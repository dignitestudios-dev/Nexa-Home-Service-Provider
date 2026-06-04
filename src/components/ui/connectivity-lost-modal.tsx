"use client";

import { WifiOff } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { hideConnectivityLostModal } from "@/lib/connectivity-store";

type ConnectivityLostModalProps = {
  open: boolean;
};

export function ConnectivityLostModal({ open }: ConnectivityLostModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) hideConnectivityLostModal();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[400px] max-w-[calc(100%-2rem)] gap-0 rounded-[16px] border-0 bg-white p-0 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        <div className="flex flex-col items-center px-6 pb-8 pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(136.41deg,#005864_39.74%,#D7DF23_307.09%)]">
            <WifiOff className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>

          <DialogTitle className="mt-5 text-center text-[28px] font-bold leading-[34px] text-[#1C1C1C]">
            Connectivity Lost
          </DialogTitle>

          <DialogDescription className="mt-3 max-w-[320px] text-center text-[16px] font-medium leading-6 text-[rgba(24,24,24,0.85)]">
            Please check your internet connection and try again.
          </DialogDescription>

          <button
            type="button"
            onClick={() => hideConnectivityLostModal()}
            className="mt-6 h-12 w-full cursor-pointer rounded-[12px] bg-[#005864] text-[16px] font-semibold leading-5 text-white hover:opacity-95"
          >
            OK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
