"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Wrench,
  Building2,
  Users,
  ClipboardList,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/projects", label: "المشاريع", icon: Wrench },
  { href: "/schools", label: "المدارس", icon: Building2 },
  { href: "/workforce", label: "الفريق", icon: Users },
  { href: "/reports", label: "التقارير", icon: ClipboardList },
  { href: "/complaints", label: "البلاغات", icon: MessageSquare },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* زر الموبايل */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #C9A227 0%, #A8841F 100%)",
          boxShadow: "0 4px 15px rgba(201, 162, 39, 0.3)",
        }}
      >
        {mobileOpen ? <X className="w-5 h-5 text-[#1A0F09]" /> : <Menu className="w-5 h-5 text-[#1A0F09]" />}
      </button>

      {/* الخلفية المعتمة للموبايل */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={`fixed top-0 right-0 h-full z-40 w-72 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
        style={{
          background: "linear-gradient(180deg, #2C1810 0%, #3D2417 50%, #2C1810 100%)",
          borderLeft: "1px solid rgba(201, 162, 39, 0.15)",
        }}
      >
        {/* خط ذهبي علوي */}
        <div
          className="h-[2px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #C9A227 30%, #E8D5A3 50%, #C9A227 70%, transparent 100%)",
          }}
        />

        <div className="flex flex-col h-full p-5">
          {/* الشعار */}
          <div className="mb-8 px-2 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 50%, #C9A227 100%)",
                  boxShadow: "0 4px 15px rgba(201, 162, 39, 0.3)",
                }}
              >
                <span className="text-[#1A0F09] font-bold text-xl">أ</span>
              </div>
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 50%, #C9A227 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "Tajawal, sans-serif",
                  }}
                >
                  آيلا للصيانة
                </h1>
              </div>
            </div>
            <p className="text-[10px] text-[#C9A227]/50 tracking-wider">AYLA DIGITAL SOLUTIONS</p>
          </div>

          {/* القائمة */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    active ? "text-[#C9A227]" : "text-[#E8D5A3]/70 hover:text-[#C9A227]"
                  }`}
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)",
                          border: "1px solid rgba(201, 162, 39, 0.2)",
                        }
                      : { border: "1px solid transparent" }
                  }
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      active ? "bg-[#C9A227]/20" : "bg-[#5C3A2A]/30 group-hover:bg-[#C9A227]/10"
                    }`}
                  >
                    <item.icon
                      className={`w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 ${
                        active ? "text-[#C9A227]" : "text-[#C9A227]/60"
                      }`}
                    />
                  </div>
                  <span className="font-medium text-sm" style={{ fontFamily: "Tajawal, sans-serif" }}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute left-3 w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* فاصل */}
          <div
            className="my-4 h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.2), transparent)",
            }}
          />

          {/* تسجيل الخروج */}
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:text-red-400 transition-all duration-300 group w-full"
            style={{ border: "1px solid rgba(239, 68, 68, 0.1)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-[18px] h-[18px]" />
            </div>
            <span className="font-medium text-sm" style={{ fontFamily: "Tajawal, sans-serif" }}>
              تسجيل الخروج
            </span>
          </button>

          {/* حقوق النشر */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-[#C9A227]/30">آيلا للصيانة v2.0</p>
          </div>
        </div>

        {/* خط ذهبي سفلي */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #C9A227 30%, #E8D5A3 50%, #C9A227 70%, transparent 100%)",
          }}
        />
      </aside>

      {/* مساحة للشريط الجانبي */}
      <div className="hidden lg:block w-72 shrink-0" />
    </>
  );
}