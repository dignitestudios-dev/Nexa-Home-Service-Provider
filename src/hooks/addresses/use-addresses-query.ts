"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { parseAddressesFromResponse } from "@/lib/parse-addresses-response";
import { addressService } from "@/services/address.service";
import type { RootState } from "@/store/index";

export const ADDRESSES_QUERY_KEY = ["addresses", "get-all"] as const;

export function useGetAddresses() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const hasToken = Boolean(getAuthTokenCookie());

  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: async () => {
      const response = await addressService.getAll();
      return parseAddressesFromResponse(response);
    },
    enabled: hasToken || isAuthenticated,
  });
}
