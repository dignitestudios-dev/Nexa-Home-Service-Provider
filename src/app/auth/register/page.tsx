"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/lib/schemas/auth.schema";

type SignupFormData = z.infer<typeof signupSchema>;

const formatUsPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits.length ? `(${digits}` : "";
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("SIGNUP DATA:", data);
    const encodedEmail = encodeURIComponent(data.email);
    router.push(`/auth/signup-verify-otp?email=${encodedEmail}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[388px] py-2 lg:py-8">
      <div className="text-center">
        <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.82px] text-[#1C1C1C]">
          Sign Up
        </h1>
        <p className="mt-2 text-[16px] leading-[22px] text-black/80">
          Enter your details below to Signup.
        </p>
      </div>

      <div className="mt-10">
        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] tracking-[-0.41px] text-[#1C1C1C]">
            Name
          </label>
          <Input
            type="text"
            placeholder="Lucas Benjamin"
            className="mt-[6px] h-[48px] rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:border-transparent focus-visible:ring-0 shadow-none"
            {...register("fullName")}
          />
          <div className="mt-1.5">
            {errors.fullName && (
              <div className="text-red-600 text-sm">{errors.fullName.message}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] tracking-[-0.41px] text-[#1C1C1C]">
            Company Name <span className="text-[#005864]">(Optional)</span>
          </label>
          <Input
            type="text"
            placeholder="ABC"
            className="mt-[6px] h-[48px] rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:border-transparent focus-visible:ring-0 shadow-none"
            {...register("companyName")}
          />
          <div className="mt-1.5">
            {errors.companyName && (
              <div className="text-sm text-red-600">{errors.companyName.message}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] tracking-[-0.41px] text-[#1C1C1C]">
            Email
          </label>
          <Input
            type="email"
            placeholder="lucasbenjamin@gmail.com"
            className="mt-[6px] h-[48px] rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:border-transparent focus-visible:ring-0 shadow-none"
            {...register("email")}
          />
          <div className="mt-1.5">
            {errors.email && (
              <div className="text-red-600 text-sm">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] tracking-[-0.41px] text-[#1C1C1C]">
            Phone Number
          </label>
          <div className="mt-[6px] flex gap-2">
            <div className="h-[48px] w-[91px] rounded-[12px] bg-[#F8F8F8] flex items-center justify-center gap-1.5 text-[16px] font-[500] text-[#1C1C1C]">
              <img
                src="/asset/usa.png"
                alt="USA flag"
                width={20}
                height={14}
                className="w-[20px] h-[14px] rounded-[2px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/asset/usa.png";
                }}
              />
              <span>+1</span>
            </div>
            <Input
              type="text"
              inputMode="tel"
              placeholder="(202) 555-0156"
              className="h-[48px] flex-1 rounded-[12px] border-0 bg-[#F8F8F8] px-4 text-[16px] placeholder:text-[#181818]/50 focus-visible:border-transparent focus-visible:ring-0 shadow-none"
              {...register("phoneNumber", {
                onChange: (event) => {
                  const formattedValue = formatUsPhoneNumber(event.target.value);
                  setValue("phoneNumber", formattedValue, { shouldValidate: true });
                },
              })}
            />
          </div>
          <div className="mt-1.5">
            {errors.phoneNumber && (
              <div className="text-red-600 text-sm">
                {errors.phoneNumber.message}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[16px] font-[500] leading-[22px] tracking-[-0.41px] text-[#1C1C1C]">
            Password
          </label>

          <div className="relative mt-[6px]">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-[48px] rounded-[12px] border-0 bg-[#F8F8F8] px-4 pr-12 text-[16px] placeholder:text-[#181818]/50 focus-visible:border-transparent focus-visible:ring-0 shadow-none"
              {...register("password")}
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

          <div className="mt-1.5">
            {errors.password && (
              <div className="text-red-600 text-sm">{errors.password.message}</div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-[16px] font-[500] leading-[22px] tracking-[-0.41px] text-[#1C1C1C]">
            Confirm Password
          </label>

          <div className="relative mt-[6px]">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-[48px] rounded-[12px] border-0 bg-[#F8F8F8] px-4 pr-12 text-[16px] placeholder:text-[#181818]/50 focus-visible:border-transparent focus-visible:ring-0 shadow-none"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#181818]/70"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
            </button>
          </div>

          <div className="mt-1.5">
            {errors.confirmPassword && (
              <div className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3 mt-0.5">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 rounded-[4px] border border-[#181818]/80 accent-[#005864]"
              {...register("acceptTerms")}
              onChange={(e) => {
                setValue("acceptTerms", e.target.checked, { shouldValidate: true });
              }}
            />
            <span className="text-[15px] leading-[19px] text-black/80">
              I accept the{" "}
              <a href="#" className="text-[#005864] font-[500]">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#005864] font-[500]">
                Privacy Policy
              </a>
            </span>
          </label>
          <div className="mt-1.5">
            {errors.acceptTerms && (
              <div className="text-red-600 text-sm">
                {errors.acceptTerms.message}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 h-[48px] w-full rounded-[12px] bg-[#005864] text-[16px] font-[600] capitalize text-white hover:opacity-95 active:scale-[0.99]"
        >
          Sign Up
        </button>

        <div className="mt-5 flex items-center gap-4">
          <div className="h-px bg-black/20 flex-1" />
          <div className="text-[20px] font-[500] text-black uppercase">OR</div>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <GoogleSignInButton />

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

        <div className="mt-6 text-center text-[16px] leading-[20px] text-black/80">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#005864] font-[500]">
            Create Now
          </Link>
        </div>
      </div>
    </form>
  );
}

