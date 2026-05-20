import { z } from "zod";

/* ---------------- EMAIL ---------------- */
export const emailSchema = z.string().min(1, "Email is required").email("Invalid email");


/* ---------------- PASSWORD ---------------- */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((val) => /[A-Z]/.test(val), {
    message: "Must contain 1 uppercase letter",
  })
  .refine((val) => /[!@#$%^&*]/.test(val), {
    message: "Must contain 1 special character",
  });


/* ---------------- LOGIN FLOW (email check + login/signup) ---------------- */
export const loginFlowSchema = z
  .object({
    email: emailSchema,
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const password = data.password?.trim() ?? "";
    const confirmPassword = data.confirmPassword?.trim() ?? "";

    if (!password) return;

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      ctx.addIssue({
        code: "custom",
        message: passwordResult.error.issues[0]?.message ?? "Invalid password",
        path: ["password"],
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const loginFlowSignupSchema = loginFlowSchema.superRefine((data, ctx) => {
  if (!data.confirmPassword?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Confirm password is required",
      path: ["confirmPassword"],
    });
  }
});

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
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });