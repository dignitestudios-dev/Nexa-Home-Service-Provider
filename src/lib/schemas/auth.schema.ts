import { z } from "zod";

/* ---------------- EMAIL ---------------- */
export const emailSchema = z.string().min(1, "Email is required").email("Invalid email");


/* ---------------- PASSWORD ---------------- */

export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Z]/.test(val), {
    message: "Must contain at least 1 uppercase letter",
  })
  .refine((val) => /[^A-Za-z0-9]/.test(val), {
    message: "Must contain at least 1 special character (!@#$%^&* etc.)",
  });

/* ---------------- LOGIN FLOW (email check + login/signup) ---------------- */
export const loginFlowEmailSchema = z.object({
  email: emailSchema,
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

/** Login only — no strength rules (existing users may have any password). */
export const loginPasswordSchema = z
  .string()
  .min(1, "Password is required");

export const loginFlowLoginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
  confirmPassword: z.string().optional(),
});

export const loginFlowSignupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFlowSchema = loginFlowEmailSchema;

/* ---------------- LOGIN ---------------- */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/* ---------------- SIGNUP ---------------- */
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    companyName: z
      .string()
      .max(120, "Company name is too long")
      .optional()
      .or(z.literal("")),
    email: emailSchema,
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length === 10) return true;
        return digits.length === 11 && digits.startsWith("1");
      }, "Enter a valid US phone number (e.g. (202) 555-0156)"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    acceptTerms: z
      .boolean()
      .refine((value) => value, "Please accept Terms & Conditions"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});


/* ---------------- OTP ---------------- */
export const otpSchema = z.object({
  otp: z.string().length(5, "OTP must be 5 digits"),
});


/* ---------------- RESET PASSWORD ---------------- */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* ---------------- CHANGE PASSWORD (settings) ---------------- */
export const changePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });