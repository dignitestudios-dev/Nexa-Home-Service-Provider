import type { UserAddress } from "@/types/address.types";

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
    return nested.addresses as UserAddress[];
  }

  if (Array.isArray(record.addresses)) {
    return record.addresses as UserAddress[];
  }

  if (Array.isArray(record.data)) {
    return record.data as UserAddress[];
  }

  return [];
}
