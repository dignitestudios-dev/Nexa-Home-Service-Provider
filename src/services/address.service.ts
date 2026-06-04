import { API } from "@/lib/axios";
import type {
  AddAddressBody,
  AddAddressResponse,
  DeleteAddressResponse,
  EditAddressPayload,
  EditAddressResponse,
  GetAddressesResponse,
  SetDefaultAddressResponse,
} from "@/types/address.types";

export const addressService = {
  getAll: async (): Promise<GetAddressesResponse> => {
    const { data } = await API.get("/address/get-all");
    return data;
  },

  editAddress: async (payload: EditAddressPayload): Promise<EditAddressResponse> => {
    const { _id: addressId, ...fields } = payload;
    const { data } = await API.post(`/address/edit-address/${addressId}`, fields);
    return data;
  },

  deleteAddress: async (addressId: string): Promise<DeleteAddressResponse> => {
    const { data } = await API.post(`/address/delete/${addressId}`);
    return data;
  },

  addAddress: async (payload: AddAddressBody): Promise<AddAddressResponse> => {
    const { data } = await API.post("/address/add-address", payload);
    return data;
  },

  setDefaultAddress: async (addressId: string): Promise<SetDefaultAddressResponse> => {
    const { data } = await API.post(`/address/set-default/${addressId}`);
    return data;
  },
};
