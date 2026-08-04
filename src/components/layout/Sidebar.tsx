"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { NAV_ITEMS } from "@/lib/permissions";
import {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3, LogOut,
  ChevronDown, ChevronLeft,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3,
};

// عناصر بها submenu
const SUBMENU_ITEMS: Record<string, { label: string; href: string }[]> = {
  "/complaints": [
    { label: "سجل البلاغات", href: "/complaints/inbox" },
    { label: "الموزع الذكي", href: "/complaints/distributor" },
  ],
  "/reports": [
    { label: "تقرير البلاغات", href: "/reports/complaints" },
    { label: "تقرير الأداء", href: "/reports/performance" },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 h-screen bg-[#1A0F09] text-white flex flex-col fixed right-0 top-0 z-40">
      {/* الهيدر */}
      <div className="p-6 border-b border-white/10 flex-shrink-0">
        <h1 className="text-xl font-black text-[#C9A227]">آيلا للصيانة</h1>
        <p className="text-[10px] text-white/50 mt-1">{user.name}</p>
        <p className="text-[10px] text-[#C9A227]/70 capitalize">{user.role.replace(/_/g, " ")}</p>
      </div>

      {/* القائمة مع scrollbar مخصص */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#C9A227]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#C9A227]/50">
        {visibleItems.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
          const hasSubmenu = SUBMENU_ITEMS[item.href];
          const isSubOpen = openMenus[item.href];
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <div key={item.href}>
              {/* الرابط الرئيسي أو زر التبديل */}
              {hasSubmenu ? (
                <button
                  onClick={() => toggleMenu(item.href)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? "bg-[#C9A227] text-[#1A0F09]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {isSubOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? "bg-[#C9A227] text-[#1A0F09]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )}

              {/* القائمة الفرعية */}
              {hasSubmenu && isSubOpen && (
                <div className="mr-4 mt-1 space-y-1 border-r-2 border-[#C9A227]/20 pr-3">
                  {SUBMENU_ITEMS[item.href].map((sub) => {
                    const subActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block px-4 py-2 rounded-lg text-xs font-bold transition ${
                          subActive
                            ? "bg-[#C9A227]/20 text-[#C9A227]"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* تسجيل الخروج */}
      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition w-full"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>

      {/* CSS مخصص للـ scrollbar */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(201, 162, 39, 0.3);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(201, 162, 39, 0.5);
        }
      `}</style>
    </aside>
  );
}