"use client";

import { CheckCircle2, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import {
  dismissToast,
  subscribeToToasts,
  type ToastItem,
} from "@/lib/toast-store";
import { cn } from "@/lib/utils";

function ToastCard({ toast }: { toast: ToastItem }) {
  const isSuccess = toast.variant === "success";

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full max-w-[380px] items-start gap-3 rounded-[12px] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
        isSuccess
          ? "bg-[#005864] text-white"
          : "border-2 border-[#DC3545] bg-white text-[#842029] shadow-[0_12px_40px_rgba(220,53,69,0.18)]",
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#DC3545]" />
      )}

      <p className="flex-1 text-[15px] font-semibold leading-6">{toast.message}</p>

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        className={cn(
          "shrink-0 rounded-full p-0.5 opacity-70 transition hover:opacity-100",
          isSuccess ? "text-white" : "text-[#842029]",
        )}
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => subscribeToToasts(setItems), []);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-[300] flex w-full max-w-[380px] flex-col gap-3 sm:right-6 sm:bottom-6"
    >
      {items.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
