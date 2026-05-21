// schemas/profileSetup.schema.ts

import { z } from "zod";

export const profileSetupSchema = z.object({
  profileImage: z
    .instanceof(File, { message: "Profile image is required" })
    .nullable(),

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

export const MAX_FILES = 10;

const portfolioFileSchema = z.instanceof(File);

export const portfolioSchema = z.object({
  portfolioFiles: z
    .array(portfolioFileSchema)
    .min(1, "Please upload at least one file")
    .max(MAX_FILES, `Maximum ${MAX_FILES} files allowed`),
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

export const identityCardSchema = z.object({
  idCardFront: idFileSchema,

  idCardBack: idFileSchema,
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
export type BusinessDocumentsFormData = z.infer<typeof businessDocumentsSchema>;
export type PortfolioFormData = z.infer<typeof portfolioSchema>;
export type IdentityCardFormData = z.infer<typeof identityCardSchema>;
