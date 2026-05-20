"use client";

import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { authService } from "@/services/auth.service";
import type {
  CheckEmailPayload,
  LoginAuthPayload,
  RegisterAuthPayload,
  ResendOtpPayload,
  VerifyEmailPayload,
} from "@/types/auth.types";

function saveAuthToken(data: unknown) {
  if (!data || typeof data !== "object") return;

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  const token =
    (typeof record.token === "string" && record.token) ||
    (typeof record.accessToken === "string" && record.accessToken) ||
    (nested &&
      ((typeof nested.token === "string" && nested.token) ||
        (typeof nested.accessToken === "string" && nested.accessToken))) ||
    null;

  if (token) {
    Cookies.set("token", token, { expires: 7 });
  }
}

export function useCheckEmail() {
  return useMutation({
    mutationFn: (payload: CheckEmailPayload) => authService.checkEmail(payload),
  });
}

export function useRegisterAuth() {
  return useMutation({
    mutationFn: (payload: RegisterAuthPayload) => authService.register(payload),
    onSuccess: (data) => {
      saveAuthToken(data);
      
    },
  });
}

export function useLoginAuth() {
  return useMutation({
    mutationFn: (payload: LoginAuthPayload) => authService.login(payload),
    onSuccess: (data) => {
      saveAuthToken(data);
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authService.verifyEmail(payload),
    onSuccess: (data) => {
      saveAuthToken(data);
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
  });
}
