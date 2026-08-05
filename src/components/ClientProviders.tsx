"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth-context";
import Sidebar from "@/components/layout/Sidebar";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const hideSidebar = pathname === "/auth/login" || pathname.startsWith("/auth/");

  return (
    <AuthProvider>
      {!hideSidebar && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <main 
        className={`min-h-screen transition-all duration-300 ease-in-out overflow-x-hidden px-6 py-6 ${
          hideSidebar ? "" : collapsed ? "mr-20" : "mr-64"
        }`}
      >
        {children}
      </main>
    </AuthProvider>
  );
}