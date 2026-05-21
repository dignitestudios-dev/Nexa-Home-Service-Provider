const RESET_FLOW_KEY = "nexa_password_reset_flow";
const RESET_TOKEN_KEY = "nexa_reset_token";

export function setPasswordResetSession(resetToken: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESET_FLOW_KEY, "1");
  sessionStorage.setItem(RESET_TOKEN_KEY, resetToken);
}

export function isPasswordResetFlow(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(RESET_FLOW_KEY) === "1";
}

export function getPasswordResetToken(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(RESET_TOKEN_KEY) ?? "";
}

export function clearPasswordResetSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESET_FLOW_KEY);
  sessionStorage.removeItem(RESET_TOKEN_KEY);
}
