import type { AddressLocationUpdate } from "./address-google-map-picker";
import { ZIP_CODE_MAX_LENGTH } from "@/lib/schemas/profile-setup.schema";

export function normalizeZipCodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, ZIP_CODE_MAX_LENGTH);
}

export function getZipCodeValidationError(value: string): string | null {
  const normalized = normalizeZipCodeInput(value);

  if (normalized.length < 3) {
    return "Zip code is required";
  }

  if (normalized.length > ZIP_CODE_MAX_LENGTH) {
    return `Zip code cannot exceed ${ZIP_CODE_MAX_LENGTH} characters`;
  }

  return null;
}

type AddressFormFields = {
  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  longitude: string;
  latitude: string;
};

export function mergeAddressLocationUpdate<T extends AddressFormFields>(
  prev: T,
  update: AddressLocationUpdate,
): T {
  return {
    ...prev,
    ...(update.latitude ? { latitude: update.latitude } : {}),
    ...(update.longitude ? { longitude: update.longitude } : {}),
    ...(update.address ? { address: update.address } : {}),
    ...(update.city ? { city: update.city } : {}),
    ...(update.state ? { state: update.state } : {}),
    ...(update.country ? { country: update.country } : {}),
    ...(update.zipCode ? { zipCode: normalizeZipCodeInput(update.zipCode) } : {}),
  };
}

export function markAddressFieldsEdited<T extends AddressFormFields>(prev: T): T {
  return {
    ...prev,
    latitude: "",
    longitude: "",
  };
}
