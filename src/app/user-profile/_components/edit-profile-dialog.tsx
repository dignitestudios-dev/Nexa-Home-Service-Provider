"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, Search, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog as DialogPrimitive } from "radix-ui";
import { toast } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { ServiceLimitModal } from "@/components/auth/service-limit-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateProfileMutation } from "@/hooks/user/use-update-profile-mutation";
import { useGetCategories } from "@/lib/category-query";
import { getApiErrorMessage, isCategoryLimitExceededError } from "@/lib/api-error";
import {
  getUserInitials,
  getUserProfilePictureUrl,
} from "@/lib/parse-user-profile";
import {
  editProfileSchema,
  type EditProfileFormData,
} from "@/lib/schemas/edit-profile.schema";
import {
  getMaxProfileServices,
  PROFILE_IMAGE_ACCEPT,
  validateOptionalProfileImage,
} from "@/lib/schemas/profile-setup.schema";
import type { User, UserCategory } from "@/store/slices/auth-slice";

type EditProfileDialogProps = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function getCategoryId(
  category: UserCategory | Record<string, unknown> | null | undefined,
): string {
  if (!category || typeof category !== "object") return "";

  const record = category as Record<string, unknown>;
  const rawId =
    typeof record.id === "string"
      ? record.id
      : typeof record._id === "string"
        ? record._id
        : "";

  return rawId.trim();
}

function toFormValues(user: User | null): EditProfileFormData {
  const categoryIDsFromSelected = (user?.selectedCategories ?? [])
    .map((category) => getCategoryId(category))
    .filter(Boolean);

  const rawCategoryIDs = (user as Record<string, unknown> | null)?.categoryIDs;
  const categoryIDsFromField = Array.isArray(rawCategoryIDs)
    ? rawCategoryIDs
        .map((raw) =>
          typeof raw === "string"
            ? raw.trim()
            : getCategoryId(raw as Record<string, unknown>),
        )
        .filter(Boolean)
    : [];

  return {
    name: typeof user?.name === "string" ? user.name.trim() : "",
    overview: typeof user?.overview === "string" ? user.overview.trim() : "",
    categoryIDs:
      categoryIDsFromSelected.length > 0
        ? categoryIDsFromSelected
        : categoryIDsFromField,
    profilePicture: null,
  };
}

function areCategoryIDsEqual(left: string[] = [], right: string[] = []): boolean {
  if (left.length !== right.length) return false;

  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();

  return sortedLeft.every((value, index) => value === sortedRight[index]);
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const serviceDropdownRef = useRef<HTMLDivElement | null>(null);
  const updateProfileMutation = useUpdateProfileMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isServiceLimitModalOpen, setIsServiceLimitModalOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: toFormValues(user),
  });

  const profileFile = watch("profilePicture");
  const name = watch("name");
  const overview = watch("overview");
  const categoryIDs = watch("categoryIDs") ?? [];
  const existingProfilePicture = getUserProfilePictureUrl(user);
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useGetCategories(1, 100);
  const categories = categoriesResponse?.data ?? [];
  const isServiceSubscribed = Boolean(user?.isServiceSubscribed);
  const maxServices = getMaxProfileServices(isServiceSubscribed);
  const displayName = user?.name?.trim() || user?.companyName?.trim() || "User";
  const initials = getUserInitials(displayName);

  const profilePreviewUrl = useMemo(() => {
    if (profileFile) return URL.createObjectURL(profileFile);
    return existingProfilePicture ?? "";
  }, [profileFile, existingProfilePicture]);

  useEffect(() => {
    return () => {
      if (profileFile && profilePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [profileFile, profilePreviewUrl]);

  useEffect(() => {
    if (!open) return;
    reset(toFormValues(user));
    setFormError(null);
    setShowDiscardConfirm(false);
    setIsServiceLimitModalOpen(false);
    setIsServiceDropdownOpen(false);
    setServiceSearch("");
  }, [open, user, reset]);

  useEffect(() => {
    if (!isServiceDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!serviceDropdownRef.current?.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isServiceDropdownOpen]);

  const selectedServicesText = useMemo(() => {
    if (categoryIDs.length === 0) return "Select Services";

    const names = categories
      .filter((category) => categoryIDs.includes(category._id))
      .map((category) => category.name);

    return names.length > 0 ? names.join(", ") : "Select Services";
  }, [categoryIDs, categories]);

  const filteredServices = categories.filter((category) =>
    category.name.toLowerCase().includes(serviceSearch.toLowerCase()),
  );

  const hasUnsavedChanges = useMemo(() => {
    const baseline = toFormValues(user);
    return (
      name.trim() !== baseline.name ||
      overview.trim() !== baseline.overview ||
      !areCategoryIDsEqual(categoryIDs, baseline.categoryIDs) ||
      profileFile !== null
    );
  }, [name, overview, categoryIDs, profileFile, user]);

  const requestClose = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
      return;
    }

    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      onOpenChange(true);
      return;
    }

    requestClose();
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    onOpenChange(false);
  };

  const handleProfileImageSelect = (file: File | null) => {
    const validationError = validateOptionalProfileImage(file);
    if (validationError) {
      toast.error(validationError);
      setValue("profilePicture", null, { shouldValidate: true });
      setError("profilePicture", { type: "manual", message: validationError });
      return;
    }

    clearErrors("profilePicture");
    setValue("profilePicture", file, { shouldValidate: true });
  };

  const showValidationToast = (fieldErrors: FieldErrors<EditProfileFormData>) => {
    const message =
      fieldErrors.name?.message ||
      fieldErrors.overview?.message ||
      fieldErrors.categoryIDs?.message ||
      fieldErrors.profilePicture?.message;

    if (message) {
      toast.error(message);
    }
  };

  const handleUpgradePlan = () => {
    setIsServiceLimitModalOpen(false);
    onOpenChange(false);
    router.push("/profile-settings/service-plan");
  };

  const onSubmit = handleSubmit(async (data) => {
    setFormError(null);

    try {
      await updateProfileMutation.mutateAsync({
        name: data.name.trim(),
        overview: data.overview.trim(),
        categoryIDs: [
          ...new Set(data.categoryIDs.map((id) => id.trim()).filter(Boolean)),
        ],
        profilePicture: data.profilePicture ?? undefined,
      });

      onOpenChange(false);
    } catch (error) {
      if (isCategoryLimitExceededError(error)) {
        setFormError(null);
        setIsServiceLimitModalOpen(true);
        return;
      }

      setFormError(getApiErrorMessage(error));
    }
  }, showValidationToast);

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden rounded-[20px] p-0 sm:max-w-[560px]"
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="shrink-0 border-b border-black/5 px-6 py-5">
          <DialogTitle className="text-[24px] font-semibold leading-[30px] text-[#1C1C1C]">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="flex flex-col items-center">
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
                profilePreviewUrl.startsWith("blob:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePreviewUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={profilePreviewUrl}
                    alt="Profile preview"
                    width={106}
                    height={106}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[rgba(0,88,100,0.15)] text-2xl font-bold text-[#005864]">
                  {initials}
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex items-center gap-2 text-[16px] font-medium leading-5 text-[#1C1C1C] underline"
            >
              <Upload className="h-4 w-4 text-[#005864]" />
              Upload Profile Picture
            </button>

            <p className="mt-1 text-center text-xs text-[#181818]/60">
              PNG or JPG only, max 5MB
            </p>

            {errors.profilePicture ? (
              <p className="mt-2 text-sm text-red-500">
                {errors.profilePicture.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
              Name
            </label>
            <Input
              {...register("name")}
              maxLength={32}
              placeholder="Enter your name"
              autoComplete="name"
              className="mt-1 h-12 rounded-[12px] border-0 bg-[#F8F8F8] px-4"
            />
            {errors.name ? (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
              Overview
            </label>
            <div className="mt-1 rounded-[12px] bg-[#F8F8F8] p-3">
              <textarea
                {...register("overview")}
                maxLength={500}
                placeholder="Write here"
                className="h-[120px] w-full resize-none bg-transparent text-[16px] leading-5 text-[#1C1C1C] placeholder:text-black/55 outline-none"
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              {errors.overview ? (
                <p className="text-sm text-red-500">{errors.overview.message}</p>
              ) : (
                <span />
              )}
              <span className="text-[14px] text-black/50">
                {overview.length}/500
              </span>
            </div>
          </div>

          <div ref={serviceDropdownRef}>
            <label className="text-[16px] font-medium leading-5 text-[#1C1C1C]">
              Services
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

            {errors.categoryIDs ? (
              <p className="mt-1 text-sm text-red-500">
                {errors.categoryIDs.message}
              </p>
            ) : null}

            {isServiceDropdownOpen ? (
              <div className="mt-2 rounded-[12px] bg-[#F9FAFA] p-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/45"
                  />
                  <Input
                    value={serviceSearch}
                    onChange={(event) => setServiceSearch(event.target.value)}
                    placeholder="Search here"
                    className="h-12 rounded-[24px] border-0 bg-[#E6E6E6] pl-11 pr-4 text-[16px] placeholder:text-black/55 focus-visible:ring-0"
                  />
                </div>

                <div className="mt-4 max-h-[130px] space-y-3 overflow-y-auto pr-1">
                  {categoriesLoading ? (
                    <p className="text-sm text-black/60">Loading...</p>
                  ) : (
                    filteredServices.map((category) => {
                      const checked = categoryIDs.includes(category._id);

                      return (
                        <label
                          key={category._id}
                          className="flex cursor-pointer items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => {
                              if (event.target.checked) {
                                if (categoryIDs.length >= maxServices) {
                                  if (isServiceSubscribed) {
                                    toast.error(
                                      `You can select up to ${maxServices} services only.`,
                                    );
                                  } else {
                                    setIsServiceLimitModalOpen(true);
                                  }
                                  return;
                                }

                                setValue(
                                  "categoryIDs",
                                  [...categoryIDs, category._id],
                                  { shouldValidate: true },
                                );
                                return;
                              }

                              setValue(
                                "categoryIDs",
                                categoryIDs.filter((id) => id !== category._id),
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
            ) : null}
          </div>

          {formError ? (
            <p className="text-sm text-red-500">{formError}</p>
          ) : null}
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-black/5 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={requestClose}
              disabled={updateProfileMutation.isPending}
              className="h-11 rounded-[12px] px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="h-11 rounded-[12px] bg-[#005864] px-8 text-white hover:bg-[#004851]"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <ServiceLimitModal
      open={isServiceLimitModalOpen}
      onClose={() => setIsServiceLimitModalOpen(false)}
      onUpgradePlan={handleUpgradePlan}
      maxServices={maxServices}
    />

    <Dialog
      open={showDiscardConfirm}
      onOpenChange={(isOpen) => {
        if (!isOpen) setShowDiscardConfirm(false);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="z-[220] bg-black/50 backdrop-blur-md" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-[230] grid w-[360px] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-[360px]">
          <div className="flex flex-col items-center px-5 pb-5 pt-8">
            <AlertTriangle
              className="h-[42px] w-[42px] text-[#F01A1A]"
              strokeWidth={2.2}
              aria-hidden
            />

            <div className="mt-3 flex w-full max-w-[280px] flex-col items-center gap-2 text-center">
              <DialogTitle className="w-full text-[24px] font-[700] capitalize leading-[30px] text-[#181818]">
                Unsaved Changes
              </DialogTitle>
              <DialogDescription className="w-full text-[16px] font-[400] leading-5 text-[#181818]/80">
                You have unsaved changes. Are you sure you want to exit without
                saving?
              </DialogDescription>
            </div>

            <div className="mt-6 grid w-full grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="h-[49px] cursor-pointer rounded-[12px] bg-[rgba(0,88,100,0.06)] text-[12px] font-[600] leading-[15px] text-[#005864] transition hover:bg-[rgba(0,88,100,0.1)]"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="h-[49px] cursor-pointer rounded-[12px] bg-[#F01A1A] text-[12px] font-[600] leading-[15px] text-white transition hover:bg-[#d91717]"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
    </>
  );
}
