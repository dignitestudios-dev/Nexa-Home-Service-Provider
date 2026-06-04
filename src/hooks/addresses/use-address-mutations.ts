"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  parseAddressesFromResponse,
  sortAddressesWithDefaultFirst,
} from "@/lib/parse-addresses-response";
import { addressService } from "@/services/address.service";
import type {
  AddAddressBody,
  EditAddressPayload,
  UserAddress,
} from "@/types/address.types";

import { ADDRESSES_QUERY_KEY } from "./use-addresses-query";
import { PROVIDER_FEED_QUERY_KEY } from "../jobs/use-provider-feed-query";

function toAddressList(data: unknown): UserAddress[] {
  if (Array.isArray(data)) return sortAddressesWithDefaultFirst(data);
  return parseAddressesFromResponse(data);
}

function buildUpdatedAddress(
  existing: UserAddress,
  payload: EditAddressPayload,
): UserAddress {
  const longitude = Number(payload.longitude);
  const latitude = Number(payload.latitude);

  return {
    ...existing,
    label: payload.label,
    address: payload.address,
    country: payload.country,
    state: payload.state,
    city: payload.city,
    zipCode: payload.zipCode,
    coordinates: {
      type: "Point",
      coordinates: [
        Number.isFinite(longitude) ? longitude : 0,
        Number.isFinite(latitude) ? latitude : 0,
      ],
    },
    updatedAt: new Date().toISOString(),
  };
}

export function useEditAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditAddressPayload) => addressService.editAddress(payload),
    onSuccess: (response, variables) => {
      const serverAddress = response.data?.address;

      queryClient.setQueryData<UserAddress[]>(ADDRESSES_QUERY_KEY, (current) => {
        const list = toAddressList(current);
        return sortAddressesWithDefaultFirst(
          list.map((item) => {
            if (item._id !== variables._id) return item;
            if (serverAddress) return serverAddress;
            return buildUpdatedAddress(item, variables);
          }),
        );
      });

      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddAddressBody) => addressService.addAddress(payload),
    onSuccess: (response) => {
      const serverAddress = response.data?.address;

      queryClient.setQueryData<UserAddress[]>(ADDRESSES_QUERY_KEY, (current) => {
        const list = toAddressList(current);
        if (serverAddress) {
          return sortAddressesWithDefaultFirst([...list, serverAddress]);
        }
        return list;
      });

      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => addressService.deleteAddress(addressId),
    onSuccess: (_response, addressId) => {
      queryClient.setQueryData<UserAddress[]>(ADDRESSES_QUERY_KEY, (current) => {
        const list = toAddressList(current);
        return list.filter((item) => item._id !== addressId);
      });

      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => addressService.setDefaultAddress(addressId),
    onMutate: async (addressId) => {
      await queryClient.cancelQueries({ queryKey: ADDRESSES_QUERY_KEY });
      const previous = queryClient.getQueryData<UserAddress[]>(ADDRESSES_QUERY_KEY);

      queryClient.setQueryData<UserAddress[]>(ADDRESSES_QUERY_KEY, (current) => {
        const list = toAddressList(current);
        return sortAddressesWithDefaultFirst(
          list.map((item) => ({
            ...item,
            isDefault: item._id === addressId,
          })),
        );
      });

      return { previous };
    },
    onError: (_error, _addressId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ADDRESSES_QUERY_KEY, context.previous);
      }
    },
    onSuccess: (response) => {
      const addresses = parseAddressesFromResponse(response);
      if (addresses.length > 0) {
        queryClient.setQueryData(ADDRESSES_QUERY_KEY, addresses);
      }

      void queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: PROVIDER_FEED_QUERY_KEY });
    },
  });
}
