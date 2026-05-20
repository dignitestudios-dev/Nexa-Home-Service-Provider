"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";

type AddressMapPreviewProps = {
  latitude?: string;
  longitude?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  className?: string;
  /** Shorter map for modals */
  compact?: boolean;
};

function buildMapEmbedUrl({
  latitude,
  longitude,
  address,
  city,
  state,
  zipCode,
  country,
}: AddressMapPreviewProps): string | null {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const hasValidCoords =
    latitude &&
    longitude &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

  if (hasValidCoords) {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  const query = [address, city, state, zipCode, country].filter(Boolean).join(", ").trim();
  if (!query) return null;

  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

export default function AddressMapPreview({
  latitude,
  longitude,
  address,
  city,
  state,
  zipCode,
  country,
  className,
  compact = false,
}: AddressMapPreviewProps) {
  const mapHeight = compact ? "h-[110px]" : "h-[200px]";
  const embedUrl = useMemo(
    () =>
      buildMapEmbedUrl({
        latitude,
        longitude,
        address,
        city,
        state,
        zipCode,
        country,
      }),
    [latitude, longitude, address, city, state, zipCode, country],
  );

  if (!embedUrl) {
    return (
      <div
        className={`flex ${mapHeight} items-center justify-center rounded-[8px] bg-[#F3F3F3] text-[12px] text-black/50 ${className ?? ""}`}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Enter address details to preview location
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-[8px] border border-[#E4E4E4] ${className ?? ""}`}>
      <iframe
        title="Address location on Google Maps"
        src={embedUrl}
        className={`${mapHeight} w-full border-0`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
