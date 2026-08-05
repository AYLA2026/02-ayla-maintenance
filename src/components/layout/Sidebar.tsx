"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { NAV_ITEMS } from "@/lib/permissions";
import {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3, LogOut,
  ChevronDown, ChevronLeft, PanelLeft,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3,
};

const SUBMENU: Record<string, { label: string; href: string }[]> = {
  "/complaints": [
    { label: "سجل البلاغات", href: "/complaints/inbox" },
    { label: "الموزع الذكي", href: "/complaints/distributor" },
    { label: "تاريخ البلاغات", href: "/complaints/history" },
  ],
  "/reports": [
    { label: "تقرير البلاغات", href: "/reports/complaints" },
    { label: "تقرير النظافة", href: "/reports/cleaning" },
    { label: "تقرير الصيانة", href: "/reports/maintenance" },
    { label: "تقرير التكييف", href: "/reports/ac" },
    { label: "تقرير الأداء", href: "/reports/performance" },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const toggleMenu = (href: string) => {
    setOpenMenus((p) => ({ ...p, [href]: !p[href] }));
  };

  const items = NAV_ITEMS.filter((i) => i.roles.includes(user.role));

  return (
    <aside className={`bg-[#1A0F09] text-[#C9A227] flex flex-col fixed right-0 top-0 z-40 transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`} style={{ height: '100dvh' }}>
      {/* الهيدر */}
      <div className="p-4 border-b border-[#C9A227]/20 flex items-center justify-between" style={{ flexShrink: 0 }}>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-black text-[#C9A227] tracking-wide whitespace-nowrap">آيلا للصيانة</h1>
            <p className="text-[10px] text-[#C9A227]/70 mt-1 font-bold whitespace-nowrap">{user.name}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[#C9A227]/10 transition shrink-0"
          title={collapsed ? "توسيع" : "طي"}
        >
          {collapsed ? <ChevronLeft className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* القائمة */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
          const sub = SUBMENU[item.href];
          const isOpen = openMenus[item.href];
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <div key={item.href}>
              {sub ? (
                <button
                  onClick={() => toggleMenu(item.href)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#C9A227] text-[#1A0F09] shadow-lg shadow-[#C9A227]/20"
                      : "text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227]"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!collapsed && (
                    <span className="transition-transform duration-200 shrink-0">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </span>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#C9A227] text-[#1A0F09] shadow-lg shadow-[#C9A227]/20"
                      : "text-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:text-[#C9A227]"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )}

              {/* القائمة الفرعية */}
              {sub && isOpen && !collapsed && (
                <div className="mr-3 mt-2 space-y-1 border-r-2 border-[#C9A227]/30 pr-3">
                  {sub.map((s) => {
                    const active = pathname === s.href;
                    return (
                      <Link
                        key={s.href}
                        href={s.href}
                        className={`block px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                          active
                            ? "bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30"
                            : "text-white/50 hover:text-[#C9A227] hover:bg-white/5"
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
      <div className="p-3 border-t border-[#C9A227]/20" style={{ flexShrink: 0 }}>
        <button
          onClick={logout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition w-full`}
          title={collapsed ? "تسجيل الخروج" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && "تسجيل الخروج"}
        </button>
      </div>
    </aside>
  );
}