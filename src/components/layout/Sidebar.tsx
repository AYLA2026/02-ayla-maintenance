"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Bot,
  Inbox,
  History,
} from "lucide-react";

const links = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/projects", label: "المشاريع", icon: Briefcase },
  { href: "/schools", label: "المدارس", icon: School },
  { href: "/vehicles", label: "السيارات", icon: Car },
  { href: "/employees", label: "القوى العاملة", icon: Users },
  { href: "/finance", label: "المالية", icon: DollarSign },
  { href: "/inventory", label: "المخازن", icon: Package },
  { href: "/reports", label: "التقارير", icon: FileText },
  { href: "/reports/inbox", label: "البلاغات الواردة", icon: Inbox },
  { href: "/reports/auto-dispatch", label: "التوزيع الذكي", icon: Bot },
  { href: "/reports/history", label: "سجل البلاغات", icon: History },
  { href: "/technicians", label: "الفنيين", icon: Wrench },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  // اخفِ Sidebar في تطبيق الفني
  if (pathname?.startsWith("/technician-app")) return null;

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-[#1A0F09] border-l border-[#C9A227]/10 z-40 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-[#C9A227]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center">
            <Wrench className="w-5 h-5 text-[#1A0F09]" />
          </div>
          <div>
            <h1 className="font-bold text-[#C9A227] text-lg">آيلا</h1>
            <p className="text-[10px] text-[#C9A227]/50">للصيانة</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isSub = link.href.startsWith("/reports/") && link.href !== "/reports";
          const active =
            pathname === link.href || pathname?.startsWith(link.href + "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl text-sm font-bold transition ${
                isSub ? "mr-4 pr-3 py-2.5" : "px-4 py-3"
              } ${
                active
                  ? "bg-[#C9A227]/10 text-[#C9A227]"
                  : "text-[#C9A227]/60 hover:bg-[#C9A227]/5 hover:text-[#C9A227]"
              }`}
            >
              <Icon className={`shrink-0 ${isSub ? "w-4 h-4" : "w-5 h-5"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}