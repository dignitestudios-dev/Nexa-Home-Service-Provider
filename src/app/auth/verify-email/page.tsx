"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  clearPendingVerifyEmail,
  getPendingVerifyEmail,
  setPendingVerifyEmail,
} from "@/lib/verify-email-storage";
import {
  persistAuthFromResponse,
  persistResetTokenFromResponse,
} from "@/lib/auth-session";
import { toast } from "@/lib/toast";
import { authService } from "@/services/auth.service";
import type { RootState } from "@/store/index";

/** Email from login/signup step only — not entered again on this screen */
function getLoginEmail(
  queryEmail: string,
  userEmail?: string | null,
  primaryIdentifier?: string | null,
) {
  return (
    queryEmail.trim().toLowerCase() ||
    getPendingVerifyEmail() ||
    userEmail?.trim().toLowerCase() ||
    primaryIdentifier?.trim().toLowerCase() ||
    ""
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.user);

  const queryEmail = searchParams.get("email") ?? "";
  const mode = searchParams.get("mode") === "reset" ? "reset" : "verify";
  const isResetMode = mode === "reset";
  const loginEmail = getLoginEmail(
    queryEmail,
    user?.email,
    user?.primaryIdentifier,
  );

  const [otpChars, setOtpChars] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otp = otpChars.join("");
  const isOtpComplete = otpChars.every((digit) => digit.length === 1);

  useEffect(() => {
    if (loginEmail) setPendingVerifyEmail(loginEmail);
  }, [loginEmail]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const updateOtp = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    setOtpChars((prev) => {
      const next = [...prev];
      next[index] = value.replace(/\D/g, "").slice(-1);
      return next;
    });
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    if (!digits) return;
    setOtpChars(Array.from({ length: 5 }, (_, i) => digits[i] ?? ""));
    inputRefs.current[Math.min(digits.length, 4)]?.focus();
  };

  const handleVerify = async () => {
    const email = getLoginEmail(
      queryEmail,
      user?.email,
      user?.primaryIdentifier,
    );

    if (!email) {
      setFormError("Session expired. Please log in again.");
      router.push("/auth/login");
      return;
    }
    if (!isOtpComplete) {
      setFormError("Please enter the complete 5-digit OTP.");
      return;
    }

    setFormError(null);
    setIsLoading(true);

    try {
      const response = await authService.verifyEmail({
        email,
        role: "service-provider",
        otp,
        mode,
      });

      const resetToken = persistResetTokenFromResponse(response);

      if (resetToken || isResetMode) {
        toast.fromApiSuccess(response, "OTP verified successfully.");

        if (!resetToken) {
          toast.error("Reset session failed. Please request a new code.");
          return;
        }

        router.replace(
          `/auth/change-password?email=${encodeURIComponent(email)}`,
        );
        return;
      }

      persistAuthFromResponse(response, dispatch);
      clearPendingVerifyEmail();
      toast.fromApiSuccess(response, "Email verified successfully.");
      router.replace("/onboarding/profile-setup");
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Invalid or expired OTP. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const email = getLoginEmail(
      queryEmail,
      user?.email,
      user?.primaryIdentifier,
    );

    if (!email) {
      setFormError("Session expired. Please log in again.");
      return;
    }

    setFormError(null);
    setIsResendLoading(true);

    try {
      await authService.resendOtp({ email });
      setTimer(30);
      setOtpChars(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Could not resend OTP."));
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <div className="relative w-full self-stretch min-h-[560px]">
      <Link
        href={isResetMode ? "/auth/forgot-password" : "/auth/login"}
        className="absolute left-0 top-0 z-10 inline-flex cursor-pointer items-center justify-center w-12 h-12 rounded-full text-[#181818] hover:bg-black/5"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="relative z-20 w-full max-w-[496px] min-h-[560px] mx-auto">
        <div className="text-center mt-[122px]">
          <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
            Verification
          </h1>
          <p className="mt-2 text-[16px] leading-[22px] text-black/80">
            Enter the code sent to{" "}
            <span className="text-[#005864]">{loginEmail || "your email"}</span>
          </p>
        </div>

        <div className="mt-[68px] flex justify-center gap-4">
          {otpChars.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              value={digit}
              type="text"
              maxLength={1}
              inputMode="numeric"
              onChange={(e) => updateOtp(e.target.value, i)}
              onPaste={handlePaste}
              className="w-[60px] h-[60px] text-center text-[24px] font-semibold rounded-[12px] bg-[#F8F8F8] border border-transparent focus:border-[#005864] focus:outline-none text-[#005864]"
            />
          ))}
        </div>

        {formError && (
          <p className="mt-2 text-center text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        <p className="text-[16px] leading-[22px] text-black/80 mt-4 text-center">
          Didn&apos;t receive code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0 || isResendLoading || !loginEmail}
            className="cursor-pointer font-medium text-[#005864] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </p>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isLoading || !isOtpComplete || !loginEmail}
          className="w-[388px] mx-auto block h-[48px] mt-8 cursor-pointer bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-[560px]" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
