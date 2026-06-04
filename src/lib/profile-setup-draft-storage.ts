import type { ProfileSetupFormData } from "@/lib/schemas/profile-setup.schema";

const DRAFT_KEY_PREFIX = "nexa_profile_setup_draft";
const MAX_PROFILE_IMAGE_BYTES_FOR_DRAFT = 2 * 1024 * 1024;

export type ProfileSetupDraftImage = {
  dataUrl: string;
  name: string;
  type: string;
};

export type ProfileSetupDraft = {
  name: string;
  companyName: string;
  phoneNumber: string;
  services: string[];
  overview: string;
  label: string;
  address: string;
  streetName: string;
  officeNo: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  country: string;
  state: string;
  city: string;
  acceptTerms: boolean;
  profileImage: ProfileSetupDraftImage | null;
};

function getDraftStorageKey(userId?: string | null): string {
  const normalizedUserId = userId?.trim();
  return normalizedUserId
    ? `${DRAFT_KEY_PREFIX}_${normalizedUserId}`
    : DRAFT_KEY_PREFIX;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function dataUrlToFile(
  dataUrl: string,
  fileName: string,
  mimeType: string,
): File | null {
  try {
    const [header, base64] = dataUrl.split(",");
    if (!header?.includes("base64") || !base64) return null;

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    const type =
      mimeType ||
      header.match(/data:(.*?);/)?.[1] ||
      "application/octet-stream";

    return new File([bytes], fileName || "profile-image", { type });
  } catch {
    return null;
  }
}

function serializeDraft(
  values: ProfileSetupFormData,
  profileImage: ProfileSetupDraftImage | null,
): ProfileSetupDraft {
  return {
    name: values.name ?? "",
    companyName: values.companyName ?? "",
    phoneNumber: values.phoneNumber ?? "",
    services: Array.isArray(values.services) ? values.services : [],
    overview: values.overview ?? "",
    label: values.label ?? "",
    address: values.address ?? "",
    streetName: values.streetName ?? "",
    officeNo: values.officeNo ?? "",
    zipCode: values.zipCode ?? "",
    latitude: values.latitude ?? "",
    longitude: values.longitude ?? "",
    country: values.country ?? "",
    state: values.state ?? "",
    city: values.city ?? "",
    acceptTerms: Boolean(values.acceptTerms),
    profileImage,
  };
}

export async function saveProfileSetupDraft(
  values: ProfileSetupFormData,
  userId?: string | null,
): Promise<void> {
  if (typeof window === "undefined") return;

  let profileImage: ProfileSetupDraftImage | null = null;

  if (
    values.profileImage instanceof File &&
    values.profileImage.size > 0 &&
    values.profileImage.size <= MAX_PROFILE_IMAGE_BYTES_FOR_DRAFT
  ) {
    try {
      profileImage = {
        dataUrl: await fileToDataUrl(values.profileImage),
        name: values.profileImage.name,
        type: values.profileImage.type,
      };
    } catch {
      profileImage = null;
    }
  }

  const draft = serializeDraft(values, profileImage);

  try {
    sessionStorage.setItem(
      getDraftStorageKey(userId),
      JSON.stringify(draft),
    );
  } catch {
    const draftWithoutImage = serializeDraft(values, null);
    try {
      sessionStorage.setItem(
        getDraftStorageKey(userId),
        JSON.stringify(draftWithoutImage),
      );
    } catch {
      // Ignore storage quota errors.
    }
  }
}

export function loadProfileSetupDraft(
  userId?: string | null,
): ProfileSetupDraft | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(getDraftStorageKey(userId));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ProfileSetupDraft;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearProfileSetupDraft(userId?: string | null): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(getDraftStorageKey(userId));
}

export function draftToProfileSetupFormValues(
  draft: ProfileSetupDraft,
  fallbackName = "",
): Partial<ProfileSetupFormData> {
  const restoredImage = draft.profileImage
    ? dataUrlToFile(
        draft.profileImage.dataUrl,
        draft.profileImage.name,
        draft.profileImage.type,
      )
    : null;

  return {
    profileImage: restoredImage,
    name: draft.name || fallbackName,
    companyName: draft.companyName,
    phoneNumber: draft.phoneNumber,
    services: draft.services,
    overview: draft.overview,
    label: draft.label,
    address: draft.address,
    streetName: draft.streetName,
    officeNo: draft.officeNo,
    zipCode: draft.zipCode,
    latitude: draft.latitude,
    longitude: draft.longitude,
    country: draft.country,
    state: draft.state,
    city: draft.city,
    acceptTerms: draft.acceptTerms,
  };
}
