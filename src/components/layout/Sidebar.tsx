"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { NAV_ITEMS } from "@/lib/permissions";
import {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3, LogOut,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Inbox, Zap, Calendar, Package,
  Building2, Users, Truck, Wrench, BarChart3,
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // إذا لم يكن هناك مستخدم، لا تظهر الشريط (لكن AppLayout يمنع هذه الحالة أصلاً)
  if (!user) return null;

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 min-h-screen bg-[#1A0F09] text-white flex flex-col fixed right-0 top-0 z-40">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-black text-[#C9A227]">آيلا للصيانة</h1>
        <p className="text-[10px] text-white/50 mt-1">{user.name}</p>
        <p className="text-[10px] text-[#C9A227]/70">{user.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
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
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
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