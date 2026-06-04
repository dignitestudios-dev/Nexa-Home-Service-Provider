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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { navigateToNextOnboardingStep } from "@/lib/onboarding-navigation";
import type { RootState } from "@/store/index";
import {
  BUSINESS_DOC_ACCEPT,
  BUSINESS_DOC_LABELS,
  BusinessDocumentsFormData,
  businessDocumentsSchema,
  validateBusinessDocumentFile,
  type BusinessDocumentFieldKey,
} from "@/lib/schemas/profile-setup.schema";
import { useUploadBusinessDocsSetup } from "@/hooks/onboarding/profile-setup-mutation";
import { compressImageFileIfNeeded } from "@/lib/compress-image-file";
import { prepareBusinessDocumentsForUpload } from "@/lib/prepare-business-documents";
import { toast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const stepItems = [
  { label: "Profile Setup", icon: UserRound, active: false },
  { label: "Business Documents", icon: FileText, active: true },
  { label: "Portfolio", icon: BriefcaseBusiness, active: false },
  { label: "Identity Card", icon: IdCard, active: false },
];

const documentFields = (
  Object.entries(BUSINESS_DOC_LABELS) as [BusinessDocumentFieldKey, string][]
).map(([key, label]) => ({ key, label }));

type DocumentKey = (typeof documentFields)[number]["key"];

export default function BusinessDocumentsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const uploadDocsMutation = useUploadBusinessDocsSetup();

  const [files, setFiles] = useState<Partial<Record<DocumentKey, File>>>({});
  const [compressingField, setCompressingField] = useState<DocumentKey | null>(
    null,
  );
  const [isPreparingUpload, setIsPreparingUpload] = useState(false);

  const {
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<BusinessDocumentsFormData>({
    resolver: zodResolver(businessDocumentsSchema),

    defaultValues: {
      businessLicense: undefined,
      taxRegistration: undefined,
      ownershipCertificate: undefined,
      proofOfAddress: undefined,
    },
  });

  // FILE REFS
  // =========================

  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // WATCH FILES
  // =========================

  const previewUrls = useMemo(() => {
    return documentFields.reduce(
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

  const hasAnyDocument = useMemo(() => Object.keys(files).length > 0, [files]);

  const onSubmit = async (data: BusinessDocumentsFormData) => {
    setIsPreparingUpload(true);

    try {
      const payload = await prepareBusinessDocumentsForUpload(data);
      const response = await uploadDocsMutation.mutateAsync(payload);

      navigateToNextOnboardingStep(router, dispatch, user, {
        apiResponse: response,
        completedFlags: { businessDocsSubmitted: true },
      });
    } catch (error) {
      toast.fromApiError(
        error,
        "Could not upload business documents. Please try again.",
      );
    } finally {
      setIsPreparingUpload(false);
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
            onClick={() => router.push("/onboarding/profile-setup")}
            className="absolute left-4 top-2 inline-flex h-12 w-12 items-center justify-center rounded-full text-[#181818] hover:bg-black/5 lg:left-6 lg:top-4"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button> */}

          <section className="mt-12 w-full max-w-[766px] lg:mt-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-12 w-full max-w-[766px] lg:mt-6"
            >
              <div className="text-center">
                <h1 className="text-[32px] font-semibold leading-[40px] tracking-[-0.008em] text-[#1C1C1C]">
                  Identification and Verification
                </h1>

                <p className="mt-4 text-[16px] leading-5 tracking-[-0.014em] text-black/80">
                  Upload your business license, proof of identity,
                  certifications.
                </p>
              </div>

              {/* GLOBAL ERROR */}

              {errors.root && (
                <p className="mt-4 text-center text-sm text-red-500">
                  {errors.root.message}
                </p>
              )}

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {documentFields.map((field) => {
                  const selectedFile = watch(field.key);

                  const fileText = selectedFile
                    ? selectedFile.name
                    : "Choose file to upload";

                  const previewUrl = previewUrls[field.key];

                  const isImage = Boolean(previewUrl);

                  return (
                    <div key={field.key}>
                      <p className="mb-[7px] text-[14px] font-medium leading-[127.5%] text-[#1C1C1C]">
                        {field.label}
                      </p>

                      <input
                        ref={(el) => {
                          fileRefs.current[field.key] = el;
                        }}
                        type="file"
                        className="hidden"
                        accept={BUSINESS_DOC_ACCEPT}
                        onChange={async (event) => {
                          const file = event.target.files?.[0] ?? null;
                          if (!file) return;

                          const validationError = validateBusinessDocumentFile(
                            file,
                            field.key,
                          );

                          if (validationError) {
                            toast.error(validationError);
                            setError(field.key, {
                              type: "manual",
                              message: validationError,
                            });
                            setValue(field.key, null as any, {
                              shouldValidate: true,
                            });
                            event.target.value = "";
                            return;
                          }

                          let processedFile = file;

                          if (file.type.startsWith("image/")) {
                            setCompressingField(field.key);

                            try {
                              processedFile = await compressImageFileIfNeeded(file);
                            } catch {
                              toast.error(
                                `Could not optimize ${field.label}. Using original file.`,
                              );
                            } finally {
                              setCompressingField(null);
                            }
                          }

                          clearErrors(field.key);
                          setValue(field.key, processedFile, {
                            shouldValidate: true,
                          });
                          setFiles((current) => ({
                            ...current,
                            [field.key]: processedFile,
                          }));
                          event.target.value = "";
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => fileRefs.current[field.key]?.click()}
                        disabled={compressingField === field.key}
                        className="relative flex h-[100px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] border border-[#BEBEBE] bg-[rgba(0,88,100,0.06)] px-3 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isImage ? (
                          <>
                            <img
                              src={previewUrl}
                              alt={`${field.label} preview`}
                              className="absolute inset-0 h-full w-full object-cover"
                            />

                            <span className="absolute inset-x-0 bottom-0 truncate bg-black/45 px-2 py-1 text-center text-[11px] text-white">
                              {fileText}
                            </span>
                          </>
                        ) : (
                          <>
                            {selectedFile ? (
                              <File size={28} className="text-[#005864]" />
                            ) : (
                              <Upload size={28} className="text-[#005864]" />
                            )}

                            <span className="mt-3 w-full truncate text-center text-[12px] leading-[127.5%] text-[#1C1C1C]">
                              {compressingField === field.key
                                ? "Optimizing image..."
                                : fileText}
                            </span>
                          </>
                        )}
                      </button>

                      {errors[field.key] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[field.key]?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={
                  uploadDocsMutation.isPending ||
                  isPreparingUpload ||
                  compressingField !== null
                }
                className="mx-auto mt-10 block h-12 w-full cursor-pointer max-w-[500px] rounded-[12px] bg-[#005864] text-[16px] font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPreparingUpload || uploadDocsMutation.isPending
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
