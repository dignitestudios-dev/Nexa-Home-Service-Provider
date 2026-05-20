const VERIFY_EMAIL_KEY = "nexa_pending_verify_email";

export function setPendingVerifyEmail(email: string) {
  if (typeof window === "undefined") return;
  const normalized = email.trim().toLowerCase();
  sessionStorage.setItem(VERIFY_EMAIL_KEY, normalized);
  localStorage.setItem(VERIFY_EMAIL_KEY, normalized);
}

export function getPendingVerifyEmail(): string {
  if (typeof window === "undefined") return "";
  return (
    sessionStorage.getItem(VERIFY_EMAIL_KEY)?.trim().toLowerCase() ??
    localStorage.getItem(VERIFY_EMAIL_KEY)?.trim().toLowerCase() ??
    ""
  );
}

export function clearPendingVerifyEmail() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(VERIFY_EMAIL_KEY);
  localStorage.removeItem(VERIFY_EMAIL_KEY);
}
