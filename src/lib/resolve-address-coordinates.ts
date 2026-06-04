import {
  buildAddressGeocodeQuery,
  geocodeAddressQuery,
} from "@/lib/google-maps";

type AddressCoordinateInput = {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export async function resolveAddressCoordinates(
  form: AddressCoordinateInput,
): Promise<{ latitude: string; longitude: string }> {
  const query = buildAddressGeocodeQuery(form);
  const geocoded = await geocodeAddressQuery(query);

  if (!geocoded) {
    throw new Error(
      "Could not find coordinates for this address. Please pick a location on the map or adjust the address.",
    );
  }

  return {
    latitude: String(geocoded.lat),
    longitude: String(geocoded.lng),
  };
}
