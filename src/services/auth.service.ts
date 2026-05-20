import { API } from "@/lib/axios";
import { parseEmailExists } from "@/lib/auth-utils";
import type {
  CheckEmailPayload,
  LoginAuthPayload,
  RegisterAuthPayload,
  ResendOtpPayload,
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
    const { data } = await API.post(
      "/auth/email-verification-otp",
      payload
    );
    return data;
  },
};
