"use client";

import { AuthProvider } from "@/lib/auth-context";
import Sidebar from "@/components/layout/Sidebar";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Sidebar />
      <main className="min-h-screen">{children}</main>
    </AuthProvider>
  );
}
