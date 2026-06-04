"use client";

import { useEffect, useRef, useState } from "react";

import {
  getInitialMapCenter,
  loadGoogleMapsScript,
  parseAddressComponents,
  parseCoordinate,
} from "@/lib/google-maps";

import { addressFieldInputMutedClass } from "./address-dialog-styles";

export type AddressLocationUpdate = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  latitude?: string;
  longitude?: string;
};

type AddressGoogleMapPickerProps = {
  enabled?: boolean;
  latitude?: string;
  longitude?: string;
  onLocationChange: (update: AddressLocationUpdate) => void;
  compact?: boolean;
  searchInputId?: string;
};

function buildLocationUpdate(
  place: { address_components?: unknown[]; formatted_address?: string },
  nextLat: number,
  nextLng: number,
): AddressLocationUpdate {
  const update: AddressLocationUpdate = {
    latitude: String(nextLat),
    longitude: String(nextLng),
  };

  if (!Array.isArray(place.address_components)) {
    return update;
  }

  const parsed = parseAddressComponents(
    place.address_components as Parameters<typeof parseAddressComponents>[0],
  );
  const formattedAddress = place.formatted_address ?? "";

  if (parsed.address) {
    update.address = parsed.address;
  } else if (formattedAddress) {
    update.address = formattedAddress.split(",")[0]?.trim() ?? "";
  }

  if (parsed.city) update.city = parsed.city;
  if (parsed.state) update.state = parsed.state;
  if (parsed.country) update.country = parsed.country;
  if (parsed.zipCode) update.zipCode = parsed.zipCode;

  return update;
}

function isPacContainerVisible(): boolean {
  const pac = document.querySelector(".pac-container");
  if (!(pac instanceof HTMLElement)) return false;

  return (
    pac.childElementCount > 0 &&
    pac.style.display !== "none" &&
    pac.getBoundingClientRect().height > 0
  );
}

export default function AddressGoogleMapPicker({
  enabled = true,
  latitude,
  longitude,
  onLocationChange,
  compact = false,
  searchInputId = "address-map-search",
}: AddressGoogleMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  const hasSyncedInitialCoordsRef = useRef(false);

  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const mapHeight = compact ? "h-[160px]" : "h-[200px]";

  onLocationChangeRef.current = onLocationChange;

  const blockMapPointerEvents = isSearchActive || isSuggestionsOpen;

  useEffect(() => {
    if (!enabled) {
      hasSyncedInitialCoordsRef.current = false;
      setIsSearchActive(false);
      setIsSuggestionsOpen(false);
    }
  }, [enabled]);

  useEffect(() => {
    loadGoogleMapsScript(() => setIsMapsLoaded(true));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const syncPacContainer = () => {
      const wrapper = searchWrapperRef.current;
      const pac = document.querySelector(".pac-container");

      if (wrapper && pac instanceof HTMLElement && pac.parentElement !== wrapper) {
        wrapper.appendChild(pac);
      }

      setIsSuggestionsOpen(isPacContainerVisible());
    };

    syncPacContainer();

    const observer = new MutationObserver(syncPacContainer);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }, [enabled, isMapsLoaded]);

  useEffect(() => {
    if (!enabled || !isMapsLoaded || !mapRef.current) return;

    const google = (window as any).google;
    if (!google) return;

    const { lat, lng, zoom } = getInitialMapCenter(latitude, longitude);

    const geocodeLatLng = (nextLat: number, nextLng: number) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat: nextLat, lng: nextLng } }, (results: any, status: any) => {
        if (status === "OK" && results?.[0]) {
          onLocationChangeRef.current(
            buildLocationUpdate(results[0], nextLat, nextLng),
          );
          return;
        }

        onLocationChangeRef.current({
          latitude: String(nextLat),
          longitude: String(nextLng),
        });
      });
    };

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      gestureHandling: blockMapPointerEvents ? "none" : "auto",
    });
    mapInstanceRef.current = map;

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
    });
    markerInstanceRef.current = marker;

    let autocomplete: any = null;

    if (searchInputRef.current) {
      autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        types: ["address"],
        fields: ["address_components", "geometry", "formatted_address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place?.geometry?.location) return;

        const nextLat = place.geometry.location.lat();
        const nextLng = place.geometry.location.lng();

        map.setCenter({ lat: nextLat, lng: nextLng });
        map.setZoom(16);
        marker.setPosition({ lat: nextLat, lng: nextLng });
        onLocationChangeRef.current(buildLocationUpdate(place, nextLat, nextLng));
        setIsSearchActive(false);
        setIsSuggestionsOpen(false);
      });
    }

    const clickListener = map.addListener("click", (event: any) => {
      if (!event.latLng) return;
      const nextLat = event.latLng.lat();
      const nextLng = event.latLng.lng();
      marker.setPosition({ lat: nextLat, lng: nextLng });
      geocodeLatLng(nextLat, nextLng);
    });

    const dragListener = marker.addListener("dragend", () => {
      const position = marker.getPosition();
      if (!position) return;
      geocodeLatLng(position.lat(), position.lng());
    });

    return () => {
      google.maps.event.removeListener(clickListener);
      google.maps.event.removeListener(dragListener);
      autocomplete?.unbindAll?.();
      marker.setMap(null);
      mapInstanceRef.current = null;
      markerInstanceRef.current = null;
    };
  }, [enabled, isMapsLoaded]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setOptions({
      gestureHandling: blockMapPointerEvents ? "none" : "auto",
    });
  }, [blockMapPointerEvents]);

  useEffect(() => {
    if (!enabled || hasSyncedInitialCoordsRef.current) return;

    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);
    const map = mapInstanceRef.current;
    const marker = markerInstanceRef.current;

    if (!map || !marker || lat === null || lng === null || (lat === 0 && lng === 0)) {
      return;
    }

    marker.setPosition({ lat, lng });
    map.setCenter({ lat, lng });
    map.setZoom(16);
    hasSyncedInitialCoordsRef.current = true;
  }, [enabled, latitude, longitude]);

  return (
    <div className="space-y-2">
      <div ref={searchWrapperRef} className="relative z-30 overflow-visible">
        <label htmlFor={searchInputId} className="mb-1 block text-[12px] font-[500] leading-4 text-[#181818]">
          Search Location
        </label>
        <input
          ref={searchInputRef}
          id={searchInputId}
          type="text"
          placeholder="Search for your address..."
          disabled={!enabled || !isMapsLoaded}
          autoComplete="off"
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setIsSearchActive(false);
              setIsSuggestionsOpen(isPacContainerVisible());
            }, 200);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
          className={`${addressFieldInputMutedClass} relative z-30 w-full outline-none disabled:cursor-not-allowed disabled:opacity-60`}
        />
      </div>

      <div
        className={`relative z-0 overflow-hidden rounded-[10px] border border-[#005864]/30 bg-[#E8F7F7] ${mapHeight} ${
          blockMapPointerEvents ? "pointer-events-none" : ""
        }`}
      >
        {!isMapsLoaded ? (
          <div className="flex h-full w-full items-center justify-center text-[12px] font-medium text-[#005864]">
            Loading Google Maps...
          </div>
        ) : (
          <div ref={mapRef} className="h-full w-full" />
        )}
      </div>

      <p className="text-[11px] leading-4 text-black/50">
        Search, click on the map, or drag the marker to set the location.
      </p>
    </div>
  );
}
