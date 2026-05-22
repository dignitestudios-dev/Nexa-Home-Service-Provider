export type ToastVariant = "success" | "error";

export type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
};

export type ToastInput = {
  message: string;
  variant: ToastVariant;
  duration?: number;
};

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener([...toasts]));
}

function createId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener([...toasts]);
  return () => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: string) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export function pushToast(input: ToastInput) {
  const toast: ToastItem = {
    id: createId(),
    message: input.message,
    variant: input.variant,
    duration: input.duration ?? 4000,
  };

  toasts = [...toasts, toast].slice(-5);
  emit();

  if (typeof window !== "undefined" && toast.duration > 0) {
    window.setTimeout(() => dismissToast(toast.id), toast.duration);
  }
}

export function clearToasts() {
  toasts = [];
  emit();
}
