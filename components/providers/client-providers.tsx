"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </Provider>
    </SessionProvider>
  );
}
