import type { AppDispatch } from "@/store/index";
import { extractAuthFromResponse, persistAuthUser } from "@/lib/auth-session";
import {
  getNextOnboardingStepPath,
  mergeUserOnboardingFlags,
} from "@/lib/onboarding-steps";
import { singUp, type User } from "@/store/slices/auth-slice";

type OnboardingFlags = Partial<
  Pick<
    User,
    | "isProfileCompleted"
    | "businessDocsSubmitted"
    | "portfolioMediaUploaded"
    | "identityStatus"
  >
>;

type AppRouter = {
  replace: (href: string) => void;
};

export type NavigateOnboardingOptions = {
  /** API body (`data` user object with step flags). */
  apiResponse?: unknown;
  /** Fallback when the API does not return a user object. */
  completedFlags?: OnboardingFlags;
};

/** Merges API user + local flags so onboarding guards stay in sync with the server. */
export function resolveOnboardingUserAfterStep(
  currentUser: User | null | undefined,
  options?: NavigateOnboardingOptions,
): User | null {
  const { user: apiUser } = extractAuthFromResponse(options?.apiResponse);

  if (!currentUser && !apiUser) {
    return null;
  }

  let nextUser: User = apiUser
    ? mergeOnboardingApiUser(currentUser, apiUser)
    : (currentUser as User);

  if (options?.completedFlags) {
    nextUser = mergeUserOnboardingFlags(nextUser, options.completedFlags);
  }

  return nextUser;
}

/** Keeps auth flags when upload APIs return a partial user (e.g. missing isEmailVerified). */
function mergeOnboardingApiUser(
  currentUser: User | null | undefined,
  apiUser: User,
): User {
  const base = currentUser ?? apiUser;

  return {
    ...base,
    ...apiUser,
    isEmailVerified: apiUser.isEmailVerified || base.isEmailVerified,
    isPhoneVerified: apiUser.isPhoneVerified || base.isPhoneVerified,
    isPasswordSet: apiUser.isPasswordSet || base.isPasswordSet,
    isProfileCompleted:
      apiUser.isProfileCompleted || base.isProfileCompleted,
    businessDocsSubmitted:
      apiUser.businessDocsSubmitted || base.businessDocsSubmitted,
    portfolioMediaUploaded:
      apiUser.portfolioMediaUploaded || base.portfolioMediaUploaded,
  };
}

export function navigateToNextOnboardingStep(
  router: AppRouter,
  dispatch: AppDispatch,
  user: User | null | undefined,
  options?: NavigateOnboardingOptions,
) {
  const nextUser = resolveOnboardingUserAfterStep(user, options);

  if (!nextUser) {
    router.replace("/auth/login");
    return;
  }

  persistAuthUser(nextUser);
  dispatch(singUp(nextUser));
  router.replace(getNextOnboardingStepPath(nextUser));
}
