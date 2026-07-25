"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  Bot,
  Inbox,
  History,
  Users,
  Settings,
  Wrench,
} from "lucide-react";

const menu = [
  { name: "لوحة التحكم", href: "/", icon: LayoutDashboard },
  {
    name: "البلاغات",
    icon: ClipboardList,
    children: [
      { name: "البلاغات الواردة", href: "/reports/inbox", icon: Inbox },
      { name: "التوزيع الذكي", href: "/reports/auto-dispatch", icon: Bot },
      { name: "سجل البلاغات", href: "/reports/history", icon: History },
    ],
  },
  { name: "الفنيين", href: "/technicians", icon: Users },
  { name: "الإعدادات", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({
    البلاغات: pathname.startsWith("/reports"),
  });

  const toggle = (name: string) =>
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));

  // اخفي Sidebar في تطبيق الفني
  if (pathname.startsWith("/technician-app")) return null;

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
        {menu.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const isOpen = open[item.name];
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggle(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                    pathname.startsWith("/reports")
                      ? "bg-[#C9A227]/10 text-[#C9A227]"
                      : "text-[#C9A227]/60 hover:bg-[#C9A227]/5 hover:text-[#C9A227]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>

                {isOpen && (
                  <div className="mr-4 mt-1 space-y-1 border-r-2 border-[#C9A227]/20 pr-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const active = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${
                            active
                              ? "bg-[#C9A227]/15 text-[#C9A227] font-bold"
                              : "text-[#C9A227]/50 hover:text-[#C9A227] hover:bg-[#C9A227]/5"
                          }`}
                        >
                          <ChildIcon className="w-4 h-4" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${
                active
                  ? "bg-[#C9A227]/10 text-[#C9A227]"
                  : "text-[#C9A227]/60 hover:bg-[#C9A227]/5 hover:text-[#C9A227]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}