export type AuthMethod = "email" | "google";
export type AuthRole = "service-provider" | "partner";
export type AuthMode = "verify" | "reset";

export interface CheckEmailPayload {
  email: string;
  role: string;
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
  method: Extract<AuthMethod, "email">;
  role: AuthRole;
}

export interface GoogleAuthPayload {
  email: string;
  method: Extract<AuthMethod, "google">;
  role: AuthRole;
  idToken: string;
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

export interface ForgotPasswordPayload {
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
  resetToken?: string;
}

export interface UpdatePasswordPayload {
  password: string;
  // newPassword: string;
  resetToken?: string;
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
