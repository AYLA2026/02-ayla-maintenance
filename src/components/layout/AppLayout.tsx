"use client";

import { useAuth } from "@/lib/auth-context";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#FAF7F2]" dir="rtl">
      <Sidebar />
      <main className="transition-all duration-300 mr-0 lg:mr-64 p-6">
        {children}
      </main>
    </div>
  );
}