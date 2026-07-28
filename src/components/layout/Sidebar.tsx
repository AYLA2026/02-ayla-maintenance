"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, School, Car, Users, DollarSign, Package,
  FileText, ClipboardList, Wrench, Settings, Bell,
  ChevronLeft, ChevronDown, Sparkles, Wind, Camera, CheckCircle,
  Inbox, Bot, History, Shield, Calendar, Menu, X, LogOut, Building2, ShieldCheck
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { hasPermission, getAllowedLinks, getComplaintLinks, ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, tenant, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(pathname?.startsWith("/reports"));
  const [complaintsOpen, setComplaintsOpen] = useState(pathname?.startsWith("/complaints"));

  if (!user) return null;
  if (pathname?.startsWith("/auth") || pathname?.startsWith("/technician-app")) return null;

  const role = user.role;
  const mainLinks = getAllowedLinks(role);
  const complaintLinks = getComplaintLinks(role);

  const reportLinks = [
    { href: "/reports", label: "التقارير الرئيسية", icon: FileText },
    { href: "/reports/cleaning", label: "تقرير النظافة", icon: Sparkles },
    { href: "/reports/maintenance", label: "تقرير الصيانة", icon: Wrench },
    { href: "/reports/hvac", label: "تقرير التكييف", icon: Wind },
    { href: "/reports/ppt", label: "التقرير المصور PPT", icon: Camera },
    { href: "/reports/closed-complaints", label: "بلاغات مغلقة", icon: CheckCircle },
  ].filter((r) => hasPermission(role, "reports"));

  const bottomLinks = [
    ...(hasPermission(role, "technicians") ? [{ href: "/technicians", label: "الفنيين", icon: Wrench }] : []),
    ...(hasPermission(role, "settings") ? [{ href: "/settings", label: "الإعدادات", icon: Settings }] : []),
    ...(hasPermission(role, "tenants") ? [{ href: "/admin/tenants", label: "إدارة الشركات", icon: Building2 }] : []),
  ];

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
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 right-4 z-[60] lg:hidden p-2.5 rounded-xl bg-[#1A0F09] border border-[#C9A227]/20 text-[#C9A227] shadow-lg">
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      <aside className={`fixed top-0 right-0 h-screen w-64 bg-[#1A0F09] border-l border-[#C9A227]/10 z-50 flex flex-col overflow-hidden transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        {/* الهيدر */}
        <div className="p-5 border-b border-[#C9A227]/10 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center shadow-lg shadow-[#C9A227]/20">
              <Wrench className="w-5 h-5 text-[#1A0F09]" />
            </div>
            <div>
              <h1 className="font-bold text-[#C9A227] text-lg leading-tight">آيلا</h1>
              <p className="text-[10px] text-[#C9A227]/40">للصيانة</p>
            </div>
          </div>

          {/* الشركة + الدور */}
          {tenant && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tenant.color || "#C9A227" }} />
              <span className="text-[10px] text-[#C9A227]/60 truncate">{tenant.name}</span>
            </div>
          )}
          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold ${ROLE_COLORS[role]}`}>
            <ShieldCheck className="w-3 h-3" /> {ROLE_LABELS[role]}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0">
          {mainLinks.map((link) => {
            const iconMap: any = {
              LayoutDashboard, Briefcase, School, Car, Users, DollarSign, Package, Shield, Calendar,
            };
            return <NavLink key={link.href} href={link.href} label={link.label} icon={iconMap[link.icon] || LayoutDashboard} onClick={() => setIsOpen(false)} />;
          })}

          {/* البلاغات */}
          {complaintLinks.length > 0 && (
            <div className="pt-2 border-t border-[#C9A227]/5 mt-2">
              <button onClick={() => setComplaintsOpen(!complaintsOpen)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${pathname?.startsWith("/complaints") ? "text-[#C9A227]" : "text-[#C9A227]/50 hover:text-[#C9A227]"}`}>
                <ClipboardList className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-right">البلاغات</span>
                {complaintsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              {complaintsOpen && (
                <div className="mr-2 mt-1 space-y-1 border-r-2 border-[#C9A227]/10 pr-2">
                  {complaintLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} icon={link.href.includes("inbox") ? Inbox : link.href.includes("auto") ? Bot : History} isSub onClick={() => setIsOpen(false)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* التقارير */}
          {hasPermission(role, "reports") && (
            <div className="pt-2 border-t border-[#C9A227]/5 mt-2">
              <button onClick={() => setReportsOpen(!reportsOpen)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${pathname?.startsWith("/reports") ? "text-[#C9A227]" : "text-[#C9A227]/50 hover:text-[#C9A227]"}`}>
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
          )}

          {/* الأسفل */}
          {bottomLinks.length > 0 && (
            <div className="pt-2 border-t border-[#C9A227]/5 mt-2">
              {bottomLinks.map((link) => (
                <NavLink key={link.href} {...link} onClick={() => setIsOpen(false)} />
              ))}
            </div>
          )}

          {/* تسجيل الخروج */}
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition mt-2">
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-right">تسجيل الخروج</span>
          </button>
        </nav>
      </aside>

      <div className="hidden lg:block w-64 shrink-0" />
    </>
  );
}