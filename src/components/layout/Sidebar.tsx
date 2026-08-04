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

const SUBMENU: Record<string, { label: string; href: string }[]> = {
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
  const [open, setOpen] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const toggle = (href: string) => setOpen((p) => ({ ...p, [href]: !p[href] }));

  const items = NAV_ITEMS.filter((i) => i.roles.includes(user.role));

  return (
    <aside className="w-64 h-screen bg-[#1A0F09] text-white flex flex-col fixed right-0 top-0 z-40">
      {/* الهيدر */}
      <div className="p-6 border-b border-white/10 shrink-0">
        <h1 className="text-xl font-black text-[#C9A227]">آيلا للصيانة</h1>
        <p className="text-[10px] text-white/50 mt-1">{user.name}</p>
        <p className="text-[10px] text-[#C9A227]/70">{user.role.replace(/_/g, " ")}</p>
      </div>

      {/* القائمة */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto sidebar-scroll">
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
          const sub = SUBMENU[item.href];
          const isOpen = open[item.href];
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <div key={item.href}>
              {sub ? (
                <button
                  onClick={() => toggle(item.href)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? "bg-[#C9A227] text-[#1A0F09]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {isOpen ? (
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

              {/* فرعي */}
              {sub && isOpen && (
                <div className="mr-4 mt-1 space-y-1 border-r-2 border-[#C9A227]/20 pr-3">
                  {sub.map((s) => {
                    const active = pathname === s.href;
                    return (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`block px-4 py-2 rounded-lg text-xs font-bold transition ${
                          active
                            ? "bg-[#C9A227]/20 text-[#C9A227]"
                            : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {s.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* خروج */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition w-full"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}