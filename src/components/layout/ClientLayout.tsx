"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // المسارات اللي ما يظهر فيها Sidebar
  const hideSidebar =
    pathname?.startsWith("/technician-app") ||
    pathname?.startsWith("/auth");

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}