"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEditAddress } from "@/hooks/addresses/use-address-mutations";
import { getApiErrorMessage } from "@/lib/api-error";
import type { UserAddress } from "@/types/address.types";
import AddressGoogleMapPicker from "./address-google-map-picker";
import {
  addressDialogContentClass,
  addressDialogFormClass,
  addressDialogSubmitClass,
  addressDialogTitleClass,
  addressFieldInputMutedClass,
  addressFieldInputWhiteClass,
  addressFieldLabelClass,
} from "./address-dialog-styles";

type EditFormState = {
  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  longitude: string;
  latitude: string;
};

function toEditForm(address: UserAddress): EditFormState {
  const [lng, lat] = address.coordinates?.coordinates ?? [0, 0];

  return {
    label: address.label,
    address: address.address,
    country: address.country,
    state: address.state,
    city: address.city,
    zipCode: address.zipCode,
    longitude: String(lng),
    latitude: String(lat),
  };
}

const emptyForm: EditFormState = {
  label: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zipCode: "",
  longitude: "",
  latitude: "",
};

type EditAddressDialogProps = {
  address: UserAddress | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditAddressDialog({
  address,
  open,
  onOpenChange,
}: EditAddressDialogProps) {
  const editMutation = useEditAddress();
  const [form, setForm] = useState<EditFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !open) return;
    setForm(toEditForm(address));
    setFormError(null);
  }, [address, open]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) return;

    setFormError(null);

    try {
      await editMutation.mutateAsync({
        _id: address._id,
        label: form.label.trim(),
        address: form.address.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        zipCode: form.zipCode.trim(),
        longitude: form.longitude.trim(),
        latitude: form.latitude.trim(),
      });
      onOpenChange(false);
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Failed to update address. Please try again."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={addressDialogContentClass}>
        <DialogHeader className="gap-0.5 pr-8">
          <DialogTitle className={addressDialogTitleClass}>Edit Address</DialogTitle>
        </DialogHeader>

        <DialogClose asChild>
          <button
            type="button"
            className="absolute right-4 top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#181818] transition hover:bg-[#F3F3F3]"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>

        <form className={addressDialogFormClass} onSubmit={onSubmit}>
          <div>
            <label htmlFor="edit-label" className={addressFieldLabelClass}>
              Address Name
            </label>
            <Input
              id="edit-label"
              value={form.label}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              className={addressFieldInputMutedClass}
              required
            />
          </div>

          <div>
            <label htmlFor="edit-address" className={addressFieldLabelClass}>
              Address
            </label>
            <Input
              id="edit-address"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              className={addressFieldInputMutedClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="edit-city" className={addressFieldLabelClass}>
                City
              </label>
              <Input
                id="edit-city"
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-state" className={addressFieldLabelClass}>
                State
              </label>
              <Input
                id="edit-state"
                value={form.state}
                onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="edit-country" className={addressFieldLabelClass}>
                Country
              </label>
              <Input
                id="edit-country"
                value={form.country}
                onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-zip" className={addressFieldLabelClass}>
                Zip Code
              </label>
              <Input
                id="edit-zip"
                value={form.zipCode}
                onChange={(e) => setForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
          </div>

          {open ? (
            <AddressGoogleMapPicker
              enabled={open}
              searchInputId="edit-address-map-search"
              latitude={form.latitude}
              longitude={form.longitude}
              onLocationChange={(update) =>
                setForm((prev) => ({
                  ...prev,
                  ...update,
                  country: update.country || prev.country,
                }))
              }
              compact
            />
          ) : null}

          {formError ? <p className="text-[12px] text-[#FF0000]">{formError}</p> : null}

          <Button
            type="submit"
            disabled={editMutation.isPending}
            className={`${addressDialogSubmitClass} disabled:opacity-60`}
          >
            {editMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

