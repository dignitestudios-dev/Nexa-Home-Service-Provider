"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";

import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/schemas/auth.schema";
import { z } from "zod";
import { PasswordUpdatedModal } from "@/components/auth/passwordupdatemodal";
import { useResetUpdatePassword } from "@/hooks/auth/use-change-password-mutation";
import { clearAuthSession, getAuthTokenCookie } from "@/lib/auth-session";
import {
  getPasswordResetToken,
  isPasswordResetFlow,
} from "@/lib/reset-password-storage";
import { toast } from "@/lib/toast";
import { getPendingVerifyEmail } from "@/lib/verify-email-storage";

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

function ChangePasswordContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const updatePasswordMutation = useResetUpdatePassword();

  const email = useMemo(() => {
    const fromQuery = searchParams.get("email")?.trim().toLowerCase() ?? "";
    return fromQuery || getPendingVerifyEmail();
  }, [searchParams]);

  const verifyOtpHref = "/auth/verify-otp?mode=reset";

  useEffect(() => {
    const hasResetSession =
      isPasswordResetFlow() &&
      (Boolean(getAuthTokenCookie()) || Boolean(getPasswordResetToken()));

    if (hasResetSession) return;

    toast.error("Reset session expired. Please verify OTP again.");
    router.replace(verifyOtpHref);
  }, [router, verifyOtpHref]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const showValidationToast = (fieldErrors: FieldErrors<ResetPasswordSchema>) => {
    const message =
      fieldErrors.password?.message || fieldErrors.confirmPassword?.message;

    if (message) {
      toast.error(message);
    }
  };

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      const response = await updatePasswordMutation.mutateAsync({
        password: data.password,
      });
      // newPassword: data.confirmPassword,

      toast.fromApiSuccess(response, "Password updated successfully.");
      clearAuthSession(dispatch);
      setPasswordUpdated(true);
    } catch (error) {
      toast.fromApiError(error, "Could not update password. Please try again.");
    }
  };

  return (
    <div className="relative w-full self-stretch min-h-[560px]">
      <Link
        href={verifyOtpHref}
        className="absolute left-0 top-0 inline-flex items-center justify-center w-12 h-12 rounded-full text-[#181818] hover:bg-black/5"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="flex-1 bg-white flex items-start justify-center">
        <form
          onSubmit={handleSubmit(onSubmit, showValidationToast)}
          className="w-full max-w-[496px] min-h-[560px] mx-auto"
        >
          <div className="text-center mt-[122px]">
            <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
              Create New Password
            </h1>
            <p className="mt-2 text-[16px] leading-[22px] text-black/80 max-w-[496px] mx-auto">
              Enter your new password to reset
            </p>
          </div>

          <div className="mt-[52px] w-[388px] mx-auto">
            <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
              Password
            </label>

            <div className="relative mt-[6px]">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                disabled={updatePasswordMutation.isPending}
                maxLength={32}
                autoComplete="new-password"
                {...register("password")}
                className="w-full h-[48px] bg-[#F8F8F8] rounded-[12px] border-0 px-4 pr-10 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="mt-2 min-h-[20px]">
              {errors.password ? (
                <div className="text-red-600 text-sm">
                  {errors.password.message}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 w-[388px] mx-auto">
            <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
              Confirm Password
            </label>

            <div className="relative mt-[6px]">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                disabled={updatePasswordMutation.isPending}
                maxLength={32}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full h-[48px] bg-[#F8F8F8] rounded-[12px] border-0 px-4 pr-10 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="min-h-[20px] mt-2">
              {errors.confirmPassword && (
                <div className="text-red-600 text-sm">
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={updatePasswordMutation.isPending}
            className="w-[388px] mx-auto block h-[48px] mt-3 bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updatePasswordMutation.isPending
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>

      <PasswordUpdatedModal
        open={passwordUpdated}
        onClose={() => {
          setPasswordUpdated(false);
          router.push("/auth/login");
        }}
      />
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[560px]" />}>
      <ChangePasswordContent />
    </Suspense>
  );
}
