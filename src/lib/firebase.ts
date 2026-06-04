import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyDEuT-YrRoiTouezxyGHgZMMCcU5s4nTLU",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "nexahome-5d42f.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "nexahome-5d42f",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "nexahome-5d42f.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "707682138709",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:707682138709:web:db8c2af1189a96aed5b2dc",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-48X85Z2RKF",
};

function createFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

let firebaseAuth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser.");
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(createFirebaseApp());
  }

  return firebaseAuth;
}

export function initFirebaseAnalytics(): void {
  if (typeof window === "undefined") return;

  void import("firebase/analytics").then(({ getAnalytics, isSupported }) =>
    isSupported().then((supported) => {
      if (!supported) return;
      getAnalytics(createFirebaseApp());
    }),
  );
}
