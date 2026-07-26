"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  School,
  Car,
  Users,
  DollarSign,
  Package,
  FileText,
  ClipboardList,
  Wrench,
  Settings,
  Bell,
  ChevronLeft,
  ChevronDown,
  Bot,
  Inbox,
  History,
} from "lucide-react";

const mainLinks = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/projects", label: "المشاريع", icon: Briefcase },
  { href: "/schools", label: "المدارس", icon: School },
  { href: "/vehicles", label: "السيارات", icon: Car },
  { href: "/employees", label: "القوى العاملة", icon: Users },
  { href: "/finance", label: "المالية", icon: DollarSign },
  { href: "/inventory", label: "المخازن", icon: Package },
];

const reportLinks = [
  { href: "/reports", label: "التقارير", icon: FileText },
  { href: "/reports/inbox", label: "البلاغات الواردة", icon: Inbox },
  { href: "/reports/auto-dispatch", label: "التوزيع الذكي", icon: Bot },
  { href: "/reports/history", label: "سجل البلاغات", icon: History },
];

const bottomLinks = [
  { href: "/technicians", label: "الفنيين", icon: Wrench },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [notifCount, setNotifCount] = useState(0);
  const [reportsOpen, setReportsOpen] = useState(pathname?.startsWith("/reports"));

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("whatsapp_reports") || "[]");
    const newCount = reports.filter((r: any) => r.status === "NEW").length;
    setNotifCount(newCount);
  }, []);

  if (pathname?.startsWith("/technician-app")) return null;

  const NavLink = ({
    href,
    label,
    icon: Icon,
    badge,
    isSub,
  }: {
    href: string;
    label: string;
    icon: any;
    badge?: number;
    isSub?: boolean;
  }) => {
    const active =
      pathname === href || (href !== "/" && pathname?.startsWith(href));
    return (
      <Link
        href={href}
        className={`group flex items-center gap-3 rounded-xl transition-all duration-200 ${
          isSub ? "mr-2 pr-3 py-2 text-xs" : "px-4 py-3 text-sm"
        } ${
          active
            ? "bg-[#C9A227]/15 text-[#C9A227] font-bold shadow-sm shadow-[#C9A227]/5"
            : "text-[#C9A227]/50 hover:bg-[#C9A227]/5 hover:text-[#C9A227] font-medium"
        }`}
      >
        <Icon
          className={`shrink-0 transition-transform group-hover:scale-110 ${
            isSub ? "w-4 h-4" : "w-5 h-5"
          }`}
        />
        <span className="flex-1">{label}</span>
        {badge ? (
          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {badge}
          </span>
        ) : null}
        {active && !isSub && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-screen w-64 bg-[#1A0F09] border-l border-[#C9A227]/10 z-50 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-[#C9A227]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center shadow-lg shadow-[#C9A227]/20">
              <Wrench className="w-5 h-5 text-[#1A0F09]" />
            </div>
            <div>
              <h1 className="font-bold text-[#C9A227] text-lg leading-tight">
                آيلا
              </h1>
              <p className="text-[10px] text-[#C9A227]/40">للصيانة</p>
            </div>
          </div>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {mainLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          {/* Reports Section */}
          <div className="pt-2">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                pathname?.startsWith("/reports")
                  ? "text-[#C9A227]"
                  : "text-[#C9A227]/50 hover:text-[#C9A227]"
              }`}
            >
              <ClipboardList className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-right">البلاغات</span>
              {notifCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {notifCount}
                </span>
              )}
              {reportsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {reportsOpen && (
              <div className="mr-2 mt-1 space-y-1 border-r-2 border-[#C9A227]/10 pr-2">
                {reportLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    {...link}
                    isSub
                    badge={
                      link.href === "/reports/inbox" ? notifCount : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#C9A227]/5 mt-2">
            {bottomLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>
        </nav>

        {/* Bottom Alert */}
        <div className="p-3 border-t border-[#C9A227]/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#C9A227]/5 border border-[#C9A227]/10 text-[#C9A227] hover:bg-[#C9A227]/10 transition active:scale-95">
            <Bell className="w-5 h-5 shrink-0" />
            <span className="text-sm font-bold flex-1 text-right">
              التنبيهات
            </span>
            {notifCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className="hidden lg:block w-64 shrink-0" />
    </>
  );
}