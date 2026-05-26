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
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: string;
  longitude: string;
};

type AddressGoogleMapPickerProps = {
  enabled?: boolean;
  latitude?: string;
  longitude?: string;
  onLocationChange: (update: AddressLocationUpdate) => void;
  compact?: boolean;
  searchInputId?: string;
};

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
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const onLocationChangeRef = useRef(onLocationChange);

  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const mapHeight = compact ? "h-[160px]" : "h-[200px]";

  onLocationChangeRef.current = onLocationChange;

  useEffect(() => {
    loadGoogleMapsScript(() => setIsMapsLoaded(true));
  }, []);

  useEffect(() => {
    if (!enabled || !isMapsLoaded || !mapRef.current) return;

    const google = (window as any).google;
    if (!google) return;

    const { lat, lng, zoom } = getInitialMapCenter(latitude, longitude);

    const updateFromPlace = (place: any, nextLat: number, nextLng: number) => {
      if (!place.address_components) return;

      const parsed = parseAddressComponents(place.address_components);

      onLocationChangeRef.current({
        latitude: String(nextLat),
        longitude: String(nextLng),
        address: parsed.address,
        city: parsed.city,
        state: parsed.state,
        country: parsed.country,
        zipCode: parsed.zipCode,
      });
    };

    const geocodeLatLng = (nextLat: number, nextLng: number) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat: nextLat, lng: nextLng } }, (results: any, status: any) => {
        if (status === "OK" && results?.[0]) {
          updateFromPlace(results[0], nextLat, nextLng);
        } else {
          onLocationChangeRef.current({
            latitude: String(nextLat),
            longitude: String(nextLng),
            address: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          });
        }
      });
    };

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
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
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place?.geometry?.location) return;

        const nextLat = place.geometry.location.lat();
        const nextLng = place.geometry.location.lng();

        map.setCenter({ lat: nextLat, lng: nextLng });
        map.setZoom(16);
        marker.setPosition({ lat: nextLat, lng: nextLng });
        updateFromPlace(place, nextLat, nextLng);
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
    if (!enabled) return;

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
  }, [enabled, latitude, longitude]);

  return (
    <div className="space-y-2">
      <div>
        <label htmlFor={searchInputId} className="mb-1 block text-[12px] font-[500] leading-4 text-[#181818]">
          Search Location
        </label>
        <input
          ref={searchInputRef}
          id={searchInputId}
          type="text"
          placeholder="Search for your address..."
          disabled={!enabled || !isMapsLoaded}
          className={`${addressFieldInputMutedClass} w-full outline-none disabled:cursor-not-allowed disabled:opacity-60`}
        />
      </div>

      <div
        className={`relative overflow-hidden rounded-[10px] border border-[#005864]/30 bg-[#E8F7F7] ${mapHeight}`}
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
        Click on the map or drag the marker to auto-fill the address fields.
      </p>
    </div>
  );
}
