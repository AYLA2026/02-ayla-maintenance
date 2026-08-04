"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  
  const isAuthPage = pathname === "/auth/login" || pathname.startsWith("/auth/");

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`flex-1 transition-all duration-300 p-6 lg:p-8 min-h-screen ${collapsed ? 'mr-20' : 'mr-64'}`}>
        {children}
      </main>
    </div>
  );
}