"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Briefcase, School, Car, Users, DollarSign, Package,
  FileText, ClipboardList, Wrench, Settings, Bell,
  ChevronLeft, ChevronDown, Sparkles, Wind, Camera, CheckCircle,
  Inbox, Bot, History,
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
  { href: "/reports", label: "التقارير الرئيسية", icon: FileText },
  { href: "/reports/cleaning", label: "تقرير النظافة", icon: Sparkles },
  { href: "/reports/maintenance", label: "تقرير الصيانة", icon: Wrench },
  { href: "/reports/hvac", label: "تقرير التكييف", icon: Wind },
  { href: "/reports/ppt", label: "التقرير المصور PPT", icon: Camera },
  { href: "/reports/closed-complaints", label: "بلاغات مغلقة", icon: CheckCircle },
];

const complaintLinks = [
  { href: "/complaints/inbox", label: "البلاغات الواردة", icon: Inbox },
  { href: "/complaints/auto-dispatch", label: "التوزيع الذكي", icon: Bot },
  { href: "/complaints/history", label: "سجل البلاغات", icon: History },
];

const bottomLinks = [
  { href: "/technicians", label: "الفنيين", icon: Wrench },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(pathname?.startsWith("/reports"));
  const [complaintsOpen, setComplaintsOpen] = useState(pathname?.startsWith("/complaints"));

  useEffect(() => setIsOpen(false), [pathname]);

  if (pathname?.startsWith("/auth") || pathname?.startsWith("/technician-app")) return null;

  const NavLink = ({ href, label, icon: Icon, isSub, onClick }: any) => {
    const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`group flex items-center gap-3 rounded-xl transition-all duration-200 ${
          isSub ? "mr-3 pr-3 py-2 text-xs" : "px-4 py-3 text-sm"
        } ${
          active
            ? "bg-[#C9A227]/15 text-[#C9A227] font-bold shadow-sm shadow-[#C9A227]/5"
            : "text-[#C9A227]/50 hover:bg-[#C9A227]/5 hover:text-[#C9A227] font-medium"
        }`}
      >
        <Icon className={`shrink-0 transition-transform group-hover:scale-110 ${isSub ? "w-4 h-4" : "w-5 h-5"}`} />
        <span className="flex-1">{label}</span>
        {active && !isSub && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />}
      </Link>
    );
  };

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 right-0 left-0 h-16 bg-[#1A0F09] border-b border-[#C9A227]/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-[#C9A227]/10 transition active:scale-95"
            aria-label="القائمة"
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-[#C9A227] rounded-full" />
              <div className="w-6 h-0.5 bg-[#C9A227] rounded-full" />
              <div className="w-6 h-0.5 bg-[#C9A227] rounded-full" />
            </div>
          </button>
          {/* Bell */}
          <button className="p-2 rounded-lg hover:bg-[#C9A227]/10 transition relative">
            <Bell className="w-5 h-5 text-[#C9A227]" />
            <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#C9A227] flex items-center justify-center shadow-lg shadow-[#C9A227]/20">
            <Wrench className="w-4 h-4 text-[#1A0F09]" />
          </div>
          <div>
            <h1 className="font-bold text-[#C9A227] text-sm leading-tight">آيلا</h1>
            <p className="text-[8px] text-[#C9A227]/40">للصيانة</p>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-16 right-0 bottom-0 w-64 bg-[#1A0F09] border-l border-[#C9A227]/10 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col overflow-hidden`}
      >
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
          {mainLinks.map((link) => (
            <NavLink key={link.href} {...link} onClick={() => setIsOpen(false)} />
          ))}

          {/* التقارير */}
          <div className="pt-2">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                pathname?.startsWith("/reports") ? "text-[#C9A227]" : "text-[#C9A227]/50 hover:text-[#C9A227]"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-right">التقارير</span>
              {reportsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {reportsOpen && (
              <div className="mr-2 mt-1 space-y-1 border-r-2 border-[#C9A227]/10 pr-2">
                {reportLinks.map((link) => (
                  <NavLink key={link.href} {...link} isSub onClick={() => setIsOpen(false)} />
                ))}
              </div>
            )}
          </div>

          {/* البلاغات */}
          <div className="pt-2 border-t border-[#C9A227]/5">
            <button
              onClick={() => setComplaintsOpen(!complaintsOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                pathname?.startsWith("/complaints") ? "text-[#C9A227]" : "text-[#C9A227]/50 hover:text-[#C9A227]"
              }`}
            >
              <ClipboardList className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-right">البلاغات</span>
              {complaintsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {complaintsOpen && (
              <div className="mr-2 mt-1 space-y-1 border-r-2 border-[#C9A227]/10 pr-2">
                {complaintLinks.map((link) => (
                  <NavLink key={link.href} {...link} isSub onClick={() => setIsOpen(false)} />
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#C9A227]/5 mt-2">
            {bottomLinks.map((link) => (
              <NavLink key={link.href} {...link} onClick={() => setIsOpen(false)} />
            ))}
          </div>
        </nav>
      </aside>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}