export const WALKTHROUGH_PATH = "/Walkthrough";
export const WALKTHROUGH_CREDIT_PLANS_PATH = "/Walkthrough/credit-plans";
export const WALKTHROUGH_CREDIT_SUCCESS_PATH =
  "/Walkthrough/credit-plans/success";
export const WALKTHROUGH_CREDIT_CANCEL_PATH =
  "/Walkthrough/credit-plans/cancel";
export const WALKTHROUGH_VERIFIED_BADGE_PATH = "/Walkthrough/verified-badge";
export const WALKTHROUGH_VERIFIED_BADGE_SUCCESS_PATH =
  "/Walkthrough/verified-badge/success";
export const WALKTHROUGH_VERIFIED_BADGE_CANCEL_PATH =
  "/Walkthrough/verified-badge/cancel";

const WALKTHROUGH_COMPLETED_KEY = "nexa_walkthrough_completed_user_ids";
const WALKTHROUGH_PENDING_KEY = "nexa_walkthrough_pending_user_id";

function readCompletedUserIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(WALKTHROUGH_COMPLETED_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeCompletedUserIds(userIds: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(WALKTHROUGH_COMPLETED_KEY, JSON.stringify(userIds));
}

export function isWalkthroughPath(pathname: string): boolean {
  const basePath = pathname.split("?")[0];
  return (
    basePath === WALKTHROUGH_PATH || basePath.startsWith(`${WALKTHROUGH_PATH}/`)
  );
}

export function hasCompletedWalkthrough(
  userId: string | null | undefined,
): boolean {
  if (!userId) return false;
  return readCompletedUserIds().includes(userId);
}

export function markWalkthroughPending(userId: string): void {
  if (typeof window === "undefined" || !userId) return;
  sessionStorage.setItem(WALKTHROUGH_PENDING_KEY, userId);
}

export function clearWalkthroughPending(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(WALKTHROUGH_PENDING_KEY);
}

export function isWalkthroughPending(userId: string | null | undefined): boolean {
  if (typeof window === "undefined" || !userId) return false;
  return sessionStorage.getItem(WALKTHROUGH_PENDING_KEY) === userId;
}

export function shouldRequireWalkthrough(
  userId: string | null | undefined,
): boolean {
  if (!userId || hasCompletedWalkthrough(userId)) return false;
  return isWalkthroughPending(userId);
}

export function markWalkthroughCompleted(userId: string): void {
  if (!userId) return;

  const completedIds = new Set(readCompletedUserIds());
  completedIds.add(userId);
  writeCompletedUserIds(Array.from(completedIds));
  clearWalkthroughPending();
}

export function getPostOnboardingEntryPath(userId: string): string {
  return shouldRequireWalkthrough(userId) ? WALKTHROUGH_PATH : "/home";
}
