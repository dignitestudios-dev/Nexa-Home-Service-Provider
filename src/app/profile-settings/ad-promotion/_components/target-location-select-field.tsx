"use client";

import { ChevronDown, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useGetAddresses } from "@/hooks/addresses/use-addresses-query";
import {
  formatAddressDisplay,
  getDefaultAddress,
} from "@/lib/home-address";
import type { UserAddress } from "@/types/address.types";

type TargetLocationSelectFieldProps = {
  selectedAddressId: string | null;
  onChange: (addressId: string | null) => void;
};

function getAddressOptionLabel(address: UserAddress): string {
  const label = address.label?.trim();
  const display = formatAddressDisplay(address);

  if (label && display !== "No address available") {
    return `${label} — ${display}`;
  }

  return label || display;
}

export default function TargetLocationSelectField({
  selectedAddressId,
  onChange,
}: TargetLocationSelectFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: addresses = [],
    isLoading,
    isPending,
    isFetching,
    isFetched,
  } = useGetAddresses();

  const isLoadingAddresses =
    isLoading || isPending || (isFetching && !isFetched);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address._id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  const selectedLabel = selectedAddress
    ? getAddressOptionLabel(selectedAddress)
    : "Select Location";

  useEffect(() => {
    if (selectedAddressId || addresses.length === 0) return;

    const defaultAddress = getDefaultAddress(addresses);
    if (defaultAddress) {
      onChange(defaultAddress._id);
    }
  }, [addresses, onChange, selectedAddressId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAddress = (addressId: string) => {
    onChange(addressId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <p className="text-[16px] font-[500] leading-[22px] tracking-[-0.408px] text-black">
        Target Location
      </p>

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="mt-[7px] flex h-12 w-full items-center justify-between rounded-[12px] bg-white px-4 text-left"
      >
        <span
          className={`truncate text-[16px] leading-[22px] tracking-[-0.408px] ${
            selectedAddress
              ? "font-[300] text-[#1C1C1C]"
              : "font-[400] text-[rgba(24,24,24,0.8)]"
          }`}
        >
          {selectedLabel}
        </span>
        <ChevronDown
          className={`h-3 w-5 shrink-0 text-[rgba(24,24,24,0.8)] transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-[294px] overflow-hidden rounded-[12px] bg-[#F9FAFA] p-4 shadow-lg">
          <div className="max-h-[250px] space-y-3 overflow-y-auto pr-1">
            {isLoadingAddresses ? (
              <p className="text-[14px] text-[rgba(24,24,24,0.6)]">Loading...</p>
            ) : addresses.length > 0 ? (
              addresses.map((address) => {
                const isSelected = selectedAddressId === address._id;

                return (
                  <button
                    key={address._id}
                    type="button"
                    onClick={() => handleSelectAddress(address._id)}
                    className={`flex w-full cursor-pointer items-start gap-3 rounded-[12px] border px-3 py-3 text-left transition-colors ${
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
                        <span className="text-[15px] font-medium leading-5 text-[#1C1C1C]">
                          {address.label}
                        </span>
                        {address.isDefault ? (
                          <span className="rounded-full bg-[#005864] px-2 py-0.5 text-[11px] font-medium text-white">
                            Default
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#005864]" />
                        <p className="text-[13px] leading-5 text-black/60">
                          {formatAddressDisplay(address)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[12px] bg-white px-4 py-5 text-center">
                <p className="text-[14px] text-[rgba(24,24,24,0.6)]">
                  No addresses saved yet.
                </p>
                <Link
                  href="/profile-settings/addresses"
                  className="mt-2 inline-block text-[14px] font-[500] text-[#005864] underline underline-offset-2"
                >
                  Add address
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
