"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddAddress } from "@/hooks/addresses/use-address-mutations";
import { getAuthTokenCookie } from "@/lib/auth-session";
import { getApiErrorMessage } from "@/lib/api-error";
import AddressMapPreview from "./address-map-preview";
import {
  addressDialogContentClass,
  addressDialogFormClass,
  addressDialogSubmitClass,
  addressDialogTitleClass,
  addressFieldInputMutedClass,
  addressFieldInputWhiteClass,
  addressFieldLabelClass,
} from "./address-dialog-styles";

type AddFormState = {
  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  longitude: string;
  latitude: string;
};

const emptyForm: AddFormState = {
  label: "",
  address: "",
  country: "United States",
  state: "",
  city: "",
  zipCode: "",
  longitude: "",
  latitude: "",
};

type AddAddressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddAddressDialog({ open, onOpenChange }: AddAddressDialogProps) {
  const hasToken = Boolean(getAuthTokenCookie());
  const addMutation = useAddAddress();
  const [form, setForm] = useState<AddFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
    setFormError(null);
  }, [open]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasToken) {
      setFormError("Please log in to add an address.");
      return;
    }

    setFormError(null);

    try {
      await addMutation.mutateAsync({
        label: form.label.trim(),
        address: form.address.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
        city: form.city.trim(),
        zipCode: form.zipCode.trim(),
        longitude: form.longitude.trim() || "0",
        latitude: form.latitude.trim() || "0",
      });
      onOpenChange(false);
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Failed to add address. Please try again."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 text-[16px] font-[500] leading-5 text-[#005864] underline underline-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </DialogTrigger>

      <DialogContent showCloseButton={false} className={addressDialogContentClass}>
        <DialogHeader className="gap-0.5 pr-8">
          <DialogTitle className={addressDialogTitleClass}>Add Address</DialogTitle>
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
            <label htmlFor="add-label" className={addressFieldLabelClass}>
              Address Name
            </label>
            <Input
              id="add-label"
              value={form.label}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Office"
              className={addressFieldInputMutedClass}
              required
            />
          </div>

          <div>
            <label htmlFor="add-address" className={addressFieldLabelClass}>
              Address
            </label>
            <Input
              id="add-address"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Street 123, Downtown"
              className={addressFieldInputMutedClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="add-city" className={addressFieldLabelClass}>
                City
              </label>
              <Input
                id="add-city"
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Philadelphia"
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
            <div>
              <label htmlFor="add-state" className={addressFieldLabelClass}>
                State
              </label>
              <Input
                id="add-state"
                value={form.state}
                onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="Pennsylvania"
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="add-country" className={addressFieldLabelClass}>
                Country
              </label>
              <Input
                id="add-country"
                value={form.country}
                onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
            <div>
              <label htmlFor="add-zip" className={addressFieldLabelClass}>
                Zip Code
              </label>
              <Input
                id="add-zip"
                value={form.zipCode}
                onChange={(e) => setForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                placeholder="12345"
                className={addressFieldInputWhiteClass}
                required
              />
            </div>
          </div>

          <div>
            <p className={addressFieldLabelClass}>Location on Map</p>
            <AddressMapPreview
              compact
              latitude={form.latitude}
              longitude={form.longitude}
              address={form.address}
              city={form.city}
              state={form.state}
              zipCode={form.zipCode}
              country={form.country}
            />
          </div>

          {formError ? <p className="text-[12px] text-[#FF0000]">{formError}</p> : null}

          <Button
            type="submit"
            disabled={addMutation.isPending}
            className={`${addressDialogSubmitClass} disabled:opacity-60`}
          >
            {addMutation.isPending ? "Saving..." : "Save Address"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
