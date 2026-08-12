"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h2 className="text-2xl font-bold text-[#1C1C1C]">Something went wrong!</h2>
      <p className="mt-2 text-sm text-gray-600">
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-[#005864] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004650]"
      >
        Try again
      </button>
    </div>
  );
}
