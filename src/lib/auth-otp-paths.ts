const EMAIL_OTP_AUTH_PATHS = [
  "/auth/verify-email",
  "/auth/signup-verify-otp",
] as const;

export function isEmailOtpAuthPath(pathname: string): boolean {
  const basePath = pathname.split("?")[0];

  return EMAIL_OTP_AUTH_PATHS.some(
    (path) => basePath === path || basePath.startsWith(`${path}/`),
  );
}
