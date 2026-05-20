"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  useCheckEmail,
  useLoginAuth,
  useRegisterAuth,
} from "@/hooks/auth/use-auth-mutations";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  loginFlowSchema,
  loginFlowSignupSchema,
  passwordSchema,
} from "@/lib/schemas/auth.schema";

type LoginFormData = z.infer<typeof loginFlowSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const checkEmailMutation = useCheckEmail();
  const registerMutation = useRegisterAuth();
  const loginMutation = useLoginAuth();

  const isLoading =
    checkEmailMutation.isPending ||
    registerMutation.isPending ||
    loginMutation.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFlowSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const normalizedEmail = email?.trim().toLowerCase();
  const hasEmail = Boolean(normalizedEmail);
  const hasPassword = Boolean(password?.trim());
  const hasConfirmPassword = Boolean(confirmPassword?.trim());
  const isEmailCheckedForCurrent = Boolean(hasEmail && checkedEmail === normalizedEmail);

  useEffect(() => {
    if (checkedEmail && normalizedEmail !== checkedEmail) {
      setCheckedEmail(null);
      setIsLoginMode(false);
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
      ((isLoginMode && !hasPassword) ||
        (!isLoginMode && (!hasPassword || !hasConfirmPassword))));

  const onSubmit = async (data: LoginFormData) => {
    const currentEmail = data.email.trim().toLowerCase();
    if (!currentEmail) return;

    setFormError(null);

    if (checkedEmail !== currentEmail) {
      try {
        const result = await checkEmailMutation.mutateAsync({ email: currentEmail });
        setCheckedEmail(currentEmail);
        setIsLoginMode(result.exists);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setValue("password", "");
        setValue("confirmPassword", "");
      } catch (error) {
        setFormError(getApiErrorMessage(error, "Unable to verify email. Please try again."));
      }
      return;
    }

    if (isLoginMode) {
      const passwordResult = passwordSchema.safeParse(data.password);
      if (!passwordResult.success) {
        setFormError(passwordResult.error.issues[0]?.message ?? "Invalid password");
        return;
      }

      try {
        await loginMutation.mutateAsync({
          email: currentEmail,
          password: data.password!,
          method: "email",
        });
        router.push("/app/dashboard");
      } catch (error) {
        setFormError(getApiErrorMessage(error, "Login failed. Please try again."));
      }
      return;
    }

    const signupResult = loginFlowSignupSchema.safeParse(data);
    if (!signupResult.success) {
      setFormError(signupResult.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    try {
      await registerMutation.mutateAsync({
        email: currentEmail,
        method: "email",
        role: "service-provider",
        password: data.password!,
      });
      router.push(`/auth/signup-verify-otp?email=${encodeURIComponent(currentEmail)}`);
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Signup failed. Please try again."));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {isEmailCheckedForCurrent && (
          <>
            <PasswordField
              label={isLoginMode ? "Password" : "Enter Password"}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              register={register}
              fieldName="password"
              isLoading={isLoading}
            />

            {!isLoginMode && (
              <PasswordField
                label="Confirm Password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
                register={register}
                fieldName="confirmPassword"
                isLoading={isLoading}
              />
            )}
          </>
        )}

        {formError && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full h-[48px] bg-[#005864] rounded-[12px] text-white text-[16px] font-[600] capitalize hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Please wait..."
            : isEmailCheckedForCurrent
              ? isLoginMode
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
          <button
            type="button"
            className="w-[188px] h-[50px] bg-[#F8F8F8] rounded-[15px] flex items-center justify-center gap-2 text-[14px] font-[500] text-[#181818]"
          >
            <img
              src="/asset/google.png"
              alt="Google"
              width={24}
              height={24}
              className="w-[24px] h-[24px] object-contain"
            />
            <span>Google</span>
          </button>

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
}: {
  label: string;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  register: ReturnType<typeof useForm<LoginFormData>>["register"];
  fieldName: "password" | "confirmPassword";
  isLoading: boolean;
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
    </div>
  );
}
