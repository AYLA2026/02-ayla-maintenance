"use client";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]" dir="rtl">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}