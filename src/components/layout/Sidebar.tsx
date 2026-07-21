"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Folder,
  Building2,
  Users,
  Package,
  Truck,
  Wallet,
  Calendar,
  FileText,
  AlertTriangle,
  Settings,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  { title: "الرئيسية", href: "/", icon: LayoutDashboard },
  { title: "المشاريع", href: "/projects", icon: Folder },
  { title: "المدارس", href: "/schools", icon: Building2 },
  { title: "القوى العاملة", href: "/workforce", icon: Users },
  { title: "الفرق", href: "/teams", icon: Users },
  { title: "المخازن", href: "/inventory", icon: Package },
  { title: "المركبات", href: "/vehicles", icon: Truck },
  { title: "المالية", href: "/finance", icon: Wallet },
  { title: "الجدولة", href: "/schedule", icon: Calendar },
  { title: "التقارير", href: "/reports", icon: FileText },
  { title: "البلاغات", href: "/complaints", icon: AlertTriangle },
  { title: "الإعدادات", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // ❌ إخفاء الشريط في صفحات auth
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <>
      {/* زر القائمة في الجوال */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-[#C9A227] text-[#1A0F09] md:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* الشريط الجانبي */}
      <aside
        className={`fixed right-0 top-0 h-screen w-64 z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
          bg-[#1A0F09] border-l border-[#C9A227]/20 flex flex-col`}
      >
        {/* الشعار */}
        <div className="p-6 border-b border-[#C9A227]/20">
          <h1 className="text-xl font-bold text-[#C9A227]" style={{ fontFamily: "var(--font-tajawal), sans-serif" }}>
            Ayla Maintenance
          </h1>
          <p className="text-xs text-[#5C3A2A] mt-1">آيلا للصيانة</p>
        </div>

        {/* القائمة */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? "bg-[#C9A227] text-[#1A0F09]" 
                    : "text-[#FAF7F2]/70 hover:bg-[#C9A227]/10 hover:text-[#FAF7F2]"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
                {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* التوقيع */}
        <div className="p-4 border-t border-[#C9A227]/20">
          <p className="text-xs text-[#5C3A2A] text-center">
            مسؤول النظام<br/>
            م. محمد عبد الرحمن
          </p>
        </div>
      </aside>

      {/* خلفية داكنة للجوال */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}