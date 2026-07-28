"use client";

import { AuthProvider } from "@/lib/auth-context";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname?.startsWith("/auth") || pathname?.startsWith("/technician-app");

  return (
    <AuthProvider>
      {!hideSidebar && <Sidebar />}
      <main className={hideSidebar ? "min-h-screen" : "min-h-screen mr-0 lg:mr-64"}>
        {children}
      </main>
    </AuthProvider>
  );
}
