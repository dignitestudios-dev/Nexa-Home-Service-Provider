// mutations/profileSetup.mutation.ts

import { useMutation } from "@tanstack/react-query";
import {
  profileSetupService,
  CompleteProfilePayload,
  UploadBusinessDocsPayload,
  UploadPortfolioPayload,
  UploadIdDocsPayload,
} from "@/services/onboard.service";

// =========================
// COMPLETE PROFILE
// =========================

export function useCompleteProfileSetup() {
  return useMutation({
    mutationFn: (payload: CompleteProfilePayload) =>
      profileSetupService.completeProfile(payload),
  });
}

// =========================
// UPLOAD BUSINESS DOCS
// =========================

export function useUploadBusinessDocsSetup() {
  return useMutation({
    mutationFn: (payload: UploadBusinessDocsPayload) =>
      profileSetupService.uploadBusinessDocs(payload),
  });
}

// UPLOAD PORTFOLIO
// =========================

export function useUploadPortfolioSetup() {
  return useMutation({
    mutationFn: (payload: UploadPortfolioPayload) =>
      profileSetupService.uploadPortfolioMedia(payload),
  });
}

// ID DOCS
// =========================

export function useUploadIdDocsSetup() {
  return useMutation({
    mutationFn: (payload: UploadIdDocsPayload) =>
      profileSetupService.uploadIdDocs(payload),
  });
}
