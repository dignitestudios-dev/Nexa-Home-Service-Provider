"use client";

import { useEffect, useState } from "react";

import { ConnectivityLostModal } from "@/components/ui/connectivity-lost-modal";
import {
  hideConnectivityLostModal,
  showConnectivityLostModal,
  subscribeToConnectivityModal,
} from "@/lib/connectivity-store";

export function ConnectivityMonitor() {
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeToConnectivityModal(setOpen), []);

  useEffect(() => {
    const handleOffline = () => showConnectivityLostModal();
    const handleOnline = () => hideConnectivityLostModal();

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine) {
      showConnectivityLostModal();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return <ConnectivityLostModal open={open} />;
}
