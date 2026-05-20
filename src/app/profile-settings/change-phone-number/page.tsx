"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useChangePhone,
  useVerifyChangePhone,
} from "@/hooks/auth/use-change-phone-mutations";
import { PhoneUpdatedModal } from "@/app/profile-settings/_components/phone-updated-modal";
import { useCurrentUserQuery } from "@/hooks/user/use-current-user-query";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatUsPhoneNumber, toE164UsPhone } from "@/lib/auth-utils";
import { formatDisplayPhone } from "@/lib/parse-user-profile";

function PhoneCountryPrefix() {
  return (
    <div className="flex h-12 w-[91px] shrink-0 items-center justify-center rounded-[12px] border border-[#F9F9F9] bg-white">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[5px]">
          <img
            src="/asset/usa.png"
            alt="USA"
            width={21}
            height={15}
            className="h-[15px] w-[21px] rounded-[2px] object-cover"
          />
          <span className="text-[14px] font-[500] leading-[18px] text-[#181818]">+1</span>
        </div>
        <ChevronDown className="h-4 w-4 text-[rgba(24,24,24,0.8)]" aria-hidden />
      </div>
    </div>
  );
}

export default function ChangePhoneNumberPage() {
  const [newPhone, setNewPhone] = useState("");
  const [otpChars, setOtpChars] = useState(["", "", "", "", ""]);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [timer, setTimer] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUserQuery();
  const changePhoneMutation = useChangePhone();
  const verifyChangePhoneMutation = useVerifyChangePhone();

  const currentPhoneDisplay = formatDisplayPhone(currentUser?.phone);

  const phoneE164 = toE164UsPhone(newPhone);
  const phoneDigits = newPhone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 10;
  const isOtpComplete = otpChars.every((digit) => digit.length === 1);
  const isSubmitting =
    changePhoneMutation.isPending || verifyChangePhoneMutation.isPending;

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
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (!digits) return;
    setOtpChars(Array.from({ length: 5 }, (_, i) => digits[i] ?? ""));
    inputRefs.current[Math.min(digits.length, 4)]?.focus();
  };

  const handleContinue = async () => {
    if (!isPhoneValid) {
      setFormError("Enter a valid 10-digit US phone number.");
      return;
    }

    setFormError(null);

    try {
      await changePhoneMutation.mutateAsync({ phone: phoneE164 });
      setStep("otp");
      setTimer(30);
      setOtpChars(["", "", "", "", ""]);
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Could not send verification code."));
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || !isPhoneValid) return;

    setFormError(null);

    try {
      await changePhoneMutation.mutateAsync({ phone: phoneE164 });
      setTimer(30);
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Could not resend code."));
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete) {
      setFormError("Please enter the complete 5-digit code.");
      return;
    }

    setFormError(null);

    try {
      await verifyChangePhoneMutation.mutateAsync({
        phone: phoneE164,
        otp: otpChars.join(""),
      });
      setStep("phone");
      setNewPhone("");
      setOtpChars(["", "", "", "", ""]);
      setIsSuccessModalOpen(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Invalid or expired code."));
    }
  };

  const handleChangeNumber = () => {
    setStep("phone");
    setOtpChars(["", "", "", "", ""]);
    setFormError(null);
    setTimer(0);
  };

  return (
    <div className="mx-auto flex w-full max-w-[766px] flex-col items-center">
      <h2 className="w-full text-[24px] font-[700] leading-[30px] text-black">
        Change Phone Number
      </h2>

      <div className="mt-6 w-full max-w-[426px] rounded-[12px] border border-[#F9F9F9] bg-white px-5 py-4">
        <p className="text-[14px] font-[500] text-[rgba(24,24,24,0.6)]">Current phone number</p>
        {isLoadingProfile ? (
          <div className="mt-2 h-6 w-40 animate-pulse rounded-md bg-[#F8F8F8]" />
        ) : (
          <p className="mt-1 text-[18px] font-[600] leading-6 text-[#181818]">
            {currentPhoneDisplay}
          </p>
        )}
      </div>

      {step === "phone" ? (
        <>
          <p className="mt-8 w-full max-w-[426px] text-[16px] font-[500] leading-5 text-[rgba(24,24,24,0.6)]">
            Please enter your new phone number.
          </p>

          <div className="mt-10 w-full max-w-[426px]">
            <div className="flex gap-2">
              <PhoneCountryPrefix />
              <Input
                id="new-phone"
                type="text"
                inputMode="tel"
                placeholder="Add phone number"
                value={newPhone}
                onChange={(e) => {
                  setNewPhone(formatUsPhoneNumber(e.target.value));
                  setFormError(null);
                }}
                className="h-12 flex-1 rounded-[12px] border border-[#F9F9F9] bg-white px-4 text-[16px] shadow-none placeholder:text-[13px] placeholder:font-[400] placeholder:text-[rgba(24,24,24,0.6)] focus-visible:ring-2 focus-visible:ring-[#005864]/30"
              />
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                onClick={handleContinue}
                disabled={isSubmitting || !isPhoneValid}
                className="h-12 w-full max-w-[388px] cursor-pointer rounded-[12px] bg-[#005864] px-[10px] py-3 text-[16px] font-[600] capitalize leading-5 text-white hover:bg-[#004d57] disabled:opacity-60"
              >
                {isSubmitting ? "Please wait..." : "Continue"}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mt-10 w-full max-w-[426px] text-center text-[16px] font-[500] leading-5 text-[rgba(24,24,24,0.6)]">
            Enter the verification code sent to{" "}
            <span className="font-[600] text-[#005864]">{phoneE164}</span>
          </p>

          <div className="mt-8 flex justify-center gap-3">
            {otpChars.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                type="text"
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => updateOtp(e.target.value, index)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !otpChars[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                onPaste={handlePaste}
                className="h-[52px] w-[52px] rounded-[12px] border border-[#F9F9F9] bg-white text-center text-[20px] font-[600] text-[#005864] focus:border-[#005864] focus:outline-none"
              />
            ))}
          </div>

          <p className="mt-4 text-center text-[14px] text-[rgba(24,24,24,0.8)]">
            Didn&apos;t receive code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0 || isSubmitting}
              className="cursor-pointer font-[600] text-[#005864] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
            </button>
          </p>

          <div className="mt-6 flex w-full max-w-[426px] flex-col items-center gap-3">
            <Button
              type="button"
              onClick={handleVerify}
              disabled={isSubmitting || !isOtpComplete}
              className="h-12 w-full max-w-[388px] cursor-pointer rounded-[12px] bg-[#005864] text-[16px] font-[600] capitalize text-white hover:bg-[#004d57] disabled:opacity-60"
            >
              {isSubmitting ? "Verifying..." : "Continue"}
            </Button>

            <button
              type="button"
              onClick={handleChangeNumber}
              className="cursor-pointer text-[14px] font-[500] text-[#005864] underline underline-offset-2"
            >
              Change phone number
            </button>
          </div>
        </>
      )}

      {formError ? (
        <p className="mt-6 w-full max-w-[426px] text-center text-[14px] text-[#F01A1A]" role="alert">
          {formError}
        </p>
      ) : null}

      <PhoneUpdatedModal
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
