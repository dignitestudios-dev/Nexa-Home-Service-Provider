"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IdCard,
  UserRound,
  FileText,
  BriefcaseBusiness,
  Upload,
  File,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  IdentityCardFormData,
  identityCardSchema,
} from "@/lib/schemas/profile-setup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadIdDocsSetup } from "@/hooks/onboarding/profile-setup-mutation";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Card", icon: IdCard, active: true },
];

export default function IdentityCardOnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const idCardFields = [
    {
      key: "idCardFront",
      label: "Upload Front Side",
    },

    {
      key: "idCardBack",
      label: "Upload Back Side",
    },
  ] as const;

  const uploadIdDocsMutation = useUploadIdDocsSetup();

  // =========================
  // RHF
  // =========================

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IdentityCardFormData>({
    resolver: zodResolver(identityCardSchema),

    defaultValues: {
      idCardFront: undefined as unknown as File,

      idCardBack: undefined as unknown as File,
    },
  });

  // =========================
  // WATCH FILE
  // =========================

  const previewUrls = useMemo(() => {
    return idCardFields.reduce(
      (acc, field) => {
        const file = watch(field.key);

        acc[field.key] =
          file && file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : "";

        return acc;
      },
      {} as Record<string, string>,
    );
  }, [watch()]);

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (data: IdentityCardFormData) => {
    try {
      await uploadIdDocsMutation.mutateAsync({
        idCardFront: data.idCardFront,

        idCardBack: data.idCardBack,
      });

      router.push("/onboarding/account-status?status=submitted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white py-3 pr-3 pl-1 md:py-5 md:pr-10 md:pl-0">
      <div className="mx-auto flex h-full w-full max-w-[1440px] rounded-[32px] bg-white p-0">
        <aside className="relative hidden h-full w-[400px] shrink-0 overflow-hidden rounded-[24px] bg-[url('/asset/sidebarbg.png')] bg-cover bg-center bg-no-repeat lg:sticky lg:top-0 lg:block">
          <div className="relative z-10 flex h-full w-full items-start md:pt-[6em] px-20">
            <div className="flex w-full max-w-[199px] flex-col gap-1">
              {stepItems.map((step, index) => {
                const Icon = step.icon;
                const isLastStep = index === stepItems.length - 1;
                return (
                  <div key={step.label} className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${
                          step.active ? "bg-white" : "bg-white/30"
                        }`}
                      >
                        <Icon
                          size={23}
                          className={
                            step.active ? "text-[#005864]" : "text-white/70"
                          }
                        />
                      </div>
                      <span
                        className={`text-[14px] leading-[17px] tracking-[-0.008em] ${
                          step.active ? "text-white" : "text-white/60"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {!isLastStep && (
                      <div
                        className="ml-6 h-8 w-px bg-white/30"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="flex h-full flex-1 items-center justify-center px-4 sm:px-8 lg:px-16">
          <div className="w-full max-w-[496px]">
            <div className="text-center">
              <h1 className="text-[36px] font-semibold leading-[45px] tracking-[-0.82px] text-[#1C1C1C]">
                Upload Identity Card
              </h1>
              <p className="mt-4 text-[16px] leading-[22px] text-black/80">
                Please upload a clear photo of your government-issued ID (e.g.,
                driver&apos;s license, state ID, or passport). This helps us
                confirm your identity and keep NexaHome safe for everyone.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {idCardFields.map((field) => {
                  const selectedFile = watch(field.key);

                  const previewUrl = previewUrls[field.key];

                  const fileLabel = !selectedFile
                    ? "Choose file to upload"
                    : selectedFile.name.length <= 36
                      ? selectedFile.name
                      : `${selectedFile.name.slice(0, 33)}...`;

                  return (
                    <div key={field.key}>
                      <p className="mb-2 text-sm font-medium text-[#1C1C1C]">
                        {field.label}
                      </p>

                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id={field.key}
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (!file) return;

                          setValue(field.key, file, {
                            shouldValidate: true,
                          });
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById(field.key)?.click()
                        }
                        className="relative flex h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-[15px] border border-dashed border-[#005864] bg-[#F9FAFA]"
                      >
                        {previewUrl ? (
                          <>
                            <img
                              src={previewUrl}
                              alt={field.label}
                              className="absolute inset-0 h-full w-full object-contain bg-[#F9FAFA] p-2"
                            />

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();

                                setValue(
                                  field.key,
                                  undefined as unknown as File,
                                  {
                                    shouldValidate: true,
                                  },
                                );
                              }}
                              className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                            >
                              <X size={14} />
                            </button>

                            <span className="absolute inset-x-0 bottom-0 truncate bg-black/45 px-2 py-1 text-center text-[11px] text-white">
                              {fileLabel}
                            </span>
                          </>
                        ) : (
                          <>
                            {selectedFile ? (
                              <File size={29} className="text-[#005864]" />
                            ) : (
                              <Upload size={29} className="text-black/80" />
                            )}

                            <span className="mt-3 text-[14px] leading-[18px] text-[#1C1C1C]">
                              {fileLabel}
                            </span>
                          </>
                        )}
                      </button>

                      {errors[field.key] && (
                        <p className="mt-2 text-sm text-red-500">
                          {errors[field.key]?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={uploadIdDocsMutation.isPending}
                className="mt-8 h-[48px] w-full rounded-[12px] bg-[#005864] text-[16px] font-semibold leading-[20px] text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadIdDocsMutation.isPending ? "Uploading..." : "Continue"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
