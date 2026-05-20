"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { CurrentUserSync } from "@/components/auth/current-user-sync";
import { createQueryClient } from "@/lib/query-client";
import { store } from "@/store";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator />
        <CurrentUserSync />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
