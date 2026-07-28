"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth-context";
import Sidebar from "@/components/layout/Sidebar";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    const isAuthPage = pathname?.startsWith("/auth");
    const isPublic = pathname === "/" || pathname?.startsWith("/_next") || pathname?.includes(".");

    if (!session && !isAuthPage && !isPublic) {
      router.push("/auth/login");
    }
    if (session && isAuthPage) {
      router.push("/");
    }
  }, [session, status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <AuthGuard>
          <Sidebar />
          <main className="min-h-screen">{children}</main>
        </AuthGuard>
      </AuthProvider>
    </SessionProvider>
  );
}
