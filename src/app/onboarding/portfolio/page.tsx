"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  File,
  FileText,
  IdCard,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  PortfolioFormData,
  portfolioSchema,
} from "@/lib/schemas/profile-setup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadPortfolioSetup } from "@/hooks/onboarding/profile-setup-mutation";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: false },
  { label: "Portfolio", icon: BriefcaseBusiness, active: true },
  { label: "Identity Card", icon: IdCard, active: false },
];

export default function PortfolioPage() {
  const MAX_FILES = 10;
  const router = useRouter();

  const uploadPortfolioMutation = useUploadPortfolioSetup();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),

    defaultValues: {
      portfolioFiles: [],
    },
  });

  const portfolioFiles = watch("portfolioFiles");

  const portfolioItems = useMemo(() => {
    return portfolioFiles.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,

      file,

      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
  }, [portfolioFiles]);

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      await uploadPortfolioMutation.mutateAsync({
        portfolioMedia: data.portfolioFiles,
      });

      router.push("/onboarding/identity-card");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white py-3 pr-3 pl-1 md:py-5 md:pr-10 md:pl-0">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col rounded-[32px] bg-white p-0 lg:flex-row">
        <div className="rounded-[16px] bg-[#005864] p-3 lg:hidden">
          <div className="hide-scrollbar flex gap-3 overflow-x-auto">
            {stepItems.map((step) => {
              const Icon = step.icon;
              const isActive = step.active;
              return (
                <div
                  key={`mobile-${step.label}`}
                  className={`flex shrink-0 items-center gap-2 rounded-[10px] px-3 py-2 ${
                    isActive ? "bg-white" : "bg-white/20"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-[#005864]" : "text-white/80"}
                  />
                  <span
                    className={`text-[13px] font-medium ${
                      isActive ? "text-[#005864]" : "text-white"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="relative hidden h-full w-[400px] shrink-0 overflow-hidden rounded-[24px] bg-[url('/asset/sidebarbg.png')] bg-cover bg-center bg-no-repeat lg:block">
          <div className="relative z-10 flex h-full w-full items-start px-20 pt-[6em]">
            <div className="flex w-full max-w-[199px] flex-col gap-1">
              {stepItems.map((step, index) => {
                const Icon = step.icon;
                const isLastStep = index === stepItems.length - 1;
                const isActive = step.active;

                return (
                  <div key={step.label} className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-[8px] ${
                          isActive
                            ? "bg-white shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
                            : "bg-white/30"
                        }`}
                      >
                        <Icon
                          size={23}
                          className={
                            isActive ? "text-[#005864]" : "text-white/70"
                          }
                        />
                      </div>
                      <span
                        className={`text-[14px] leading-[17px] tracking-[-0.008em] ${
                          isActive ? "text-white" : "text-white/60"
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

        <main className="relative flex h-full flex-1 justify-center overflow-y-auto px-4 py-6 sm:px-8 lg:px-16 lg:py-14">
          {/* <button
            type="button"
            onClick={() => router.push("/onboarding/business-documents")}
            className="absolute left-4 top-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-[#181818] hover:bg-black/5 lg:left-6 lg:top-4"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button> */}

          <section className="mt-12 w-full max-w-[607px] lg:mt-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-12 w-full max-w-[607px] lg:mt-6"
            >
              <div className="text-center">
                <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#1C1C1C]">
                  Upload Portfolio
                </h1>

                <p className="mt-4 text-[16px] leading-5 tracking-[-0.014em] text-black/80">
                  Upload your business license, proof of identity,
                  certifications (if any)
                </p>
              </div>

              {/* ========================= */}
              {/* FILE INPUT */}
              {/* ========================= */}

              <div className="mt-12">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    const selectedFiles = Array.from(event.target.files ?? []);

                    if (selectedFiles.length === 0) return;

                    const remaining = MAX_FILES - portfolioFiles.length;

                    if (remaining <= 0) return;

                    const newFiles = selectedFiles.slice(0, remaining);

                    setValue(
                      "portfolioFiles",
                      [...portfolioFiles, ...newFiles],
                      {
                        shouldValidate: true,
                      },
                    );

                    event.target.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex h-[151px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#005864] bg-[rgba(0,88,100,0.06)] px-3"
                >
                  <Upload size={30} className="text-[#005864]" />

                  <div className="mt-4 text-center">
                    <p className="text-[15px] font-medium leading-[19px] text-[#1C1C1C]">
                      Upload Image
                    </p>

                    <p className="mt-1 text-[15px] leading-[19px] text-black/80">
                      Upto 20 Mbs, PDF, JPG, PNG ({portfolioFiles.length}/
                      {MAX_FILES})
                    </p>
                  </div>
                </button>

                {errors.portfolioFiles && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.portfolioFiles.message}
                  </p>
                )}
              </div>

              {/* ========================= */}
              {/* PREVIEW */}
              {/* ========================= */}

              {portfolioItems.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative h-[90px] w-[90px] overflow-hidden rounded-[12px] bg-[#F1F3F4]"
                    >
                      {item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <File size={24} className="text-[#005864]" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setValue(
                            "portfolioFiles",
                            portfolioFiles.filter(
                              (file, index) =>
                                `${file.name}-${file.lastModified}-${index}` !==
                                item.id,
                            ),
                            {
                              shouldValidate: true,
                            },
                          );

                          if (item.previewUrl) {
                            URL.revokeObjectURL(item.previewUrl);
                          }
                        }}
                        className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                        aria-label={`Remove ${item.file.name}`}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ========================= */}
              {/* SUBMIT */}
              {/* ========================= */}

              <button
                type="submit"
                disabled={uploadPortfolioMutation.isPending}
                className="mx-auto mt-10 block h-12 w-full max-w-[500px] rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadPortfolioMutation.isPending
                  ? "Uploading..."
                  : "Continue"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
