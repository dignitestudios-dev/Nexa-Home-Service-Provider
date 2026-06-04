"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { AccountCreatedModal } from "@/components/auth/account-created-modal";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import {
  useCheckEmail,
  useLoginAuth,
  useRegisterAuth,
} from "@/hooks/auth/use-auth-mutations";
import {
  loginFlowEmailSchema,
  loginFlowSignupSchema,
} from "@/lib/schemas/auth.schema";
import { toast } from "@/lib/toast";
import { extractAuthFromResponse } from "@/lib/auth-session";
import { getRedirectPath } from "@/lib/auth-utils";
import { setPendingVerifyEmail } from "@/lib/verify-email-storage";

type LoginFormData = z.infer<typeof loginFlowEmailSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState("no");
  const [showConflictModal, setShowConflictModal] = useState(false);

  const checkEmailMutation = useCheckEmail();
  const registerMutation = useRegisterAuth();
  const loginMutation = useLoginAuth();

  const isLoading =
    checkEmailMutation.isPending ||
    registerMutation.isPending ||
    loginMutation.isPending;

  const isEmailCheckedForCurrent = Boolean(checkedEmail);

  const { register, handleSubmit, watch, setValue, clearErrors } =
    useForm<LoginFormData>({
      resolver: zodResolver(loginFlowEmailSchema),
      mode: "onBlur",
      reValidateMode: "onChange",
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

  useEffect(() => {
    clearErrors(["password", "confirmPassword"]);
  }, [isLoginMode, isEmailCheckedForCurrent, clearErrors]);

  const showValidationError = (
    result: ReturnType<typeof loginFlowSignupSchema.safeParse>,
  ) => {
    if (result.success) return true;

    const message =
      result.error.issues[0]?.message ?? "Please check your details.";
    toast.error(message);
    return false;
  };

  const showFormValidationToast = (fieldErrors: {
    email?: { message?: string };
    password?: { message?: string };
    confirmPassword?: { message?: string };
  }) => {
    if (isLoginMode === "yes") {
      if (fieldErrors.email?.message) {
        toast.error(fieldErrors.email.message);
      }
      return;
    }

    const message =
      fieldErrors.email?.message ||
      fieldErrors.password?.message ||
      fieldErrors.confirmPassword?.message;

    if (message) {
      toast.error(message);
    }
  };

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const normalizedEmail = email?.trim().toLowerCase();
  const hasEmail = Boolean(normalizedEmail);
  const hasPassword = Boolean(password?.trim());
  const hasConfirmPassword = Boolean(confirmPassword?.trim());

  useEffect(() => {
    if (checkedEmail && normalizedEmail !== checkedEmail) {
      setCheckedEmail(null);
      setIsLoginMode("no");
      setValue("password", "");
      setValue("confirmPassword", "");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [checkedEmail, normalizedEmail, setValue]);

  const isSubmitDisabled =
    !hasEmail ||
    isLoading ||
    (isEmailCheckedForCurrent &&
      ((isLoginMode === "yes" && !hasPassword) ||
        (isLoginMode === "no" && (!hasPassword || !hasConfirmPassword))));

  const onSubmit = async (data: LoginFormData) => {
    const currentEmail = data.email.trim().toLowerCase();
    if (!currentEmail) return;

    if (checkedEmail !== currentEmail) {
      try {
        const result = await checkEmailMutation.mutateAsync({
          email: currentEmail,
          role: "service-provider",
        });
        console.log("🚀 ~ onSubmit ~ result:", result);

        if (result.raw.data.exists === "yes-conflict") {
          setShowConflictModal(true);
          return;
        }

        setCheckedEmail(currentEmail);
        setIsLoginMode(result.raw.data.exists);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setValue("password", "");
        setValue("confirmPassword", "");
      } catch (error) {
        toast.fromApiError(error, "Unable to verify email. Please try again.");
      }
      return;
    }

    if (isLoginMode === "yes") {
      if (!data.password?.trim()) {
        toast.error("Password is required");
        return;
      }

      try {
        const response = await loginMutation.mutateAsync({
          email: currentEmail,
          password: data.password!,
          method: "email",
          role: "service-provider",
        });
        const { user: loggedInUser } = extractAuthFromResponse(response);
        const redirectPath = getRedirectPath(loggedInUser);

        if (redirectPath === "/auth/verify-email") {
          setPendingVerifyEmail(currentEmail);
          router.push(
            `/auth/verify-email?email=${encodeURIComponent(currentEmail)}`,
          );
          return;
        }

        router.push(redirectPath);
      } catch (error) {
        toast.fromApiError(error, "Login failed. Please try again.");
      }
      return;
    }

    const signupValid = showValidationError(
      loginFlowSignupSchema.safeParse(data),
    );
    if (!signupValid) return;

    try {
      await registerMutation.mutateAsync({
        email: currentEmail,
        method: "email",
        role: "service-provider",
        password: data.password!,
      });
      router.push(
        `/auth/signup-verify-otp?email=${encodeURIComponent(currentEmail)}`,
      );
    } catch (error) {
      toast.fromApiError(error, "Signup failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, showFormValidationToast)}
      className="w-full max-w-[388px] flex flex-col"
    >
      <div className="text-center">
        <h1 className="text-[36px] leading-[45px] tracking-[-0.82px] font-semibold text-[#1C1C1C]">
          Welcome back!
        </h1>
        <p className="mt-2 text-[16px] leading-[22px] text-black/80">
          Enter your details below to login.
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
            Email
          </label>
          <Input
            type="email"
            placeholder="mikesmith@gmail.com"
            disabled={isLoading}
            className="mt-[6px] h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
            {...register("email")}
          />
        </div>

        {isEmailCheckedForCurrent && (
          <>
            <PasswordField
              label={isLoginMode === "yes" ? "Password" : "Enter Password"}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              register={register}
              fieldName="password"
              isLoading={isLoading}
              maxLength={32}
            />

            {isLoginMode === "no" && (
              <PasswordField
                label="Confirm Password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
                register={register}
                fieldName="confirmPassword"
                isLoading={isLoading}
                maxLength={32}
              />
            )}
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full h-[48px] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Please wait..."
            : isEmailCheckedForCurrent
              ? isLoginMode === "yes"
                ? "Continue"
                : "Signup"
              : "Continue"}
        </button>

        <div className="mt-2 text-right">
          <Link
            href="/auth/forgot-password"
            className="text-[14px] font-[500] text-[#005864] tracking-[-0.408px]"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-black/20 flex-1" />
          <div className="text-[20px] font-[500] text-black uppercase">OR</div>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <GoogleSignInButton onConflict={() => setShowConflictModal(true)} />

          <button
            type="button"
            className="w-[188px] h-[50px] bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img
              src="/asset/apple.png"
              alt="Apple"
              width={24}
              height={24}
              className="w-[24px] h-[24px] object-contain"
            />
            <span>Apple</span>
          </button>
        </div>
      </div>

      <AccountCreatedModal
        open={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        title="Email Already in Use"
        description="This email address is already associated with another account. Please use a different email to continue."
        type="error"
      />
    </form>
  );
}

function PasswordField({
  label,
  showPassword,
  setShowPassword,
  register,
  fieldName,
  isLoading,
  hint,
  maxLength,
}: {
  label: string;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  register: ReturnType<typeof useForm<LoginFormData>>["register"];
  fieldName: "password" | "confirmPassword";
  isLoading: boolean;
  hint?: string;
  maxLength:number;
}) {
  return (
    <div className="mb-4">
      <label className="text-[16px] font-[500] leading-[22px] text-[#1C1C1C]">
        {label}
      </label>

      <div className="relative mt-[6px]">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          disabled={isLoading}
          className="h-[48px] rounded-[12px] bg-[#F8F8F8] border-0 px-4 pr-12 text-[16px] placeholder:text-[#181818]/50 focus-visible:ring-0 focus-visible:border-transparent shadow-none"
          {...register(fieldName)}
          maxLength={maxLength}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/70"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      </div>

      {hint ? <p className="mt-1.5 text-xs text-[#181818]/60">{hint}</p> : null}
    </div>
  );
}
