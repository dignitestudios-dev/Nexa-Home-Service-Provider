import type { AddressLocationUpdate } from "./address-google-map-picker";

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
    ...(update.zipCode ? { zipCode: update.zipCode } : {}),
  };
}

export function markAddressFieldsEdited<T extends AddressFormFields>(prev: T): T {
  return {
    ...prev,
    latitude: "",
    longitude: "",
  };
}
