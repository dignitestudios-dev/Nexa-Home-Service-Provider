import { API } from "@/lib/axios";
import { parseEmailExists } from "@/lib/auth-utils";
import type {
  ChangePasswordPayload,
  ChangePhonePayload,
  CheckEmailPayload,
  ForgotPasswordPayload,
  LoginAuthPayload,
  RegisterAuthPayload,
  ResendOtpPayload,
  VerifyChangePhonePayload,
  VerifyEmailPayload,
} from "@/types/auth.types";

export const authService = {
  checkEmail: async (payload: CheckEmailPayload) => {
    const { data } = await API.post("/auth/check-email", payload);
    return {
      raw: data,
      exists: parseEmailExists(data),
    };
  },

  register: async (payload: RegisterAuthPayload) => {
    const { data } = await API.post("/auth", payload);
    return data;
  },

  login: async (payload: LoginAuthPayload) => {
    const { data } = await API.post("/auth", payload);
    return data;
  },

  verifyEmail: async (payload: VerifyEmailPayload) => {
    const { data } = await API.post("/auth/verify-email", payload);
    return data;
  },
  resendOtp: async (payload: ResendOtpPayload) => {
    const { data } = await API.post("/auth/email-verification-otp", payload);
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await API.post("/auth/forgot", payload);
    return data;
  },

  logout: async () => {
    const { data } = await API.post("/auth/logout");
    return data;
  },

  changePhone: async (payload: ChangePhonePayload) => {
    const { data } = await API.post("/auth/change-phone", payload);
    return data;
  },

  verifyChangePhone: async (payload: VerifyChangePhonePayload) => {
    const { data } = await API.post("/auth/verify-change-phone", payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const { data } = await API.post("/auth/change-password", payload);
    return data;
  },
};
