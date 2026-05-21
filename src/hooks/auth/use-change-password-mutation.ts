"use client";

import { useMutation } from "@tanstack/react-query";

import { getAuthTokenCookie } from "@/lib/auth-session";
import { getPasswordResetToken } from "@/lib/reset-password-storage";
import { authService } from "@/services/auth.service";
import type { ChangePasswordPayload } from "@/types/auth.types";

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
  });
}

/** Forgot-password flow: uses `resetToken` from verify-email OTP as Bearer. */
export function useResetChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => {
      const resetToken = getAuthTokenCookie() || getPasswordResetToken();
      if (!resetToken) {
        throw new Error("Reset session expired. Please verify OTP again.");
      }
      return authService.changePassword(payload, resetToken);
    },
  });
}
