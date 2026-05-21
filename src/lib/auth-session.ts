import Cookies from "js-cookie";
import type { AppDispatch } from "@/store/index";
import {
  clearAuth,
  setToken,
  singUp,
  type User,
} from "@/store/slices/auth-slice";
import { clearPendingVerifyEmail } from "@/lib/verify-email-storage";

export const AUTH_TOKEN_COOKIE = "token";
const AUTH_USER_STORAGE_KEY = "nexa_auth_user";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  path: "/",
  sameSite: "lax",
};

/** Persists JWT in a cookie so axios can attach it on every API request. */
export function setAuthTokenCookie(token: string): void {
  Cookies.set(AUTH_TOKEN_COOKIE, token, COOKIE_OPTIONS);
}

export function getAuthTokenCookie(): string | undefined {
  return Cookies.get(AUTH_TOKEN_COOKIE);
}

export function clearAuthTokenCookie(): void {
  Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
}

export function persistAuthUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

export function getPersistedAuthUser(): User | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    return parsed?._id ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPersistedAuthUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

/** Reads Mongo user id from JWT payload (fallback when Redux user is empty). */
export function getUserIdFromToken(token: string): string | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    const json = atob(segment.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as Record<string, unknown>;
    const id = payload.id ?? payload._id ?? payload.userId;

    return typeof id === "string" ? id : null;
  } catch {
    return null;
  }
}

/** Resolves current user id from Redux, storage, or JWT cookie. */
export function getAuthUserId(user: User | null | undefined): string | null {
  if (user?._id) return user._id;

  const stored = getPersistedAuthUser();
  if (stored?._id) return stored._id;

  const token = getAuthTokenCookie();
  if (token) return getUserIdFromToken(token);

  return null;
}

export function extractAuthFromResponse(data: unknown): {
  token: string | null;
  user: User | null;
} {
  if (!data || typeof data !== "object") {
    return { token: null, user: null };
  }

  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  const token =
    (typeof record.token === "string" && record.token) ||
    (typeof record.accessToken === "string" && record.accessToken) ||
    (nested &&
      ((typeof nested.token === "string" && nested.token) ||
        (typeof nested.accessToken === "string" && nested.accessToken))) ||
    null;

  const userRaw =
    (nested?.user && typeof nested.user === "object" ? nested.user : null) ||
    (nested && typeof nested._id === "string" ? nested : null) ||
    (record.user && typeof record.user === "object" ? record.user : null) ||
    null;

  return {
    token,
    user: userRaw as User | null,
  };
}

/** Saves JWT cookie + Redux auth state from login / verify-email API bodies. */
export function persistAuthFromResponse(
  data: unknown,
  dispatch: AppDispatch,
): { token: string | null; user: User | null } {
  const { token, user } = extractAuthFromResponse(data);

  if (token) {
    setAuthTokenCookie(token);
    dispatch(setToken(token));
  }

  if (user) {
    persistAuthUser(user);
    dispatch(singUp(user));
  }

  return { token, user };
}

/** Clears JWT cookie and Redux auth state (e.g. on logout). */
export function clearAuthSession(dispatch: AppDispatch): void {
  clearAuthTokenCookie();
  clearPersistedAuthUser();
  clearPendingVerifyEmail();
  dispatch(clearAuth());
}
