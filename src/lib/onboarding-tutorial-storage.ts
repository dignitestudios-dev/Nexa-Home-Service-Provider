export const TUTORIAL_ONBOARDING_PROFILE_PATH =
  "/tutorial/onboarding/profile-setup";
export const TUTORIAL_ONBOARDING_DOCS_PATH =
  "/tutorial/onboarding/business-documents";
export const TUTORIAL_ONBOARDING_PORTFOLIO_PATH =
  "/tutorial/onboarding/portfolio";
export const TUTORIAL_ONBOARDING_ID_PATH =
  "/tutorial/onboarding/identity-card";

export const TUTORIAL_HOME_PATH = "/tutorial/home";
export const TUTORIAL_HOME_JOB_PATH = "/tutorial/home/jobs/emergency-pipe-leak";

export const TUTORIAL_STEPS = [
  {
    step: 1,
    id: "profile-setup",
    title: "Profile Setup",
    path: TUTORIAL_ONBOARDING_PROFILE_PATH,
    nextPath: TUTORIAL_ONBOARDING_DOCS_PATH,
    prevPath: null,
  },
  {
    step: 2,
    id: "business-documents",
    title: "Business Documents",
    path: TUTORIAL_ONBOARDING_DOCS_PATH,
    nextPath: TUTORIAL_ONBOARDING_PORTFOLIO_PATH,
    prevPath: TUTORIAL_ONBOARDING_PROFILE_PATH,
  },
  {
    step: 3,
    id: "portfolio",
    title: "Portfolio",
    path: TUTORIAL_ONBOARDING_PORTFOLIO_PATH,
    nextPath: TUTORIAL_ONBOARDING_ID_PATH,
    prevPath: TUTORIAL_ONBOARDING_DOCS_PATH,
  },
  {
    step: 4,
    id: "identity-card",
    title: "Identity Verification",
    path: TUTORIAL_ONBOARDING_ID_PATH,
    nextPath: "/onboarding/profile-setup",
    prevPath: TUTORIAL_ONBOARDING_PORTFOLIO_PATH,
  },
] as const;

const ONBOARDING_TUTORIAL_COMPLETED_KEY =
  "nexa_onboarding_tutorial_completed_users";
const HOME_TUTORIAL_COMPLETED_KEY =
  "nexa_home_tutorial_completed_users";

function readCompletedUserIds(key: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function writeCompletedUserIds(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {}
}

export function hasCompletedOnboardingTutorial(
  userId?: string | null,
): boolean {
  if (typeof window === "undefined") return false;
  const list = readCompletedUserIds(ONBOARDING_TUTORIAL_COMPLETED_KEY);
  if (userId) {
    return list.includes(userId);
  }
  return list.length > 0 || list.includes("anonymous");
}

export function markOnboardingTutorialCompleted(
  userId?: string | null,
): void {
  if (typeof window === "undefined") return;
  const list = new Set(readCompletedUserIds(ONBOARDING_TUTORIAL_COMPLETED_KEY));
  if (userId) {
    list.add(userId);
  } else {
    list.add("anonymous");
  }
  writeCompletedUserIds(ONBOARDING_TUTORIAL_COMPLETED_KEY, Array.from(list));
}

export function resetOnboardingTutorial(userId?: string | null): void {
  if (typeof window === "undefined") return;
  if (!userId) {
    writeCompletedUserIds(ONBOARDING_TUTORIAL_COMPLETED_KEY, []);
    return;
  }
  const filtered = readCompletedUserIds(
    ONBOARDING_TUTORIAL_COMPLETED_KEY,
  ).filter((id) => id !== userId);
  writeCompletedUserIds(ONBOARDING_TUTORIAL_COMPLETED_KEY, filtered);
}

// ─── Home / Available Jobs Tutorial ──────────────────────────────────────────

export function hasCompletedHomeTutorial(
  userId?: string | null,
): boolean {
  if (typeof window === "undefined") return false;
  const list = readCompletedUserIds(HOME_TUTORIAL_COMPLETED_KEY);
  if (userId) {
    return list.includes(userId);
  }
  return list.length > 0 || list.includes("anonymous");
}

export function markHomeTutorialCompleted(
  userId?: string | null,
): void {
  if (typeof window === "undefined") return;
  const list = new Set(readCompletedUserIds(HOME_TUTORIAL_COMPLETED_KEY));
  if (userId) {
    list.add(userId);
  } else {
    list.add("anonymous");
  }
  writeCompletedUserIds(HOME_TUTORIAL_COMPLETED_KEY, Array.from(list));
}

export function resetHomeTutorial(userId?: string | null): void {
  if (typeof window === "undefined") return;
  if (!userId) {
    writeCompletedUserIds(HOME_TUTORIAL_COMPLETED_KEY, []);
    return;
  }
  const filtered = readCompletedUserIds(
    HOME_TUTORIAL_COMPLETED_KEY,
  ).filter((id) => id !== userId);
  writeCompletedUserIds(HOME_TUTORIAL_COMPLETED_KEY, filtered);
}

export function isTutorialPath(pathname: string): boolean {
  const basePath = pathname.split("?")[0].toLowerCase();
  return basePath === "/tutorial" || basePath.startsWith("/tutorial/");
}
