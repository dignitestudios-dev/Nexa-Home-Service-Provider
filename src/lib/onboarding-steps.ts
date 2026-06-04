import type { User } from "@/store/slices/auth-slice";
import { getPostOnboardingEntryPath, hasCompletedWalkthrough } from "@/lib/walkthrough-storage";

export const ONBOARDING_STEPS = [
  {
    id: "profile",
    path: "/onboarding/profile-setup",
    isComplete: (user: User) => user.isProfileCompleted,
  },
  {
    id: "business-docs",
    path: "/onboarding/business-documents",
    isComplete: (user: User) => user.businessDocsSubmitted,
  },
  {
    id: "portfolio",
    path: "/onboarding/portfolio",
    isComplete: (user: User) => user.portfolioMediaUploaded,
  },
  {
    id: "identity",
    path: "/onboarding/identity-card",
    isComplete: (user: User) => isIdentityStepComplete(user.identityStatus),
  },
] as const;

/** Shown right after identity upload (step 4); not a separate onboarding step. */
export const ONBOARDING_POST_IDENTITY_PATHS = [
  "/onboarding/account-status",
  "/onboarding/id-submitted",
] as const;

const IDENTITY_COMPLETE_STATUSES = new Set([
  "pending",
  "submitted",
  "approved",
]);

export function isIdentityStepComplete(
  identityStatus: string | null | undefined,
): boolean {
  const normalized = identityStatus?.trim().toLowerCase();
  if (!normalized || normalized === "not-provided") return false;
  if (normalized === "rejected" || normalized === "resubmit") return false;
  if (IDENTITY_COMPLETE_STATUSES.has(normalized)) return true;
  return normalized !== "not-provided";
}

export function getCurrentOnboardingStepIndex(user: User): number {
  const index = ONBOARDING_STEPS.findIndex((step) => !step.isComplete(user));
  return index === -1 ? ONBOARDING_STEPS.length : index;
}

export function isOnboardingComplete(user: User): boolean {
  return getCurrentOnboardingStepIndex(user) >= ONBOARDING_STEPS.length;
}

export function getOnboardingPathStepIndex(pathname: string): number | null {
  const basePath = pathname.split("?")[0];

  const mainStepIndex = ONBOARDING_STEPS.findIndex(
    (step) => basePath === step.path,
  );
  if (mainStepIndex >= 0) return mainStepIndex;

  const isPostIdentity = ONBOARDING_POST_IDENTITY_PATHS.some(
    (path) => basePath === path || basePath.startsWith(`${path}/`),
  );
  if (isPostIdentity) return 3;

  return null;
}

export function isOnboardingPath(pathname: string): boolean {
  return getOnboardingPathStepIndex(pathname) !== null;
}

export function isPostIdentityOnboardingPath(pathname: string): boolean {
  const basePath = pathname.split("?")[0];
  return ONBOARDING_POST_IDENTITY_PATHS.some(
    (path) => basePath === path || basePath.startsWith(`${path}/`),
  );
}

/**
 * User may only open their current incomplete step — not completed steps (back)
 * or future steps (skip). Post-identity pages allowed on step 4.
 */
export function canAccessOnboardingPath(pathname: string, user: User): boolean {
  const pathStepIndex = getOnboardingPathStepIndex(pathname);
  if (pathStepIndex === null) return false;

  const basePath = pathname.split("?")[0];
  const isPostIdentityPath = ONBOARDING_POST_IDENTITY_PATHS.some(
    (path) => basePath === path || basePath.startsWith(`${path}/`),
  );

  if (isPostIdentityPath) {
    return true;
  }

  if (isOnboardingComplete(user)) {
    return false;
  }

  const currentStepIndex = getCurrentOnboardingStepIndex(user);

  if (
    pathStepIndex === 3 &&
    ONBOARDING_STEPS[3].path === basePath &&
    needsIdentityResubmit(user.identityStatus)
  ) {
    return true;
  }

  if (pathStepIndex < currentStepIndex) {
    return false;
  }

  return pathStepIndex === currentStepIndex;
}

export function needsIdentityResubmit(
  identityStatus: string | null | undefined,
): boolean {
  const normalized = identityStatus?.trim().toLowerCase();
  return normalized === "rejected" || normalized === "resubmit";
}

/** Next onboarding step only (no verify-email) — use after completing a step. */
export function getNextOnboardingStepPath(user: User): string {
  if (isOnboardingComplete(user)) {
    return getPostOnboardingEntryPath(user._id);
  }

  return ONBOARDING_STEPS[getCurrentOnboardingStepIndex(user)].path;
}

/** Post-login redirect: email verification, then onboarding, then home. */
export function getOnboardingRedirectPath(user: User | null): string {
  if (!user) {
    return "/auth/login";
  }

  if (!user.isEmailVerified) {
    return "/auth/verify-email";
  }

  if (hasCompletedWalkthrough(user._id)) {
    return "/home";
  }

  return getNextOnboardingStepPath(user);
}

export function mergeUserOnboardingFlags(
  user: User,
  flags: Partial<
    Pick<
      User,
      | "isProfileCompleted"
      | "businessDocsSubmitted"
      | "portfolioMediaUploaded"
      | "identityStatus"
      | "isEmailVerified"
    >
  >,
): User {
  return { ...user, ...flags };
}
