type GoogleAddressComponent = {
  long_name: string;
  types: string[];
};

export type ParsedGoogleAddress = {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export function loadGoogleMapsScript(callback: () => void) {
  if (typeof window === "undefined") return;

  if ((window as Window & { google?: unknown }).google) {
    callback();
    return;
  }

  const existingScript = document.getElementById("google-maps-script");
  if (existingScript) {
    existingScript.addEventListener("load", callback);
    return;
  }

  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyDTtKExKUXYOVHPTRUIrd_uSH9j940rDcI&libraries=places";
  script.id = "google-maps-script";
  script.async = true;
  script.defer = true;
  script.onload = () => callback();
  document.body.appendChild(script);
}

export function parseAddressComponents(
  components: GoogleAddressComponent[],
): ParsedGoogleAddress {
  let streetNumber = "";
  let route = "";
  let city = "";
  let state = "";
  let country = "";
  let zipCode = "";

  for (const component of components) {
    const types = component.types;
    if (types.includes("street_number")) {
      streetNumber = component.long_name;
    } else if (types.includes("route")) {
      route = component.long_name;
    } else if (
      types.includes("locality") ||
      types.includes("sublocality_level_1")
    ) {
      city = component.long_name;
    } else if (types.includes("administrative_area_level_1")) {
      state = component.long_name;
    } else if (types.includes("country")) {
      country = component.long_name;
    } else if (types.includes("postal_code")) {
      zipCode = component.long_name;
    }
  }

  const streetAddress = [streetNumber, route].filter(Boolean).join(" ");

  return {
    address: streetAddress || "",
    city,
    state,
    country,
    zipCode: zipCode.replace(/\D/g, ""),
  };
}

export function parseCoordinate(value?: string): number | null {
  if (!value?.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getInitialMapCenter(latitude?: string, longitude?: string) {
  const lat = parseCoordinate(latitude);
  const lng = parseCoordinate(longitude);

  if (lat !== null && lng !== null && !(lat === 0 && lng === 0)) {
    return { lat, lng, zoom: 16 };
  }

  return { lat: 40.74, lng: -73.98, zoom: 12 };
}
