"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]" dir="rtl">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'mr-20' : 'mr-64'}`}>
        {children}
      </main>
    </div>
  );
}