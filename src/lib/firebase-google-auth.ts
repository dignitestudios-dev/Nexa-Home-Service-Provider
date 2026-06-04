import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";

export type GoogleSignInResult = {
  email: string;
  idToken: string;
};

export function isGoogleSignInCancelled(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const code = (error as { code?: string }).code;
  return (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request"
  );
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({ prompt: "select_account" });

  const result = await signInWithPopup(auth, provider);
  const email = result.user.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Google account email is not available.");
  }

  const idToken = await result.user.getIdToken();

  return { email, idToken };
}
