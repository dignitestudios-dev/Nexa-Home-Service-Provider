import { OAuthProvider, signInWithPopup } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";

export type AppleSignInResult = {
  email: string;
  idToken: string;
};

export function isAppleSignInCancelled(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const code = (error as { code?: string }).code;
  return (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request"
  );
}

export async function signInWithApple(): Promise<AppleSignInResult> {
  const auth = getFirebaseAuth();
  const provider = new OAuthProvider("apple.com");

  provider.addScope("email");
  provider.addScope("name");

  const result = await signInWithPopup(auth, provider);
  const email = result.user.email?.trim().toLowerCase() ?? "";
  const idToken = await result.user.getIdToken();

  return { email, idToken };
}
