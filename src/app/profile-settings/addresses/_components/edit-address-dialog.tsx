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
import { resolveAddressCoordinates } from "@/lib/resolve-address-coordinates";
import type { UserAddress } from "@/types/address.types";
import AddressGoogleMapPicker from "./address-google-map-picker";
import {
  getZipCodeValidationError,
  markAddressFieldsEdited,
  mergeAddressLocationUpdate,
  normalizeZipCodeInput,
} from "./address-form-helpers";
import { ZIP_CODE_MAX_LENGTH } from "@/lib/schemas/profile-setup.schema";
import {
  addressDialogContentClass,
  addressDialogFormClass,
  addressDialogOutsideEventHandlers,
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
    zipCode: normalizeZipCodeInput(address.zipCode),
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
  const [zipCodeError, setZipCodeError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!address || !open) {
      setMapReady(false);
      return;
    }

    setForm(toEditForm(address));
    setFormError(null);
    setZipCodeError(null);
    setMapReady(true);
  }, [address, open]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) return;

    setFormError(null);

    const nextZipCodeError = getZipCodeValidationError(form.zipCode);
    if (nextZipCodeError) {
      setZipCodeError(nextZipCodeError);
      return;
    }

    setZipCodeError(null);

    try {
      const coordinates = await resolveAddressCoordinates({
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        zipCode: normalizeZipCodeInput(form.zipCode),
      });

      await editMutation.mutateAsync({
        _id: address._id,
        label: form.label.trim(),
        address: form.address.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        zipCode: normalizeZipCodeInput(form.zipCode),
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
      });
      onOpenChange(false);
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Failed to update address. Please try again."),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={addressDialogContentClass}
        {...addressDialogOutsideEventHandlers}
      >
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

        <form
          className={addressDialogFormClass}
          onSubmit={onSubmit}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (target.tagName === "BUTTON") return;
            event.preventDefault();
          }}
        >
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
              onChange={(e) =>
                setForm((prev) =>
                  markAddressFieldsEdited({ ...prev, address: e.target.value }),
                )
              }
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
                onChange={(e) =>
                  setForm((prev) =>
                    markAddressFieldsEdited({ ...prev, city: e.target.value }),
                  )
                }
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
                onChange={(e) =>
                  setForm((prev) =>
                    markAddressFieldsEdited({ ...prev, state: e.target.value }),
                  )
                }
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
                onChange={(e) =>
                  setForm((prev) =>
                    markAddressFieldsEdited({ ...prev, country: e.target.value }),
                  )
                }
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
                onChange={(e) => {
                  setZipCodeError(null);
                  setForm((prev) =>
                    markAddressFieldsEdited({
                      ...prev,
                      zipCode: normalizeZipCodeInput(e.target.value),
                    }),
                  );
                }}
                placeholder="e.g., 12345678"
                inputMode="numeric"
                maxLength={ZIP_CODE_MAX_LENGTH}
                className={addressFieldInputWhiteClass}
                required
              />
              {zipCodeError ? (
                <p className="mt-1 text-[12px] text-[#FF0000]">{zipCodeError}</p>
              ) : null}
            </div>
          </div>

          {open && address && mapReady ? (
            <AddressGoogleMapPicker
              key={address._id}
              enabled={open}
              searchInputId="edit-address-map-search"
              latitude={form.latitude}
              longitude={form.longitude}
              onLocationChange={(update) =>
                setForm((prev) => mergeAddressLocationUpdate(prev, update))
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

