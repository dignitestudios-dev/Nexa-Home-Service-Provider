import type { UserAddress } from "@/types/address.types";

export function formatAddressDisplay(
  address: UserAddress | null | undefined,
): string {
  if (!address) return "No address available";

  const parts = [
    address.address?.trim(),
    address.city?.trim(),
    address.state?.trim(),
  ].filter(Boolean);

  if (parts.length > 0) return parts.join(", ");

  return address.label?.trim() || "No address available";
}

export function formatAddressLabelWithZip(
  address: UserAddress | null | undefined,
): string {
  if (!address) return "No address available";

  const label = address.label?.trim();
  const zipCode = address.zipCode?.trim();

  if (label && zipCode) return `${label}, ${zipCode}`;
  if (label) return label;
  if (zipCode) return zipCode;

  return formatAddressDisplay(address);
}

export function getDefaultAddress(
  addresses: UserAddress[],
): UserAddress | null {
  return addresses.find((item) => item.isDefault) ?? addresses[0] ?? null;
}
