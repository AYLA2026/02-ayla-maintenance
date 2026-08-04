"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/auth-context";
import {
  LayoutDashboard, ClipboardList, Package, Building2, Users, Car, HardHat,
  Wallet, FolderKanban, FileText, LogOut, ChevronDown, ChevronUp,
  Wrench, X, Calendar
} from "lucide-react";

const ROLE_COLORS: Record<UserRole, string> = {
  system_admin: "bg-purple-600 text-white",
  company_manager: "bg-[#C9A227] text-[#1A0F09]",
  site_engineer: "bg-blue-600 text-white",
  supervisor: "bg-emerald-600 text-white",
  technician: "bg-[#1A0F09] text-[#C9A227]",
  visitor: "bg-gray-400 text-white",
};

const ROLE_LABELS: Record<UserRole, string> = {
  system_admin: "System Admin",
  company_manager: "مدير الشركة",
  site_engineer: "مهندس موقع",
  supervisor: "مشرف صيانة",
  technician: "فني صيانة",
  visitor: "زائر",
};

export default function Sidebar() {
  const { user, logout, isAllowed } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);

  if (!user || pathname.startsWith("/auth")) return null;

  const mainLinks = [
    { href: "/", label: "لوحة التحكم", icon: LayoutDashboard, roles: ["system_admin","company_manager","site_engineer","supervisor","technician","visitor"] as UserRole[] },
    { href: "/complaints/inbox", label: "البلاغات", icon: ClipboardList, roles: ["system_admin","company_manager","site_engineer","supervisor","technician"] as UserRole[] },
    { href: "/schedule", label: "الجدولة الدورية", icon: Calendar, roles: ["system_admin","company_manager","supervisor"] as UserRole[] },
    { href: "/inventory", label: "المخازن", icon: Package, roles: ["system_admin","company_manager","supervisor","technician"] as UserRole[] },
    { href: "/finance", label: "المالية", icon: Wallet, roles: ["system_admin","company_manager"] as UserRole[] },
    { href: "/projects", label: "المشاريع", icon: FolderKanban, roles: ["system_admin","company_manager","site_engineer"] as UserRole[] },
    { href: "/schools", label: "المباني", icon: Building2, roles: ["system_admin","company_manager","site_engineer","supervisor"] as UserRole[] },
    { href: "/teams", label: "الفرق", icon: Users, roles: ["system_admin","company_manager","supervisor"] as UserRole[] },
    { href: "/vehicles", label: "السيارات", icon: Car, roles: ["system_admin","company_manager","supervisor"] as UserRole[] },
    { href: "/employees", label: "الفنيين", icon: HardHat, roles: ["system_admin","company_manager","supervisor"] as UserRole[] },
  ].filter(l => isAllowed(l.roles));

  const complaintSubLinks = [
    { href: "/complaints/inbox", label: "سجل البلاغات", icon: ClipboardList },
    { href: "/complaints/distributor", label: "الموزع الذكي", icon: Wrench },
    { href: "/complaints/history", label: "تاريخ البلاغات", icon: FileText },
  ];

  const reportLinks = [
    { href: "/reports/ppt", label: "التقرير المصور", icon: FileText },
    { href: "/reports/closed-complaints", label: "بلاغات مغلقة", icon: ClipboardList },
    { href: "/reports/cleaning", label: "تقرير النظافة", icon: FileText },
    { href: "/reports/maintenance", label: "تقرير الصيانة", icon: Wrench },
    { href: "/reports/ac", label: "تقرير التكييف", icon: FileText },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#1A0F09] text-[#C9A227] rounded-xl shadow-lg">
        {isOpen ? <X className="w-5 h-5" /> : <LayoutDashboard className="w-5 h-5" />}
      </button>

      <aside className={`fixed top-0 right-0 h-full bg-[#1A0F09] text-white transition-all duration-300 z-40 ${isOpen ? "w-64 translate-x-0" : "w-0 translate-x-full lg:w-20 lg:translate-x-0 overflow-hidden"}`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#1A0F09]" />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg truncate">آيلا للصيانة</p>
                <p className="text-[10px] text-[#C9A227] truncate">{user.tenantName}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-180px)]">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${active ? "bg-[#C9A227] text-[#1A0F09] font-bold" : "hover:bg-white/5 text-gray-300"}`}>
                <Icon className="w-5 h-5" />
                {isOpen && <span className="text-sm">{link.label}</span>}
              </Link>
            );
          })}

          {isAllowed(["system_admin","company_manager","site_engineer","supervisor"]) && (
            <>
              <button onClick={() => setShowComplaints(!showComplaints)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5" />
                  {isOpen && <span className="text-sm">البلاغات الذكية</span>}
                </div>
                {isOpen && (showComplaints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </button>
              {showComplaints && isOpen && (
                <div className="mr-8 space-y-1">
                  {complaintSubLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2 rounded-xl transition text-sm ${isActive(link.href) ? "bg-[#C9A227]/20 text-[#C9A227] font-bold" : "hover:bg-white/5 text-gray-400"}`}>
                        <Icon className="w-4 h-4" />{link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {isAllowed(["system_admin","company_manager","supervisor","visitor"]) && (
            <>
              <button onClick={() => setShowReports(!showReports)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 transition">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  {isOpen && <span className="text-sm">التقارير</span>}
                </div>
                {isOpen && (showReports ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
              </button>
              {showReports && isOpen && (
                <div className="mr-8 space-y-1">
                  {reportLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2 rounded-xl transition text-sm ${isActive(link.href) ? "bg-[#C9A227]/20 text-[#C9A227] font-bold" : "hover:bg-white/5 text-gray-400"}`}>
                        <Icon className="w-4 h-4" />{link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </nav>

        <div className="absolute bottom-0 right-0 w-full p-4 border-t border-white/10 bg-[#1A0F09]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center text-[#1A0F09] font-bold text-xs">
              {user.name?.charAt(0) || "م"}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${ROLE_COLORS[user.role]}`}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
            )}
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm font-bold">
            <LogOut className="w-4 h-4" />
            {isOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>
    </>
  );
}