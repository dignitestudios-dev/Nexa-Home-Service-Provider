"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDeleteAddress } from "@/hooks/addresses/use-address-mutations";
import { getApiErrorMessage } from "@/lib/api-error";
import type { UserAddress } from "@/types/address.types";

type DeleteAddressDialogProps = {
  address: UserAddress | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteAddressDialog({
  address,
  open,
  onOpenChange,
}: DeleteAddressDialogProps) {
  const deleteMutation = useDeleteAddress();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) setErrorMessage(null);
  }, [open]);

  const handleKeep = () => {
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!address) return;

    setErrorMessage(null);

    try {
      await deleteMutation.mutateAsync(address._id);
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Failed to delete address. Please try again."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="z-[210] w-[360px] max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl sm:max-w-[360px]"
      >
        <div className="flex flex-col items-center px-5 pb-5 pt-8">
          <AlertTriangle
            className="h-[42px] w-[42px] text-[#F01A1A]"
            strokeWidth={2.2}
            aria-hidden
          />

          <div className="mt-3 flex w-full max-w-[245px] flex-col items-center gap-2 text-center">
            <h2 className="w-full text-[24px] font-[700] capitalize leading-[30px] text-[#181818]">
              Delete Address
            </h2>
            <p className="w-full text-[16px] font-[400] leading-5 text-[#181818]/80">
              Are you sure you want to delete this address?
            </p>
          </div>

          {errorMessage ? (
            <p className="mt-3 text-center text-[12px] text-[#F01A1A]">{errorMessage}</p>
          ) : null}

          <div className="mt-6 grid w-full grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleKeep}
              disabled={deleteMutation.isPending}
              className="h-[49px] cursor-pointer rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[12px] font-[600] leading-[15px] text-[#005864] transition hover:bg-[rgba(0,88,100,0.1)] disabled:opacity-60"
            >
              No, keep it
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-[49px] cursor-pointer rounded-[12px] bg-[#F01A1A] text-[12px] font-[600] leading-[15px] text-white transition hover:bg-[#d91717] disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Now"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
