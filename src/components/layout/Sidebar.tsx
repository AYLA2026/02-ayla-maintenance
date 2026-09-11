"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { NAV_ITEMS } from "@/lib/permissions";
import {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3, LogOut,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3,
};

const SUBMENU: Record<string, { label: string; href: string }[]> = {
  "/complaints": [
    { label: "الموزع الذكي", href: "/complaints/distributor" },
    { label: "سجل البلاغات", href: "/complaints/inbox" },
    { label: "تاريخ البلاغات", href: "/complaints/history" },
  ],
  "/reports": [
    { label: "التقرير الذكي", href: "/reports/smart" },
    { label: "تقرير النظافة", href: "/reports/cleaning" },
    { label: "تقرير الصيانة", href: "/reports/maintenance" },
    { label: "تقرير التكييف", href: "/reports/ac" },
    { label: "تقرير الإغلاق", href: "/reports/closure" },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const toggleMenu = (href: string) => {
    if (collapsed) return;
    setOpenMenus((p) => ({ ...p, [href]: !p[href] }));
  };

  const items = NAV_ITEMS.filter((i) => i.roles.includes(user.role));

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-screen z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        {/* Glass background */}
        <div className="absolute inset-0 bg-[#1A0F09]/95 backdrop-blur-xl border-l border-[#C9A227]/10" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-4 h-16 border-b border-[#C9A227]/10 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#8B6914] flex items-center justify-center shrink-0">
                <span className="text-[#1A0F09] font-black text-xs">آ</span>
              </div>
              <div className="whitespace-nowrap">
                <h1 className="text-sm font-black text-[#C9A227] tracking-wide">آيلا للصيانة</h1>
                <p className="text-[10px] text-[#C9A227]/60 font-medium">{user.name}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#C9A227]/70 hover:text-[#C9A227] transition-all duration-300 ${collapsed ? "mx-auto" : ""}`}
            title={collapsed ? "توسيع" : "طي"}
          >
            {collapsed ? <ChevronLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1 custom-scrollbar">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-[#C9A227] to-[#b89420] text-[#1A0F09] shadow-lg shadow-[#C9A227]/20"
                        : "text-[#C9A227]/70 hover:bg-[#C9A227]/5 hover:text-[#C9A227]"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1 text-right">{item.label}</span>
                        <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "-rotate-90" : ""}`} />
                      </>
                    )}
                    
                    {/* Tooltip on collapse */}
                    {collapsed && (
                      <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#1A0F09] border border-[#C9A227]/20 rounded-lg text-xs font-bold text-[#C9A227] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                        {item.label}
                        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1A0F09] border-r border-t border-[#C9A227]/20 rotate-45" />
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-[#C9A227] to-[#b89420] text-[#1A0F09] shadow-lg shadow-[#C9A227]/20"
                        : "text-[#C9A227]/70 hover:bg-[#C9A227]/5 hover:text-[#C9A227]"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && <span className="truncate flex-1 text-right">{item.label}</span>}
                    
                    {/* Tooltip */}
                    {collapsed && (
                      <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#1A0F09] border border-[#C9A227]/20 rounded-lg text-xs font-bold text-[#C9A227] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                        {item.label}
                        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1A0F09] border-r border-t border-[#C9A227]/20 rotate-45" />
                      </div>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {!collapsed && sub && isOpen && (
                  <div className="mr-2 mt-1 space-y-0.5 border-r-2 border-[#C9A227]/20 pr-3 animate-in slide-in-from-top-1 duration-200">
                    {sub.map((s) => {
                      const active = pathname === s.href;
                      return (
                        <Link
                          key={s.href}
                          href={s.href}
                          className={`block px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                            active
                              ? "bg-[#C9A227]/10 text-[#C9A227] border-r-2 border-[#C9A227]"
                              : "text-white/40 hover:text-[#C9A227] hover:bg-white/5"
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

        {/* Footer */}
        <div className="relative shrink-0 p-2 border-t border-[#C9A227]/10">
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 w-full group relative ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!collapsed && <span>تسجيل الخروج</span>}
            {collapsed && (
              <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#1A0F09] border border-red-500/20 rounded-lg text-xs font-bold text-red-400 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl">
                تسجيل الخروج
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1A0F09] border-r border-t border-red-500/20 rotate-45" />
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile (optional) */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}