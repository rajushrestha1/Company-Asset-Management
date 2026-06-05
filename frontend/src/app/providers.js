"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
  position="top-right"
  toastOptions={{
    className:
      "!bg-slate-900/80 !backdrop-blur-md !text-white !border !border-white/10 !shadow-xl",
    success: {
      className:
        "!bg-emerald-500/20 !backdrop-blur-md !text-emerald-100 !border !border-emerald-500/30",
    },
    error: {
      className:
        "!bg-rose-500/20 !backdrop-blur-md !text-rose-100 !border !border-rose-500/30",
    },
  }}
/>
    </AuthProvider>
  );
}