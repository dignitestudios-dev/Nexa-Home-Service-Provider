import type { UserAddress } from "@/types/address.types";

export function sortAddressesWithDefaultFirst(
  addresses: UserAddress[],
): UserAddress[] {
  return [...addresses].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );
}

export function parseAddressesFromResponse(data: unknown): UserAddress[] {
  if (!data || typeof data !== "object") {
    return [];
  }

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  if (nested && Array.isArray(nested.addresses)) {
    return sortAddressesWithDefaultFirst(nested.addresses as UserAddress[]);
  }

  if (Array.isArray(record.addresses)) {
    return sortAddressesWithDefaultFirst(record.addresses as UserAddress[]);
  }

  if (Array.isArray(record.data)) {
    return sortAddressesWithDefaultFirst(record.data as UserAddress[]);
  }

  return [];
}
