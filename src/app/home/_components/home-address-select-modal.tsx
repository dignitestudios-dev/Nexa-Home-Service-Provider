"use client";

import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatAddressDisplay } from "@/lib/home-address";
import type { UserAddress } from "@/types/address.types";

type HomeAddressSelectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: UserAddress[];
  selectedAddressId: string | null;
  onSelect: (addressId: string) => void | Promise<void>;
  isLoading?: boolean;
  isSubmitting?: boolean;
};

export default function HomeAddressSelectModal({
  open,
  onOpenChange,
  addresses,
  selectedAddressId,
  onSelect,
  isLoading = false,
  isSubmitting = false,
}: HomeAddressSelectModalProps) {
  const [draftAddressId, setDraftAddressId] = useState<string | null>(
    selectedAddressId,
  );

  useEffect(() => {
    if (open) {
      setDraftAddressId(selectedAddressId);
    }
  }, [open, selectedAddressId]);

  const handleApply = async () => {
    if (!draftAddressId || isSubmitting) return;
    await onSelect(draftAddressId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[520px] gap-0 rounded-[20px] p-0"
      >
        <DialogTitle className="sr-only">Select address</DialogTitle>

        <div className="flex items-start justify-between border-b border-black/5 px-6 py-5">
          <div>
            <h2 className="text-[24px] font-semibold leading-[30px] text-[#1C1C1C]">
              Select Address
            </h2>
            <p className="mt-1 text-[14px] leading-[18px] text-black/60">
            Jobs and Leads will be shown based on your selected address.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Close address selector"
          >
            <X className="h-5 w-5 text-[rgba(24,24,24,0.8)]" />
          </button>
        </div>

        <div className="max-h-[360px] overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[88px] animate-pulse rounded-[12px] bg-[#F0F0F0]"
                />
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <p className="py-8 text-center text-[15px] text-black/60">
              No addresses saved yet.
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => {
                const isSelected = draftAddressId === address._id;

                return (
                  <button
                    key={address._id}
                    type="button"
                    onClick={() => setDraftAddressId(address._id)}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-[12px] border px-4 py-4 text-left transition-colors ${
                      isSelected
                        ? "border-[#005864] bg-[rgba(0,88,100,0.06)]"
                        : "border-[#E8E8E8] bg-white hover:bg-[#FAFAFA]"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={isSelected}
                      readOnly
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#005864]"
                      aria-label={`Select ${address.label}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                          {address.label}
                        </span>
                      
                      </div>
                      <div className="mt-2 flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#005864]" />
                        <p className="text-[14px] leading-5 text-black/60">
                          {formatAddressDisplay(address)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-black/5 px-6 py-5">
          <button
            type="button"
            onClick={handleApply}
            disabled={!draftAddressId || addresses.length === 0 || isSubmitting}
            className="h-12 w-full cursor-pointer rounded-[12px] bg-[#005864] text-[16px] font-semibold capitalize leading-5 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
