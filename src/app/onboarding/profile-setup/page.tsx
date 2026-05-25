"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  FileText,
  IdCard,
  Search,
  Upload,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { useCompleteProfileSetup } from "@/hooks/onboarding/profile-setup-mutation";
import { navigateToNextOnboardingStep } from "@/lib/onboarding-navigation";
import type { RootState } from "@/store/index";
import {
  ProfileSetupFormData,
  profileSetupSchema,
  PROFILE_IMAGE_ACCEPT,
  validateProfileImage,
} from "@/lib/schemas/profile-setup.schema";
import { toast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetCategories } from "@/lib/category-query";
import { ServiceLimitModal } from "@/components/auth/service-limit-modal";
import { extractAuthFromResponse } from "@/lib/auth-session";
import { getRedirectPath } from "@/lib/auth-utils";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: true },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Card", icon: IdCard, active: false },
];

// ─── Google Maps helpers ──────────────────────────────────────────────────────

const loadGoogleMapsScript = (callback: () => void) => {
  if (typeof window === "undefined") return;
  if ((window as any).google) {
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
};

function parseAddressComponents(components: any[]) {
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
    streetName: route || "",
    city,
    state,
    country,
    zipCode: zipCode.replace(/\D/g, ""),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileSetupOnboardingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const serviceDropdownRef = useRef<HTMLDivElement | null>(null);

  const [serviceSearch, setServiceSearch] = useState("");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isServiceLimitModalOpen, setIsServiceLimitModalOpen] = useState(false);

  // ── Google Maps state ──────────────────────────────────────────────────────
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const autocompleteInstanceRef = useRef<any>(null);
  // ──────────────────────────────────────────────────────────────────────────

  const completeProfileMutation = useCompleteProfileSetup();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      profileImage: null,
      name: user?.name?.trim() ?? "",
      services: [],
      overview: "",
      label: "",
      address: "",
      streetName: "",
      officeNo: "",
      zipCode: "",
      latitude: "",
      longitude: "",
      country: "",
      state: "",
      city: "",
    },
  });

  // =========================
  // WATCHERS
  // =========================

  const profileFile = watch("profileImage");
  const selectedServices = watch("services");
  const overview = watch("overview");

  // =========================
  // PREVIEW
  // =========================

  const profilePreviewUrl = useMemo(() => {
    if (!profileFile) return "";
    return URL.createObjectURL(profileFile);
  }, [profileFile]);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    };
  }, [profilePreviewUrl]);

  const handleProfileImageSelect = (file: File | null) => {
    const validationError = validateProfileImage(file);
    if (validationError) {
      toast.error(validationError);
      setValue("profileImage", null, { shouldValidate: true });
      setError("profileImage", { type: "manual", message: validationError });
      return;
    }

    clearErrors("profileImage");
    setValue("profileImage", file!, { shouldValidate: true });
  };

  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategories();

  const categories = categoriesResponse?.data ?? [];

  const selectedServicesText = useMemo(() => {
    if (selectedServices.length === 0) return "Select Services";
    const names = categories
      .filter((cat) => selectedServices.includes(cat._id))
      .map((cat) => cat.name);
    return names.join(", ");
  }, [selectedServices, categories]);

  const filteredServices = categories.filter((category) =>
    category.name.toLowerCase().includes(serviceSearch.toLowerCase()),
  );

  // =========================
  // GOOGLE MAPS — load script
  // =========================

  useEffect(() => {
    loadGoogleMapsScript(() => setIsMapsLoaded(true));
  }, []);

  // =========================
  // GOOGLE MAPS — helpers
  // =========================

  const updateFromPlace = (place: any, lat: number, lng: number) => {
    if (!place.address_components) return;
    const parsed = parseAddressComponents(place.address_components);

    // ✅ Save coordinates to form
    setValue("latitude", String(lat), { shouldValidate: true });
    setValue("longitude", String(lng), { shouldValidate: true });

    if (parsed.address)
      setValue("address", parsed.address.substring(0, 50), {
        shouldValidate: true,
      });
    if (parsed.streetName)
      setValue("streetName", parsed.streetName, { shouldValidate: true });
    if (parsed.zipCode)
      setValue("zipCode", parsed.zipCode.slice(0, 5), { shouldValidate: true });
    if (parsed.country)
      setValue("country", parsed.country, { shouldValidate: true });
    if (parsed.state) setValue("state", parsed.state, { shouldValidate: true });
    if (parsed.city) setValue("city", parsed.city, { shouldValidate: true });
  };

  const geocodeLatLng = (lat: number, lng: number) => {
    const google = (window as any).google;
    if (!google) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng } },
      (results: any, status: any) => {
        if (status === "OK" && results && results[0]) {
          updateFromPlace(results[0], lat, lng);
        }
      },
    );
  };

  // =========================
  // GOOGLE MAPS — init map
  // =========================

  useEffect(() => {
    if (!isMapsLoaded || !mapRef.current) return;

    const google = (window as any).google;
    if (!google) return;

    const defaultLat = 40.74;
    const defaultLng = -73.98;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: defaultLat, lng: defaultLng },
      zoom: 12,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });
    mapInstanceRef.current = map;

    const marker = new google.maps.Marker({
      position: { lat: defaultLat, lng: defaultLng },
      map,
      draggable: true,
    });
    markerInstanceRef.current = marker;

    // Autocomplete on the dedicated search input
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(
        searchInputRef.current,
        { types: ["address"] },
      );
      autocompleteInstanceRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();

        map.setCenter({ lat: newLat, lng: newLng });
        map.setZoom(16);
        marker.setPosition({ lat: newLat, lng: newLng });

        updateFromPlace(place, newLat, newLng);
      });
    }

    // Click on map
    map.addListener("click", (e: any) => {
      if (!e.latLng) return;
      const clickedLat = e.latLng.lat();
      const clickedLng = e.latLng.lng();
      marker.setPosition({ lat: clickedLat, lng: clickedLng });
      geocodeLatLng(clickedLat, clickedLng);
    });

    // Drag marker
    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (!pos) return;
      geocodeLatLng(pos.lat(), pos.lng());
    });
  }, [isMapsLoaded]);

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (data: ProfileSetupFormData) => {
    if (!data.profileImage) return;

    try {
      const response = await completeProfileMutation.mutateAsync({
        name: data.name.trim(),
        overview: data.overview,
        label: data.label,
        address: `${data.address}, ${data.streetName}, ${data.officeNo}`,
        country: data.country || "United States",
        state: data.state || "Pennsylvania",
        city: data.city || "Philadelphia",
        zipCode: data.zipCode,
        longitude: data.longitude ? parseFloat(data.longitude) : -75.1652,
        latitude: data.latitude ? parseFloat(data.latitude) : 39.9526,
        categoryIDs: data.services,
      });

      toast.fromApiSuccess(response, "Profile setup completed successfully.");

      navigateToNextOnboardingStep(router, dispatch, user, {
        apiResponse: response,
        completedFlags: { isProfileCompleted: true },
      });
    } catch (error) {
      toast.fromApiError(
        error,
        "Could not complete profile setup. Please try again.",
      );
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden bg-white py-3 pr-3 pl-1 md:py-5 md:pr-10 md:pl-0">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col rounded-[32px] bg-white p-0 lg:flex-row">
        {/* ── Mobile stepper ── */}
        <div className="rounded-[16px] bg-[#005864] p-3 lg:hidden">
          <div className="hide-scrollbar flex gap-3 overflow-x-auto">
            {stepItems.map((step) => {
              const Icon = step.icon;
              const isActive = step.active;
              return (
                <div
                  key={`mobile-${step.label}`}
                  className={`flex shrink-0 items-center gap-2 rounded-[10px] px-3 py-2 ${
                    isActive ? "bg-white" : "bg-white/20"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-[#005864]" : "text-white/80"}
                  />
                  <span
                    className={`text-[13px] font-medium ${
                      isActive ? "text-[#005864]" : "text-white"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Desktop sidebar ── */}
        <aside className="relative hidden h-full w-[400px] shrink-0 overflow-hidden rounded-[24px] bg-[url('/asset/sidebarbg.png')] bg-cover bg-center bg-no-repeat lg:block">
          <div className="relative z-10 flex h-full w-full items-start px-20 pt-[6em]">
            <div className="flex w-full max-w-[199px] flex-col gap-1">
              {stepItems.map((step, index) => {
                const Icon = step.icon;
                const isLastStep = index === stepItems.length - 1;
                const isActive = step.active;
                return (
                  <div key={step.label} className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${
                          isActive ? "bg-white" : "bg-white/30"
                        }`}
                      >
                        <Icon
                          size={23}
                          className={
                            isActive ? "text-[#005864]" : "text-white/70"
                          }
                        />
                      </div>
                      <span
                        className={`text-[14px] leading-[17px] tracking-[-0.008em] ${
                          isActive ? "text-white" : "text-white/60"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {!isLastStep && (
                      <div
                        className={`ml-6 h-8 w-px ${isActive ? "bg-white" : "bg-white/30"}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex h-full flex-1 justify-center overflow-y-auto px-4 py-6 sm:px-8 lg:px-16 lg:py-14">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[618px]"
          >
            <h1 className="text-center text-[32px] font-bold leading-[40px] text-[#1C1C1C]">
              Profile Setup
            </h1>

            {/* ========================= */}
            {/* PROFILE IMAGE */}
            {/* ========================= */}

            <div className="mt-8 flex flex-col items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept={PROFILE_IMAGE_ACCEPT}
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  handleProfileImageSelect(file);
                  event.target.value = "";
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[106px] w-[106px] items-center justify-center overflow-hidden rounded-full border border-dashed border-[#005864] bg-[#F9F9F9]"
              >
                {profilePreviewUrl ? (
                  <img
                    src={profilePreviewUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Upload size={20} className="text-[#005864]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 text-[16px] font-medium leading-5 text-[#1C1C1C] underline"
              >
                Upload Profile Picture/Logo*
              </button>

              <p className="mt-1 text-center text-xs text-[#181818]/60">
                PNG or JPG only, max 5MB (required)
              </p>

              {errors.profileImage && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.profileImage.message}
                </p>
              )}
            </div>

            <div className="mt-10 space-y-4">
              {/* ========================= */}
              {/* NAME */}
              {/* ========================= */}

              <div>
                <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                  Name*
                </label>
                <Input
                  {...register("name")}
                  maxLength={100}
                  placeholder="Enter your name"
                  className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* SERVICES */}
              {/* ========================= */}

              <div ref={serviceDropdownRef}>
                <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                  Select Service*
                </label>

                <button
                  type="button"
                  onClick={() => setIsServiceDropdownOpen((prev) => !prev)}
                  className="mt-1 flex h-12 w-full items-center justify-between rounded-[12px] bg-[#F8F8F8] px-4 text-left text-[16px] text-[#1C1C1C]"
                >
                  <span className="truncate pr-3">{selectedServicesText}</span>
                  <ChevronDown
                    size={18}
                    className={`text-black/70 transition-transform ${
                      isServiceDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {errors.services && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.services.message}
                  </p>
                )}

                {isServiceDropdownOpen && (
                  <div className="mt-2 rounded-[12px] bg-[#F9FAFA] p-3">
                    <div className="relative">
                      <Search
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/45"
                      />
                      <Input
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        placeholder="Search here"
                        className="h-12 rounded-[24px] border-0 bg-[#E6E6E6] pl-11 pr-4 text-[16px] placeholder:text-black/55 focus-visible:ring-0"
                      />
                    </div>

                    <div className="mt-4 max-h-[130px] space-y-3 overflow-y-auto pr-1">
                      {categoriesLoading ? (
                        <p className="text-sm text-black/60">Loading...</p>
                      ) : (
                        filteredServices.map((category) => {
                          const checked = selectedServices.includes(
                            category._id,
                          );
                          return (
                            <label
                              key={category._id}
                              className="flex cursor-pointer items-center gap-3"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (selectedServices.length >= 4) {
                                      setIsServiceLimitModalOpen(true);
                                      return;
                                    }
                                    setValue(
                                      "services",
                                      [...selectedServices, category._id],
                                      { shouldValidate: true },
                                    );
                                    return;
                                  }
                                  setValue(
                                    "services",
                                    selectedServices.filter(
                                      (id) => id !== category._id,
                                    ),
                                    { shouldValidate: true },
                                  );
                                }}
                                className="h-5 w-5 rounded-[2px] border border-black/80 accent-[#005864]"
                              />
                              <span className="text-[16px] leading-[22px] text-[#1C1C1C]">
                                {category.name}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ========================= */}
              {/* OVERVIEW */}
              {/* ========================= */}

              <div>
                <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
                  Overview*
                </label>

                <div className="mt-1 rounded-[12px] bg-[#F8F8F8] p-3">
                  <textarea
                    {...register("overview")}
                    maxLength={120}
                    placeholder="Write here"
                    className="h-[96px] w-full resize-none bg-transparent text-[16px] leading-5 text-[#1C1C1C] placeholder:text-black/55 outline-none"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  {errors.overview && (
                    <p className="text-sm text-red-500">
                      {errors.overview.message}
                    </p>
                  )}
                  <p className="ml-auto text-right text-[16px] leading-5 text-black/60">
                    {overview.length}/120
                  </p>
                </div>
              </div>

              {/* LABEL */}

              <div>
                <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                  Label This Address*
                </label>
                <Input
                  maxLength={50}
                  {...register("label")}
                  placeholder="e.g., Home, Office"
                  className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                />
                {errors.label && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.label.message}
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* GOOGLE MAP — placed before address fields */}
              {/* ========================= */}

              <div className="space-y-3">
                {/* Map search input */}
                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Search Location
                  </label>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for your address..."
                    className="mt-1 h-12 w-full rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] text-[#1C1C1C] placeholder:text-black/55 outline-none"
                  />
                </div>

                {/* Map container */}
                <div className="relative h-[200px] w-full overflow-hidden rounded-[12px] border border-[#005864]/30 bg-[#E8F7F7]">
                  {!isMapsLoaded ? (
                    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[#005864]">
                      Loading Google Maps...
                    </div>
                  ) : (
                    <div ref={mapRef} className="h-full w-full" />
                  )}
                </div>

                <p className="text-[13px] text-black/50">
                  Click on the map or drag the marker to auto-fill the address
                  fields below.
                </p>
              </div>

              {/* ADDRESS */}

              <div>
                <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                  Address*
                </label>
                <Input
                  {...register("address")}
                  placeholder="Los Angeles, CA"
                  className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* STREET */}

              <div>
                <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                  Street Name*
                </label>
                <Input
                  {...register("streetName")}
                  placeholder="Bay Street"
                  className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                />
                {errors.streetName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.streetName.message}
                  </p>
                )}
              </div>

              {/* OFFICE + ZIP */}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Office No.
                  </label>
                  <Input
                    {...register("officeNo")}
                    placeholder="e.g., 56"
                    className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="text-[16px] font-medium leading-[22px] tracking-[-0.408px] text-[#1C1C1C]">
                    Zip Code*
                  </label>
                  <Input
                    {...register("zipCode", {
                      onChange: (e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 5);
                        setValue("zipCode", value);
                      },
                    })}
                    placeholder="e.g., 12345"
                    className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
                    inputMode="numeric"
                    maxLength={5}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Hidden fields for Google Maps data */}
              <input type="hidden" {...register("country")} />
              <input type="hidden" {...register("state")} />
              <input type="hidden" {...register("city")} />
              <input type="hidden" {...register("latitude")} />
              <input type="hidden" {...register("longitude")} />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={completeProfileMutation.isPending}
              className="mx-auto mt-6 block h-12 w-full max-w-[500px] rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white hover:opacity-95 disabled:opacity-50"
            >
              {completeProfileMutation.isPending
                ? "Please wait..."
                : "Continue"}
            </button>
          </form>

          <ServiceLimitModal
            open={isServiceLimitModalOpen}
            onClose={() => setIsServiceLimitModalOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}
