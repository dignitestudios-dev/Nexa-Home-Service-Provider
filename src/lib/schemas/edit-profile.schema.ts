import { z } from "zod";

import {
  CATEGORY_ID_PATTERN,
  MAX_PROFILE_SERVICES,
  validateOptionalProfileImage,
} from "@/lib/schemas/profile-setup.schema";

export const editProfileSchema = z.object({
  name: z.string().trim().max(32, "Name cannot exceed 32 characters"),

  overview: z
    .string()
    .trim()
    .min(10, "Overview must be at least 10 characters")
    .max(500, "Overview cannot exceed 500 characters"),

  categoryIDs: z
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

  profilePicture: z
    .union([z.instanceof(File), z.null()])
    .optional()
    .superRefine((file, ctx) => {
      if (!file) return;
      const message = validateOptionalProfileImage(file);
      if (message) {
        ctx.addIssue({ code: "custom", message });
      }
    }),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
