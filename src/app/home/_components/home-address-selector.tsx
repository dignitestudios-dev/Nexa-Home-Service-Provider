"use client";

import { useMemo, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";

import { useSetDefaultAddress } from "@/hooks/addresses/use-address-mutations";
import { useGetAddresses } from "@/hooks/addresses/use-addresses-query";
import {
  formatAddressLabelWithZip,
  getDefaultAddress,
} from "@/lib/home-address";
import { toast } from "@/lib/toast";

import HomeAddressSelectModal from "./home-address-select-modal";

export default function HomeAddressSelector() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setDefaultMutation = useSetDefaultAddress();

  const {
    data: addresses = [],
    isLoading,
    isPending,
    isFetching,
    isFetched,
  } = useGetAddresses();

  const isLoadingAddresses =
    isLoading || isPending || (isFetching && !isFetched);

  const defaultAddress = useMemo(
    () => getDefaultAddress(addresses),
    [addresses],
  );

  const handleSelectAddress = async (addressId: string) => {
    if (defaultAddress?._id === addressId) {
      setIsModalOpen(false);
      return;
    }

    try {
      const response = await setDefaultMutation.mutateAsync(addressId);
      toast.fromApiSuccess(response, "Default address updated.");
      setIsModalOpen(false);
    } catch (error) {
      toast.fromApiError(error, "Could not update default address.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={setDefaultMutation.isPending}
        className="flex max-w-full cursor-pointer items-center gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="Select address"
      >
        <MapPin className="h-5 w-5 shrink-0 text-[#005864]" />
        <span className="truncate text-[18px] font-medium leading-6 text-[#1C1C1C]">
          {isLoadingAddresses
            ? "Loading address..."
            : formatAddressLabelWithZip(defaultAddress)}
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-black/60" />
      </button>

      <HomeAddressSelectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        addresses={addresses}
        selectedAddressId={defaultAddress?._id ?? null}
        onSelect={handleSelectAddress}
        isLoading={isLoadingAddresses}
        isSubmitting={setDefaultMutation.isPending}
      />
    </>
  );
}
