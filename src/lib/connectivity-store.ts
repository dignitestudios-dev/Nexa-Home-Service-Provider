type Listener = (open: boolean) => void;

let isOpen = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener(isOpen));
}

export function subscribeToConnectivityModal(listener: Listener): () => void {
  listeners.add(listener);
  listener(isOpen);
  return () => {
    listeners.delete(listener);
  };
}

export function showConnectivityLostModal(): void {
  if (isOpen) return;
  isOpen = true;
  emit();
}

export function hideConnectivityLostModal(): void {
  if (!isOpen) return;
  isOpen = false;
  emit();
}
