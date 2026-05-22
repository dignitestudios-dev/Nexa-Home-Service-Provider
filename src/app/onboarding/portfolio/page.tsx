"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  BriefcaseBusiness,
  File,
  FileText,
  IdCard,
  Play,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { navigateToNextOnboardingStep } from "@/lib/onboarding-navigation";
import {
  PORTFOLIO_ACCEPT_INPUT,
  PORTFOLIO_MAX_FILES,
  isPortfolioImage,
  isPortfolioVideo,
  validatePortfolioFile,
} from "@/lib/portfolio-media-validation";
import { toast } from "@/lib/toast";
import type { RootState } from "@/store/index";
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
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

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
      isImage: isPortfolioImage(file),
      isVideo: isPortfolioVideo(file),
      previewUrl:
        isPortfolioImage(file) || isPortfolioVideo(file)
          ? URL.createObjectURL(file)
          : null,
    }));
  }, [portfolioFiles]);

  useEffect(() => {
    return () => {
      portfolioItems.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, [portfolioItems]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    const remaining = PORTFOLIO_MAX_FILES - portfolioFiles.length;

    if (remaining <= 0) {
      toast.error(`You can upload up to ${PORTFOLIO_MAX_FILES} items only.`);
      return;
    }

    const accepted: File[] = [];

    for (const file of selectedFiles) {
      if (accepted.length >= remaining) {
        toast.error(`Only ${PORTFOLIO_MAX_FILES} items allowed in total.`);
        break;
      }

      const validationError = validatePortfolioFile(file);
      if (validationError) {
        toast.error(validationError);
        continue;
      }

      accepted.push(file);
    }

    if (accepted.length === 0) return;

    setValue("portfolioFiles", [...portfolioFiles, ...accepted], {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      const response = await uploadPortfolioMutation.mutateAsync({
        portfolioMedia: data.portfolioFiles,
      });

      toast.fromApiSuccess(response, "Portfolio uploaded successfully.");

      navigateToNextOnboardingStep(router, dispatch, user, {
        apiResponse: response,
        completedFlags: { portfolioMediaUploaded: true },
      });
    } catch (error) {
      toast.fromApiError(error, "Could not upload portfolio. Please try again.");
    }
  };

  const isUploadDisabled =
    uploadPortfolioMutation.isPending ||
    portfolioFiles.length >= PORTFOLIO_MAX_FILES;

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
                  Upload up to {PORTFOLIO_MAX_FILES} items — PNG or JPEG images
                  (max 10MB each) and MP4, WebM, or MOV videos.
                </p>
              </div>

              <div className="mt-12">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={PORTFOLIO_ACCEPT_INPUT}
                  multiple
                  className="hidden"
                  disabled={isUploadDisabled}
                  onChange={(event) => {
                    const selectedFiles = Array.from(event.target.files ?? []);
                    handleFilesSelected(selectedFiles);
                    event.target.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadDisabled}
                  className="relative flex h-[151px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#005864] bg-[rgba(0,88,100,0.06)] px-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Upload size={30} className="text-[#005864]" />

                  <div className="mt-4 text-center">
                    <p className="text-[15px] font-medium leading-[19px] text-[#1C1C1C]">
                      Upload Image or Video
                    </p>

                    <p className="mt-1 text-[15px] leading-[19px] text-black/80">
                      PNG, JPEG (10MB) · MP4, WebM, MOV ({portfolioFiles.length}/
                      {PORTFOLIO_MAX_FILES})
                    </p>
                  </div>
                </button>

                {errors.portfolioFiles && (
                  <p className="mt-2 text-sm text-red-500" role="alert">
                    {errors.portfolioFiles.message}
                  </p>
                )}
              </div>

              {portfolioItems.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative h-[90px] w-[90px] overflow-hidden rounded-[12px] bg-[#F1F3F4]"
                    >
                      {item.isImage && item.previewUrl ? (
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : item.isVideo && item.previewUrl ? (
                        <div className="relative h-full w-full">
                          <video
                            src={item.previewUrl}
                            className="h-full w-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <Play
                              size={22}
                              className="text-white"
                              fill="white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <File size={24} className="text-[#005864]" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (item.previewUrl) {
                            URL.revokeObjectURL(item.previewUrl);
                          }

                          setValue(
                            "portfolioFiles",
                            portfolioFiles.filter(
                              (file, index) =>
                                `${file.name}-${file.lastModified}-${index}` !==
                                item.id,
                            ),
                            { shouldValidate: true },
                          );
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

              <button
                type="submit"
                disabled={
                  uploadPortfolioMutation.isPending ||
                  portfolioFiles.length === 0
                }
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
