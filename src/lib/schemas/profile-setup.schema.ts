// schemas/profileSetup.schema.ts

import { z } from "zod";
import {
  PORTFOLIO_MAX_FILES,
  validatePortfolioFile,
} from "@/lib/portfolio-media-validation";

export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const PROFILE_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const;

export const PROFILE_IMAGE_ACCEPT = "image/png,image/jpeg,.png,.jpg,.jpeg";

export const PROFILE_IMAGE_SIZE_ERROR =
  "Profile image size must not exceed 5 MB";

function validateProfileImageFile(
  file: File,
  sizeErrorMessage: string,
): string | null {
  if (
    !PROFILE_IMAGE_MIME_TYPES.includes(
      file.type as (typeof PROFILE_IMAGE_MIME_TYPES)[number],
    )
  ) {
    return "Only PNG or JPG images are allowed";
  }

  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    return sizeErrorMessage;
  }

  return null;
}

export function validateProfileImage(
  file: File | null | undefined,
): string | null {
  if (!file) {
    return "Profile picture/logo is required";
  }

  return validateProfileImageFile(file, "Image must be 5MB or smaller");
}

export function validateOptionalProfileImage(
  file: File | null | undefined,
): string | null {
  if (!file) {
    return null;
  }

  return validateProfileImageFile(file, PROFILE_IMAGE_SIZE_ERROR);
}

const profileImageSchema = z
  .instanceof(File)
  .nullable()
  .refine((file) => file !== null, {
    message: "Profile picture/logo is required",
  })
  .refine(
    (file): file is File =>
      file !== null &&
      PROFILE_IMAGE_MIME_TYPES.includes(
        file.type as (typeof PROFILE_IMAGE_MIME_TYPES)[number],
      ),
    { message: "Only PNG or JPG images are allowed" },
  )
  .refine(
    (file): file is File =>
      file !== null && file.size <= PROFILE_IMAGE_MAX_BYTES,
    {
      message: "Image must be 5MB or smaller",
    },
  );

/** Letters only; may include spaces, hyphens, apostrophes (2–32 chars). */
export const PROFILE_NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]{1,31}$/;

export const OFFICE_NO_MAX_LENGTH = 30;
export const OFFICE_NO_PATTERN = /^[A-Za-z0-9]*$/;

export const ZIP_CODE_MAX_LENGTH = 8;

export const MAX_PROFILE_SERVICES = 3;

export const CATEGORY_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export const profileSetupSchema = z.object({
  profileImage: profileImageSchema,

  name: z
    .string()
    .trim()
    .max(32, "Name cannot exceed 32 characters")
    .refine(
      (value) => !value || PROFILE_NAME_PATTERN.test(value),
      "Name can only contain letters, spaces, hyphens and apostrophes (2–32 characters)",
    ),

  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(30, "Company name cannot exceed 30 characters"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 10) return true;
      return digits.length === 11 && digits.startsWith("1");
    }, "Enter a valid US phone number (e.g. (202) 555-0156)"),

  services: z
    .array(
      z
        .string()
        .regex(CATEGORY_ID_PATTERN, "Invalid category ID"),
    )
    .min(1, "Please select at least one service")
    .max(
      MAX_PROFILE_SERVICES,
      `You can select up to ${MAX_PROFILE_SERVICES} services only`,
    ),

  overview: z
    .string()
    .min(10, "Overview must be at least 10 characters")
    .max(500, "Overview cannot exceed 500 characters"),

  label: z.string().min(2, "Label is required"),

  address: z.string().min(3, "Address is required"),

  streetName: z.string().min(2, "Street name is required"),

  officeNo: z
    .string()
    .max(
      OFFICE_NO_MAX_LENGTH,
      `Office number cannot exceed ${OFFICE_NO_MAX_LENGTH} characters`,
    )
    .refine(
      (value) => value === "" || OFFICE_NO_PATTERN.test(value),
      "Office number must be alphanumeric only",
    ),

  zipCode: z
    .string()
    .min(3, "Zip code is required")
    .max(ZIP_CODE_MAX_LENGTH, `Zip code cannot exceed ${ZIP_CODE_MAX_LENGTH} characters`),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),

  acceptTerms: z
    .boolean()
    .refine((value) => value, "Please accept Terms & Conditions"),
});

export const BUSINESS_DOC_MAX_BYTES = 10 * 1024 * 1024;

export const BUSINESS_DOC_ACCEPT = ".jpg,.jpeg,.png,.pdf";

export const BUSINESS_DOC_LABELS = {
  businessLicense: "Business License",
  taxRegistration: "Tax Registration",
  ownershipCertificate: "Business/Ownership Certificate",
  proofOfAddress: "Proof of address",
} as const;

export type BusinessDocumentFieldKey = keyof typeof BUSINESS_DOC_LABELS;

const BUSINESS_DOC_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
] as const;

function createBusinessDocumentFileSchema(field: BusinessDocumentFieldKey) {
  const label = BUSINESS_DOC_LABELS[field];

  return z
    .instanceof(File, { message: `${label} is required` })
    .refine((file) => file.size > 0, { message: `${label} is required` })
    .refine(
      (file) =>
        BUSINESS_DOC_ACCEPTED_TYPES.includes(
          file.type as (typeof BUSINESS_DOC_ACCEPTED_TYPES)[number],
        ),
      { message: `${label}: only JPG, PNG and PDF files are allowed` },
    )
    .refine((file) => file.size <= BUSINESS_DOC_MAX_BYTES, {
      message: `${label} must be 10MB or smaller`,
    });
}

export function validateBusinessDocumentFile(
  file: File | null | undefined,
  field: BusinessDocumentFieldKey,
): string | null {
  if (!file) {
    return `${BUSINESS_DOC_LABELS[field]} is required`;
  }

  const result = createBusinessDocumentFileSchema(field).safeParse(file);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? `${BUSINESS_DOC_LABELS[field]} is invalid`;
}

export const businessDocumentsSchema = z.object({
  businessLicense: createBusinessDocumentFileSchema("businessLicense"),
  taxRegistration: createBusinessDocumentFileSchema("taxRegistration"),
  ownershipCertificate: createBusinessDocumentFileSchema("ownershipCertificate"),
  proofOfAddress: createBusinessDocumentFileSchema("proofOfAddress"),
});

const portfolioFileSchema = z.instanceof(File).superRefine((file, ctx) => {
  const message = validatePortfolioFile(file);
  if (message) {
    ctx.addIssue({ code: "custom", message });
  }
});

export const portfolioSchema = z.object({
  portfolioFiles: z
    .array(portfolioFileSchema)
    .min(1, "Please upload at least one image or video")
    .max(
      PORTFOLIO_MAX_FILES,
      `You can upload up to ${PORTFOLIO_MAX_FILES} items only`,
    ),
});

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const idFileSchema = z
  .instanceof(File, {
    message: "File is required",
  })

  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Only JPG, PNG and PDF files are allowed",
  })

  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 10MB",
  });

export function validateIdentityCardUploadFile(file: File): string | null {
  const result = idFileSchema.safeParse(file);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Invalid file";
}

export const identityCardSchema = z.object({
  idCardFront: idFileSchema,

  idCardBack: idFileSchema,
});

export type ProfileSetupFormData = z.input<typeof profileSetupSchema>;
export type ProfileSetupSubmitData = z.output<typeof profileSetupSchema>;
export type BusinessDocumentsFormData = z.infer<typeof businessDocumentsSchema>;
export type PortfolioFormData = z.infer<typeof portfolioSchema>;
export type IdentityCardFormData = z.infer<typeof identityCardSchema>;
