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
import { useDispatch } from "react-redux";
import { setToken, singUp } from "@/store/slices/auth-slice";

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
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: RegisterAuthPayload) => authService.register(payload),
    onSuccess: (data) => {
      saveAuthToken(data);
      dispatch(singUp(data?.data));
      dispatch(setToken(data?.token || data?.accessToken || null));
    },
  });
}

export function useLoginAuth() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: LoginAuthPayload) => authService.login(payload),
    onSuccess: (data) => {
      saveAuthToken(data);
      dispatch(singUp(data?.data));
    },
  });
}

export function useVerifyEmail() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      authService.verifyEmail(payload),
    onSuccess: (data) => {
      saveAuthToken(data);
      dispatch(singUp(data?.data));
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => authService.resendOtp(payload),
  });
}
