"use client";

import { useMutation } from "@tanstack/react-query";

import { clearAuthSession, persistAuthFromResponse } from "@/lib/auth-session";
import { authService } from "@/services/auth.service";
import { setPendingVerifyEmail } from "@/lib/verify-email-storage";
import type {
  CheckEmailPayload,
  ForgotPasswordPayload,
  LoginAuthPayload,
  RegisterAuthPayload,
  ResendOtpPayload,
  VerifyEmailPayload,
} from "@/types/auth.types";
import { useDispatch } from "react-redux";

export function useCheckEmail() {
  return useMutation({
    mutationFn: (payload: CheckEmailPayload) => authService.checkEmail(payload),
  });
}

export function useRegisterAuth() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: RegisterAuthPayload) => authService.register(payload),
    onSuccess: (data, variables) => {
      persistAuthFromResponse(data, dispatch);
      setPendingVerifyEmail(variables.email);
    },
  });
}

export function useLoginAuth() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: LoginAuthPayload) => authService.login(payload),
    onSuccess: (data, variables) => {
      persistAuthFromResponse(data, dispatch);
      setPendingVerifyEmail(variables.email);
    },
  });
}

/** Verify OTP — caller handles redirect / session (signup vs reset). */
export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authService.verifyEmail(payload),
  });
}

export function useVerifyEmail() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authService.verifyEmail(payload),
    onSuccess: (data) => {
      persistAuthFromResponse(data, dispatch);
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authService.forgotPassword(payload),
  });
}

export function useLogoutAuth() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuthSession(dispatch);
    },
  });
}
