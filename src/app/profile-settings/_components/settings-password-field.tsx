"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";

type SettingsPasswordFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  registration: UseFormRegisterReturn;
};

export default function SettingsPasswordField({
  id,
  label,
  placeholder = "••••••••",
  hint,
  error,
  registration,
}: SettingsPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="text-[16px] font-[500] leading-[22px] tracking-[-0.408px] text-black"
      >
        {label}
      </label>
      <div className="relative mt-[6px]">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          maxLength={32}
          className="h-12 rounded-[12px] border-0 bg-white px-4 pr-12 text-[16px] shadow-none placeholder:text-[#898A8D] focus-visible:ring-2 focus-visible:ring-[#005864]/30"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#606060]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <Eye size={18} /> : <EyeOff size={18} strokeWidth={1.5} />}
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-[14px] text-[#F01A1A]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] leading-4 text-[#3C3C3C]/60">{hint}</p>
      ) : null}
    </div>
  );
}
