// schemas/profileSetup.schema.ts

import { z } from "zod";
import {
  PORTFOLIO_MAX_FILES,
  validatePortfolioFile,
} from "@/lib/portfolio-media-validation";

export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const PROFILE_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"] as const;

export const PROFILE_IMAGE_ACCEPT = "image/png,image/jpeg,.png,.jpg,.jpeg";

export function validateProfileImage(file: File | null | undefined): string | null {
  if (!file) {
    return "Profile picture/logo is required";
  }

  if (
    !PROFILE_IMAGE_MIME_TYPES.includes(
      file.type as (typeof PROFILE_IMAGE_MIME_TYPES)[number],
    )
  ) {
    return "Only PNG or JPG images are allowed";
  }

  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    return "Image must be 5MB or smaller";
  }

  return null;
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
  .refine((file): file is File => file !== null && file.size <= PROFILE_IMAGE_MAX_BYTES, {
    message: "Image must be 5MB or smaller",
  });

export const profileSetupSchema = z.object({
  profileImage: profileImageSchema,

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  services: z.array(z.string()).min(1, "Please select at least one service"),

  overview: z
    .string()
    .min(10, "Overview must be at least 10 characters")
    .max(120, "Overview cannot exceed 120 characters"),

  label: z.string().min(2, "Label is required"),

  address: z.string().min(3, "Address is required"),

  streetName: z.string().min(2, "Street name is required"),

  officeNo: z.string().optional(),

  zipCode: z.string().min(3, "Zip code is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

const fileSchema = z
  .instanceof(File, {
    message: "File is required",
  })
  .refine((file) => file.size > 0, {
    message: "File is required",
  });

export const businessDocumentsSchema = z.object({
  businessLicense: fileSchema,
  taxRegistration: fileSchema,
  ownershipCertificate: fileSchema,
  proofOfAddress: fileSchema,
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

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const idFileSchema = z
  .instanceof(File, {
    message: "File is required",
  })

  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "Only JPG, PNG and PDF files are allowed",
  })

  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "File size must be less than 20MB",
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
