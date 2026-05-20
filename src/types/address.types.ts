export interface AddressCoordinates {
  type: "Point";
  coordinates: [number, number];
}

export interface UserAddress {
  _id: string;
  user: string;
  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
  coordinates?: AddressCoordinates;
  createdAt: string;
  updatedAt: string;
}

export interface GetAddressesResponse {
  success: boolean;
  message: string;
  data: {
    addresses: UserAddress[];
  };
}

export interface EditAddressPayload {
  _id: string;
  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  longitude: string;
  latitude: string;
}

export interface EditAddressResponse {
  success: boolean;
  message: string;
  data?: {
    address?: UserAddress;
  };
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

export interface AddAddressBody {
  label: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  longitude: string;
  latitude: string;
}

export interface AddAddressResponse {
  success: boolean;
  message: string;
  data?: {
    address?: UserAddress;
  };
}
