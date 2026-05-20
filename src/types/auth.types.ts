export type AuthMethod = "email";
export type AuthRole = "service-provider" | "partner";
export type AuthMode = "verify" | "reset";

export interface CheckEmailPayload {
  email: string;
}

export interface RegisterAuthPayload {
  email: string;
  method: AuthMethod;
  role: AuthRole;
  password: string;
}

export interface LoginAuthPayload {
  email: string;
  password: string;
  method: AuthMethod;
  role: AuthRole;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
  role: AuthRole;
  mode: AuthMode;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ChangePhonePayload {
  phone: string;
}

export interface VerifyChangePhonePayload {
  phone: string;
  otp: string;
}

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

export interface CheckEmailResponse {
  success?: boolean;
  exists?: boolean;
  emailExists?: boolean;
  isRegistered?: boolean;
  registered?: boolean;
  userExists?: boolean;
  data?: {
    exists?: boolean;
  };
  message?: string;
}
