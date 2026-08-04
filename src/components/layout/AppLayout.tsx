"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const isAuthPage = pathname === "/auth/login" || pathname.startsWith("/auth/");

  // إذا لم يكن مسجلاً وليس في صفحة الدخول → وجهه للدخول
  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push("/auth/login");
    }
  }, [loading, user, isAuthPage, router]);

  // صفحات الدخول: بدون شريط جانبي
  if (isAuthPage) {
    return <>{children}</>;
  }

  // أثناء التحميل: spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // غير مسجل (لكن loading انتهى): لا تعرض شيء (الuseEffect راح يوجهه)
  if (!user) return null;

  // مسجل دخول: اعرض الشريط الجانبي + المحتوى
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar />
      <main className="flex-1 mr-64 p-6 lg:p-8 min-h-screen">{children}</main>
    </div>
  );
}