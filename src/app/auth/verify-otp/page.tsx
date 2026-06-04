"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useForgotPassword,
  useResendOtp,
  useVerifyEmailMutation,
} from "@/hooks/auth/use-auth-mutations";
import { persistResetTokenFromResponse } from "@/lib/auth-session";
import { toast } from "@/lib/toast";
import {
  getPendingVerifyEmail,
  setPendingVerifyEmail,
} from "@/lib/verify-email-storage";
import { setPasswordResetSession } from "@/lib/reset-password-storage";

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const verifyEmailMutation = useVerifyEmailMutation();
  const resendOtpMutation = useResendOtp();
  const forgotPasswordMutation = useForgotPassword();

  const emailFromQuery = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const email = useMemo(
    () => emailFromQuery || getPendingVerifyEmail(),
    [emailFromQuery],
  );
  const mode = searchParams.get("mode") === "reset" ? "reset" : "verify";
  const isResetMode = mode === "reset";

  const otpDigits = otp.replace(/\D/g, "");
  const isOtpComplete = otpDigits.length === 5;
  const isSubmitting =
    verifyEmailMutation.isPending ||
    resendOtpMutation.isPending ||
    forgotPasswordMutation.isPending;

  useEffect(() => {
    if (email) {
      setPendingVerifyEmail(email);
    }
  }, [email]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const updateOtp = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const arr = otpDigits.split("");
    while (arr.length < 5) arr.push("");
    arr[index] = value.slice(-1);
    setOtp(arr.join("").slice(0, 5));
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!digits) return;
    setOtp(digits.padEnd(5, "").slice(0, 5));
    inputRefs.current[Math.min(digits.length, 4)]?.focus();
  };

  const handleVerify = async () => {
    if (!email) {
      toast.error("Email is missing. Please try forgot password again.");
      return;
    }
    if (!isOtpComplete) {
      toast.error("Please enter the complete 5-digit code.");
      return;
    }

    try {
      const response = await verifyEmailMutation.mutateAsync({
        email,
        role: "service-provider",
        otp: otpDigits,
        mode,
      });

      const resetToken = persistResetTokenFromResponse(response);

      if (resetToken || isResetMode) {
        toast.fromApiSuccess(response, "OTP verified successfully.");

        if (!resetToken) {
          toast.error("Reset session failed. Please request a new code.");
          return;
        }

        setPasswordResetSession(resetToken);
        router.replace("/auth/change-password");
        return;
      }

      toast.fromApiSuccess(response, "OTP verified successfully.");
      router.replace("/onboarding/profile-setup");
    } catch (error) {
      toast.fromApiError(error, "Invalid or expired OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    try {
      if (isResetMode) {
        const response = await forgotPasswordMutation.mutateAsync({ email });
        toast.fromApiSuccess(
          response,
          "Verification code resent to your email.",
        );
      } else {
        const response = await resendOtpMutation.mutateAsync({ email });
        toast.fromApiSuccess(
          response,
          "Verification code resent to your email.",
        );
      }

      setTimer(60);
      setOtp("");
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.fromApiError(error, "Failed to resend OTP. Please try again.");
    }
  };

  const backHref = isResetMode ? "/auth/forgot-password" : "/auth/login";

  return (
    <div className="relative w-full self-stretch min-h-[560px]">
      <Link
        href={backHref}
        className="absolute left-0 top-0 inline-flex cursor-pointer items-center justify-center w-12 h-12 rounded-full text-[#181818] hover:bg-black/5"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="w-full max-w-[496px] min-h-[560px] mx-auto">
        <div className="text-center mt-[122px]">
          <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
            Verification
          </h1>
          <p className="mt-2 text-[16px] leading-[22px] text-black/80">
            Enter the code sent to{" "}
            <span className="text-[#005864]">{email || "your email"}</span>
          </p>
        </div>

        <div className="mt-[68px] flex justify-center gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                value={otpDigits[i] || ""}
                type="text"
                maxLength={1}
                inputMode="numeric"
                disabled={isSubmitting}
                onChange={(e) => updateOtp(e.target.value, i)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otpDigits[i] && i > 0) {
                    inputRefs.current[i - 1]?.focus();
                  }
                }}
                onPaste={handlePaste}
                className="h-[60px] w-[60px] rounded-[12px] border border-transparent bg-[#F8F8F8] text-center text-[24px] font-semibold text-[#005864] focus:border-[#005864] focus:outline-none disabled:opacity-60"
              />
            ))}
        </div>

        <p className="mt-4 text-center text-[16px] leading-[22px] text-black/80">
          Didn&apos;t receive code?{" "}
          <button
            onClick={handleResend}
            type="button"
            disabled={timer > 0 || isSubmitting || !email}
            className={`gap-2 font-medium text-[#005864] ${
              timer > 0 || isSubmitting || !email
                ? "opacity-50 cursor-not-allowed"
                : "hover:underline"
            }`}
          >
            {forgotPasswordMutation.isPending || resendOtpMutation.isPending
              ? "Sending..."
              : timer > 0
                ? `Resend OTP in ${timer}s`
                : "Resend OTP"}
          </button>
        </p>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isSubmitting || !email || !isOtpComplete}
          className="mx-auto mt-8 block h-[48px] w-[388px] cursor-pointer rounded-[12px] bg-[#005864] text-[16px] font-[600] capitalize text-white hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifyEmailMutation.isPending ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-[560px]" />}>
      <VerificationContent />
    </Suspense>
  );
}
