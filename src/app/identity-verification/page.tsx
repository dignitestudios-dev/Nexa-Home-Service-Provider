"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";
import OnboardingLogoutButton from "@/components/onboarding/onboarding-logout-button";
import { Upload, File as FileIcon, X } from "lucide-react";
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
import { parseUserProfileFromResponse } from "@/lib/parse-user-profile";
import { CURRENT_USER_QUERY_KEY } from "@/hooks/user/use-current-user-query";
import {
  extractAuthFromResponse,
  getPersistedAuthUser,
  persistAuthUser,
} from "@/lib/auth-session";
import {
  hasCompletedWalkthrough,
  WALKTHROUGH_PATH,
} from "@/lib/walkthrough-storage";
import { singUp } from "@/store/slices/auth-slice";
import type { RootState } from "@/store/index";

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

const getStorageKey = (userId?: string | null) =>
  `nexa_id_attempts_remaining_${userId || "current"}`;

const getMaxAttemptsKey = (userId?: string | null) =>
  `nexa_id_max_attempts_${userId || "current"}`;

export default function IdentityVerificationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const userId = authUser?._id ?? null;

  const resolveInitialStatus = (): IdentityStatus => {
    const raw = authUser?.identityStatus?.trim().toLowerCase();
    if (raw === "approved") return "approved";
    if (raw === "pending" || raw === "submitted") return "pending";
    // Always default to "loading" for any other state (rejected, resubmission, not-provided, or unset)
    // until verified by the API so the UI does not prematurely flash the reupload form.
    return "loading";
  };

  const [status, setStatus] = useState<IdentityStatus>(resolveInitialStatus);
  const [isInitialLoading, setIsInitialLoading] = useState(
    () => resolveInitialStatus() === "loading",
  );
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(getStorageKey(userId));
      if (stored !== null) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
    return 5;
  });
  const [maxAttempts, setMaxAttempts] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(getMaxAttemptsKey(userId));
      if (stored !== null) {
        const parsed = Number(stored);
        if (!Number.isNaN(parsed)) return parsed;
      }
    }
    return 5;
  });
  const [isFetchingStatus, setIsFetchingStatus] = useState(false);

  const uploadIdDocsMutation = useUploadIdDocsSetup();

  const isApprovedInitial =
    authUser?.identityStatus?.trim().toLowerCase() === "approved";
  const isApprovedOrRedirectingRef = useRef(isApprovedInitial);
  const hasRedirectedRef = useRef(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const justSubmittedRef = useRef(false);

  const clearPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleApproved = (userSource?: any) => {
    clearPolling();
    isApprovedOrRedirectingRef.current = true;
    setStatus("approved");

    const baseUser = userSource ?? authUser ?? getPersistedAuthUser();
    if (baseUser) {
      const approvedUser = {
        ...baseUser,
        identityStatus: "approved",
      };
      persistAuthUser(approvedUser);
      dispatch(singUp(approvedUser));
    }
    queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });

    if (!hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      if (typeof window !== "undefined") {
        const targetUser = baseUser;
        const targetPath =
          targetUser && !hasCompletedWalkthrough(targetUser._id)
            ? WALKTHROUGH_PATH
            : "/home";
        setTimeout(() => {
          window.location.href = targetPath;
        }, 1200);
      }
    }
  };

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

  const fetchStatus = async (silent = false) => {
    if (isApprovedOrRedirectingRef.current || status === "approved") {
      clearPolling();
      return;
    }

    if (!silent) {
      setIsFetchingStatus(true);
    }
    try {
      const response = await userService.getVerificationStatus();
      const data = response?.data ?? response;
      if (data) {
        const idStatus = (data.identityStatus?.trim().toLowerCase() || "") as IdentityStatus;

        // If approved, stop polling immediately, sync auth state, and navigate to home
        if (idStatus === "approved") {
          handleApproved(data.user);
          return;
        }

        if (idStatus) {
          if (!justSubmittedRef.current || idStatus !== "rejected") {
            setStatus(idStatus);
          }
        }

        // Keep Redux and localStorage authUser in sync with the server status
        const baseUser = data.user ?? authUser ?? getPersistedAuthUser();
        if (baseUser && idStatus) {
          const updatedUser = {
            ...baseUser,
            identityStatus: idStatus,
          };
          persistAuthUser(updatedUser);
          dispatch(singUp(updatedUser));
        }

        const rawRemaining =
          data.attemptsRemaining ??
          (data as Record<string, unknown>).remainingAttempts ??
          (typeof data.attempts === "number" && typeof data.maxAttempts === "number"
            ? data.maxAttempts - data.attempts
            : undefined);

        if (typeof rawRemaining === "number") {
          let effectiveRemaining = rawRemaining;
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem(getStorageKey(userId));
            if (stored !== null) {
              const parsed = Number(stored);
              if (!Number.isNaN(parsed)) {
                effectiveRemaining = Math.min(rawRemaining, parsed);
              }
            }
            localStorage.setItem(getStorageKey(userId), String(effectiveRemaining));
          }

          setAttemptsRemaining(effectiveRemaining);

          const max = data.maxAttempts ?? (effectiveRemaining > 3 ? effectiveRemaining : 5);
          if (typeof max === "number") {
            setMaxAttempts(max);
            if (typeof window !== "undefined") {
              localStorage.setItem(getMaxAttemptsKey(userId), String(max));
            }
          }
        }
      }
    } catch (error) {
      // Fallback: check /user/own or Redux user before falling back to not-provided
      try {
        const ownResponse = await userService.getOwn();
        const ownUser = parseUserProfileFromResponse(ownResponse);
        const ownStatus = ownUser?.identityStatus?.trim().toLowerCase();
        if (ownStatus) {
          if (ownStatus === "approved") {
            handleApproved(ownUser);
            return;
          }
          if (ownStatus === "rejected") {
            setStatus("rejected");
            return;
          }
          if (ownStatus === "pending" || ownStatus === "submitted") {
            setStatus("pending");
            return;
          }
          if (ownStatus === "resubmission" || ownStatus === "resubmit") {
            setStatus("resubmission");
            return;
          }
        }
      } catch {
        // ignore fallback error
      }

      const currentAuthStatus = authUser?.identityStatus?.trim().toLowerCase();
      if (currentAuthStatus === "pending" || currentAuthStatus === "submitted") {
        setStatus("pending");
      } else if (currentAuthStatus === "rejected") {
        setStatus("rejected");
      } else if (currentAuthStatus === "resubmission" || currentAuthStatus === "resubmit") {
        setStatus("resubmission");
      } else {
        const msg = getApiErrorMessage(error, "Failed to load verification status.");
        if (msg) toast.error(msg);
        setStatus("not-provided");
      }
    } finally {
      setIsFetchingStatus(false);
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialLoading) return;
    if (!authUser?.identityStatus) return;
    const raw = authUser.identityStatus.trim().toLowerCase();
    if (raw === "approved") {
      handleApproved(authUser);
    } else if (raw === "rejected") {
      if (!justSubmittedRef.current) {
        setStatus("rejected");
      }
    } else if (raw === "pending" || raw === "submitted") {
      setStatus("pending");
    } else if (raw === "resubmission" || raw === "resubmit") {
      setStatus("resubmission");
    }
  }, [authUser?.identityStatus, isInitialLoading]);

  useEffect(() => {
    if (!isApprovedOrRedirectingRef.current && status !== "approved") {
      fetchStatus(false);
    }

    return () => {
      clearPolling();
    };
  }, []);

  useEffect(() => {
    if (status === "pending" && !isApprovedOrRedirectingRef.current) {
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          if (isApprovedOrRedirectingRef.current) {
            clearPolling();
            return;
          }
          fetchStatus(true);
        }, 10000); // Poll every 10 seconds silently
      }
    } else {
      clearPolling();
    }

    return () => {
      clearPolling();
    };
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

      justSubmittedRef.current = true;

      // Decrement attempts remaining for this reattempt
      const nextRemaining = Math.max(0, attemptsRemaining - 1);
      setAttemptsRemaining(nextRemaining);
      if (typeof window !== "undefined") {
        localStorage.setItem(getStorageKey(userId), String(nextRemaining));
      }

      // Update auth user if returned
      const { user: apiUser } = extractAuthFromResponse(response);
      const baseUser = apiUser ?? authUser;
      if (baseUser) {
        const nextUser = {
          ...baseUser,
          identityStatus: apiUser?.identityStatus ?? "pending",
        };
        persistAuthUser(nextUser);
        dispatch(singUp(nextUser));
      }

      setStatus("pending");
      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });

      setTimeout(() => {
        justSubmittedRef.current = false;
        if (!isApprovedOrRedirectingRef.current) {
          fetchStatus(true);
        }
      }, 2500);
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
                  disabled={compressingField === field.key || isPreparingUpload || uploadIdDocsMutation.isPending}
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
          className="mt-8 h-14 w-full rounded-full bg-[#005864] text-white hover:bg-[#004d57] font-[600] text-[17px] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isPreparingUpload || uploadIdDocsMutation.isPending ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Uploading documents...</span>
            </>
          ) : (
            "Submit Documents"
          )}
        </Button>
      </form>
    );
  };

  const renderContent = () => {
    if (
      status === "loading" ||
      isInitialLoading ||
      (isFetchingStatus && status !== "pending")
    ) {
      return (
        <div className="flex flex-col items-center gap-4 text-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#005864]" />
          <p className="text-[16px] font-medium text-gray-500">Checking your verification status...</p>
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
            Thank you! Your identity has been successfully verified. Continuing to app walkthrough...
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
                Maximum {maxAttempts} attempts reached. Please contact support.
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
      <OnboardingLogoutButton />

      <div className="w-full max-w-[540px] bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-gray-100">
        {renderContent()}
      </div>
    </div>
  );
}
