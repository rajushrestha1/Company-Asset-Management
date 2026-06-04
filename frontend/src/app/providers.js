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
          style: {
            background: "#111120",
            color: "#f0f0ff",
            border: "1px solid #1c1c2e",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#22c988", secondary: "#0b0b13" } },
          error: { iconTheme: { primary: "#ff5fa5", secondary: "#0b0b13" } },
        }}
      />
    </AuthProvider>
  );
}