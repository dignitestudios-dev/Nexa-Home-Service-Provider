"use client";

import { useState } from "react";
import { ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import { getAuthTokenCookie } from "@/lib/auth-session";
import { useGetAddresses } from "@/hooks/addresses/use-addresses-query";
import type { RootState } from "@/store/index";
import type { UserAddress } from "@/types/address.types";
import { useSelector } from "react-redux";
import AddAddressDialog from "./_components/add-address-dialog";
import AddressListSkeleton from "./_components/address-list-skeleton";
import DeleteAddressDialog from "./_components/delete-address-dialog";
import EditAddressDialog from "./_components/edit-address-dialog";

function getMapUrl(address: UserAddress): string | null {
  const coords = address.coordinates?.coordinates;
  if (!coords || coords.length < 2) return null;
  const [lng, lat] = coords;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export default function AddressesPage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());
  const canFetch = hasToken || isAuthenticated;

  const {
    data: addresses = [],
    isLoading,
    isPending,
    isFetching,
    isFetched,
    isError,
    refetch,
  } = useGetAddresses();

  const showSkeleton =
    canFetch && (isLoading || isPending || (isFetching && !isFetched));
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState<UserAddress | null>(null);
  const [isDeleteAddressOpen, setIsDeleteAddressOpen] = useState(false);

  const openEditDialog = (address: UserAddress) => {
    setEditingAddress(address);
    setIsEditAddressOpen(true);
  };

  const openDeleteDialog = (address: UserAddress) => {
    setDeletingAddress(address);
    setIsDeleteAddressOpen(true);
  };

  return (
    <div>
      <EditAddressDialog
        address={editingAddress}
        open={isEditAddressOpen}
        onOpenChange={(open) => {
          setIsEditAddressOpen(open);
          if (!open) setEditingAddress(null);
        }}
      />

      <DeleteAddressDialog
        address={deletingAddress}
        open={isDeleteAddressOpen}
        onOpenChange={(open) => {
          setIsDeleteAddressOpen(open);
          if (!open) setDeletingAddress(null);
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[21px] font-[700] leading-7 text-black">Address</h2>
        <AddAddressDialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen} />
      </div>

      {!canFetch ? (
        <div className="mt-6 rounded-[12px] bg-white p-6 text-center">
          <p className="text-[15px] text-black/70">Please log in to view your addresses.</p>
        </div>
      ) : showSkeleton ? (
        <AddressListSkeleton count={2} />
      ) : isError ? (
        <div className="mt-6 rounded-[12px] bg-white p-6 text-center">
          <p className="text-[15px] text-black/70">Unable to load addresses. Please try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : isFetched && addresses.length === 0 ? (
        <div className="mt-6 rounded-[12px] bg-white p-6 text-center">
          <p className="text-[15px] text-black/70">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {addresses.map((address) => {
            const mapUrl = getMapUrl(address);

            return (
              <article key={address._id} className="rounded-[12px] bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-[520px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[20px] font-[500] leading-[26px] text-[#1F1F1F]">
                        {address.label}
                      </h3>
                      {address.isDefault ? (
                        <span className="rounded-full bg-[#E8F4F5] px-2 py-0.5 text-[12px] font-[500] text-[#005864]">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 flex items-start gap-2">
                      <MapPin className="mt-1 h-[17px] w-[17px] shrink-0 text-[#1F1F1F]" />
                      <p className="text-[15px] leading-5 text-black/60">{address.address}</p>
                    </div>
                    {mapUrl ? (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[14px] font-[500] leading-[18px] text-[#005864] underline underline-offset-2"
                      >
                        View on Map
                        <ExternalLink className="h-[14px] w-[14px]" />
                      </a>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${address.label} address`}
                      onClick={() => openEditDialog(address)}
                      className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[6px] text-black transition hover:bg-[#F3F3F3]"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${address.label} address`}
                      onClick={() => openDeleteDialog(address)}
                      className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[6px] text-[#FF5D5D] transition hover:bg-[#FFF1F1]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
