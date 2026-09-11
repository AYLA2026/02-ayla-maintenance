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
        className={`min-h-screen bg-[#FAF7F2] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          hideSidebar ? "" : collapsed ? "mr-[72px]" : "mr-[260px]"
        }`}
      >
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </AuthProvider>
  );
}