"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";
import { useLogoutAuth } from "@/hooks/auth/use-auth-mutations";
import { LogOut, Upload, File as FileIcon, X } from "lucide-react";
import { toast } from "@/lib/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IdentityCardFormData,
  identityCardSchema,
  validateIdentityCardUploadFile,
} from "@/lib/schemas/profile-setup.schema";
import { compressImageFileIfNeeded } from "@/lib/compress-image-file";
import { prepareIdentityCardDocumentsForUpload } from "@/lib/prepare-identity-card-documents";
import { useUploadIdDocsSetup } from "@/hooks/onboarding/profile-setup-mutation";

type IdentityStatus =
  | "not-provided"
  | "pending"
  | "approved"
  | "rejected"
  | "resubmission"
  | "loading";

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

export default function IdentityVerificationPage() {
  const router = useRouter();
  const [status, setStatus] = useState<IdentityStatus>("loading");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(3);
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);
  
  const logoutMutation = useLogoutAuth();
  const uploadIdDocsMutation = useUploadIdDocsSetup();
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const [compressingField, setCompressingField] = useState<
    (typeof idCardFields)[number]["key"] | null
  >(null);
  const [isPreparingUpload, setIsPreparingUpload] = useState(false);

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

  const fetchStatus = async () => {
    setIsFetchingStatus(true);
    try {
      const response = await userService.getVerificationStatus();
      const data = response.data;
      if (data) {
        setStatus(data.identityStatus);
        setAttemptsRemaining(data.attemptsRemaining);

        // If approved, redirect to home dashboard immediately
        if (data.identityStatus === "approved") {
          router.replace("/home");
        }
      }
    } catch (error) {
      const msg = getApiErrorMessage(error, "Failed to load verification status.");
      if (msg) toast.error(msg);
      setStatus("not-provided");
    } finally {
      setIsFetchingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (status === "pending") {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          fetchStatus();
        }, 10000); // Poll every 10 seconds
      }
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [status]);

  const handleFileSelect = async (
    key: (typeof idCardFields)[number]["key"],
    file: File | undefined,
    label: string,
  ) => {
    if (!file) return;

    const validationError = validateIdentityCardUploadFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    let processedFile = file;

    if (file.type.startsWith("image/")) {
      setCompressingField(key);
      try {
        processedFile = await compressImageFileIfNeeded(file);
      } catch {
        toast.error(`Could not optimize ${label}. Using original file.`);
      } finally {
        setCompressingField(null);
      }
    }

    setValue(key, processedFile, { shouldValidate: true });
    toast.success(`${label} added successfully.`);
  };

  const onSubmit = async (data: IdentityCardFormData) => {
    setIsPreparingUpload(true);
    try {
      const payload = await prepareIdentityCardDocumentsForUpload(data);
      const response = await uploadIdDocsMutation.mutateAsync(payload);
      toast.fromApiSuccess(response, "Identity card uploaded successfully.");
      fetchStatus();
    } catch (error) {
      toast.fromApiError(error, "Could not upload identity card. Please try again.");
    } finally {
      setIsPreparingUpload(false);
    }
  };

  const renderUploadForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full">
        <div className="flex flex-col gap-6 text-left">
          {idCardFields.map((field) => {
            const selectedFile = watch(field.key);
            const previewUrl = previewUrls[field.key];
            const fileLabel = !selectedFile
              ? "Choose file to upload"
              : selectedFile.name.length <= 36
                ? selectedFile.name
                : `${selectedFile.name.slice(0, 33)}...`;

            return (
              <div key={field.key} className="w-full">
                <p className="text-[15px] font-medium text-[#1C1C1C]">
                  {field.label}
                </p>
                <p className="mb-3 mt-1 text-[13px] text-[#181818]/60">
                  JPG, PNG or PDF (max 10MB).
                </p>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id={`verify-${field.key}`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    handleFileSelect(field.key, file, field.label);
                    event.target.value = "";
                  }}
                />

                <button
                  type="button"
                  onClick={() => document.getElementById(`verify-${field.key}`)?.click()}
                  disabled={compressingField === field.key}
                  className="relative mx-auto flex h-[140px] w-full flex-col items-center justify-center overflow-hidden rounded-[12px] border border-dashed border-[#005864] bg-[#F9FAFA] disabled:cursor-not-allowed disabled:opacity-70 transition-colors hover:bg-gray-50"
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
                          setValue(field.key, undefined as unknown as File, {
                            shouldValidate: true,
                          });
                        }}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-3 py-1.5 text-center text-[12px] font-medium text-white">
                        {fileLabel}
                      </span>
                    </>
                  ) : (
                    <>
                      {selectedFile ? (
                        <FileIcon size={28} className="text-[#005864] mb-2" />
                      ) : (
                        <Upload size={28} className="text-gray-400 mb-2" />
                      )}
                      <span className="mt-1 text-[14px] font-medium text-[#1C1C1C]">
                        {compressingField === field.key ? "Optimizing image..." : fileLabel}
                      </span>
                    </>
                  )}
                </button>
                {errors[field.key] && (
                  <p className="mt-2 text-[13px] font-medium text-red-500">
                    {errors[field.key]?.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <Button
          type="submit"
          disabled={uploadIdDocsMutation.isPending || isPreparingUpload || compressingField !== null}
          className="mt-8 h-14 w-full rounded-full bg-[#005864] text-white hover:bg-[#004d57] font-[600] text-[17px] transition-all disabled:opacity-70"
        >
          {isPreparingUpload || uploadIdDocsMutation.isPending ? "Uploading..." : "Submit Documents"}
        </Button>
      </form>
    );
  };

  const renderContent = () => {
    if (status === "loading" || isFetchingStatus && status !== "pending" && status !== "rejected" && status !== "resubmission" && status !== "approved" && status !== "not-provided") {
      return (
        <div className="flex flex-col items-center gap-4 text-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#005864]" />
          <p className="text-[16px] font-medium text-gray-500">Loading your verification status...</p>
        </div>
      );
    }

    if (status === "approved") {
      return (
        <div className="flex flex-col items-center gap-5 text-center py-6">
          <div className="rounded-full bg-green-50 px-8 py-4 text-green-700 flex items-center shadow-sm border border-green-100 font-bold text-xl">
            <span className="mr-2">✅</span> Identity Verified
          </div>
          <p className="text-[16px] text-gray-600 max-w-sm">
            Thank you! Your identity has been successfully verified. Redirecting to your dashboard...
          </p>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="flex flex-col items-center gap-5 text-center py-6">
          <div className="rounded-full bg-yellow-50 px-8 py-4 text-yellow-700 flex items-center shadow-sm border border-yellow-100 font-bold text-xl">
            <span className="mr-2">⏳</span> Under Review
          </div>
          <p className="text-[16px] text-gray-600 max-w-sm">
            Your identity documents are currently under review. This page will automatically update once the review is complete.
          </p>
        </div>
      );
    }

    if (status === "resubmission") {
      return (
        <div className="flex flex-col items-center text-center w-full">
          <div className="rounded-2xl bg-orange-50 border border-orange-200 p-6 w-full shadow-sm mb-6">
            <h3 className="text-orange-800 font-bold text-lg mb-2">Resubmission Requested</h3>
            <p className="text-[15px] text-orange-700 leading-relaxed">
              Please provide clearer ID photos or additional documents to complete your verification.
            </p>
          </div>
          {renderUploadForm()}
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="flex flex-col items-center text-center w-full">
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 w-full shadow-sm mb-6">
            <h3 className="text-red-800 font-bold text-lg mb-2">Verification Declined</h3>
            <p className="text-[15px] text-red-700 mb-4">
              We were unable to verify your identity with the provided documents.
            </p>
            {attemptsRemaining > 0 ? (
              <p className="text-[14px] font-semibold text-red-700 bg-red-100 py-1.5 px-4 rounded-full inline-block">
                You have {attemptsRemaining} attempt{attemptsRemaining > 1 ? "s" : ""} remaining.
              </p>
            ) : (
              <p className="text-[14px] font-bold text-red-700 bg-red-100 py-2 px-5 rounded-full inline-block">
                Maximum 3 attempts reached. Please contact support.
              </p>
            )}
          </div>
          
          {attemptsRemaining > 0 && renderUploadForm()}
        </div>
      );
    }

    // "not-provided" or any unhandled state
    return (
      <div className="flex flex-col items-center text-center w-full">
        <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Identity Verification</h2>
        <p className="text-[16px] text-gray-600 mt-3 mb-2 max-w-sm">
          Please upload your government-issued ID to verify your identity and access the platform.
        </p>
        {renderUploadForm()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFA] flex flex-col items-center justify-center p-4 md:p-8 relative">
      <div className="absolute top-6 right-6">
        <Button
          variant="outline"
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => {
                router.replace("/auth/login");
              }
            });
          }}
          disabled={logoutMutation.isPending}
          className="flex items-center gap-2 rounded-full font-medium shadow-sm hover:bg-gray-100 transition-colors"
        >
          <LogOut size={16} />
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
      
      <div className="w-full max-w-[540px] bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-gray-100">
        {renderContent()}
      </div>
    </div>
  );
}
