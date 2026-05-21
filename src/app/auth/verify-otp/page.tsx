"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getApiErrorMessage } from "@/lib/api-error";
import { persistAuthFromResponse } from "@/lib/auth-session";
import { useResendOtp } from "@/hooks/auth/use-auth-mutations";
import { authService } from "@/services/auth.service";

function VerificationContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const mode = searchParams.get("mode") === "reset" ? "reset" : "verify";
  const otpDigits = otp.replace(/\D/g, "");
  const isOtpComplete = otpDigits.length === 5;

  const resendOtpMutation = useResendOtp();

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

  const handleVerify = async () => {
    if (!email) {
      setFormError("Email is missing.");
      return;
    }
    if (!isOtpComplete) {
      setFormError("Please enter the complete 5-digit code.");
      return;
    }

    setFormError(null);
    setIsLoading(true);

    try {
      const response = await authService.verifyEmail({
        email,
        role: "service-provider",
        otp: otpDigits,
        mode,
      });

      if (mode !== "reset") {
        persistAuthFromResponse(response, dispatch);
      }

      if (mode === "reset") {
        router.push(`/auth/change-password?email=${encodeURIComponent(email)}`);
        return;
      }

      router.push("/onboarding/profile-setup");
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Invalid or expired OTP. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtpMutation.mutateAsync({
        email,
      });
      setTimer(30);
      setOtp("");
      inputRefs.current[0]?.focus();
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Failed to resend OTP. Please try again."),
      );
    }
  };

  return (
    <div className="relative w-full self-stretch min-h-[560px]">
      <Link
        href="/auth/forgot-password"
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
                onChange={(e) => updateOtp(e.target.value, i)}
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
            onClick={handleResend}
            type="button"
            disabled={timer > 0 || resendOtpMutation.isPending}
            className={`gap-2 font-medium text-[#005864] ${
              timer > 0 || resendOtpMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : "hover:underline"
            }`}
          >
            {resendOtpMutation.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#005864] border-t-transparent" />
                Sending...
              </>
            ) : timer > 0 ? (
              `Resend OTP in ${timer}s`
            ) : (
              "Resend OTP"
            )}
          </button>
        </p>

        <button
          type="button"
          onClick={handleVerify}
          disabled={isLoading || !email || !isOtpComplete}
          className="w-[388px] mx-auto block h-[48px] mt-8 cursor-pointer bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Verifying..." : "Verify"}
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
