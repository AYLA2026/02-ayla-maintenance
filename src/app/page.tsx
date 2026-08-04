"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench, Package, Car, Users, HardHat, ClipboardList,
  TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowLeft,
  Wallet, FolderKanban, Zap, Calendar, Building2, Star,
  Activity, BarChart3
} from "lucide-react";

export default function DashboardPage() {
  const { user, tenant } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted)
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const stats = [
    { label: "بلاغات عالية الأولوية", value: 3, icon: AlertTriangle, color: "bg-red-500", light: "bg-red-50", trend: "+12%" },
    { label: "بلاغات مغلقة هذا الشهر", value: 48, icon: CheckCircle, color: "bg-emerald-500", light: "bg-emerald-50", trend: "+8%" },
    { label: "قيد العمل الآن", value: 5, icon: Clock, color: "bg-blue-500", light: "bg-blue-50", trend: "-2%" },
    { label: "إجمالي البلاغات", value: 65, icon: ClipboardList, color: "bg-purple-500", light: "bg-purple-50", trend: "+15%" },
  ];

  const modules = [
    { href: "/complaints/inbox", label: "البلاغات الذكية", icon: ClipboardList, desc: "إدارة وتوزيع البلاغات", grad: "from-[#C9A227] to-[#e8c855]", badge: "3 جديد" },
    { href: "/schedule", label: "الجدولة الدورية", icon: Calendar, desc: "توزيع المدارس شهرياً", grad: "from-[#1A0F09] to-[#3d2317]", badge: "أغسطس" },
    { href: "/inventory", label: "المخازن", icon: Package, desc: "4 مخازن رئيسية", grad: "from-[#1A0F09] to-[#3d2317]", badge: "245 صنف" },
    { href: "/finance", label: "المالية", icon: Wallet, desc: "الميزانيات والمصروفات", grad: "from-emerald-500 to-teal-500", badge: "+12K" },
    { href: "/projects", label: "المشاريع", icon: FolderKanban, desc: "مشاريع الصيانة الكبرى", grad: "from-blue-500 to-cyan-500", badge: "4 نشط" },
    { href: "/schools", label: "المباني", icon: Building2, desc: "30 مبنى ومدرسة", grad: "from-[#C9A227] to-[#e8c855]", badge: "30 موقع" },
    { href: "/teams", label: "الفرق", icon: Users, desc: "فرق العمل الميدانية", grad: "from-[#1A0F09] to-[#3d2317]", badge: "5 فرق" },
    { href: "/vehicles", label: "السيارات", icon: Car, desc: "إدارة المركبات", grad: "from-[#C9A227] to-[#e8c855]", badge: "4 مركبات" },
    { href: "/employees", label: "الفنيين", icon: HardHat, desc: "الموظفين والفنيين", grad: "from-[#1A0F09] to-[#3d2317]", badge: "18 فني" },
    { href: "/reports/ppt", label: "التقارير المصورة", icon: BarChart3, desc: "تقارير ذكية مع صور", grad: "from-purple-500 to-pink-500", badge: "PDF" },
  ];

  const recentActivity = [
    { title: "تم إغلاق بلاغ تسرب المياه", team: "فريق الصيانة ب", time: "منذ 10 دقائق", status: "تم" },
    { title: "تم توزيع بلاغ جديد - عطل تكييف", team: "فريق الطوارئ", time: "منذ 25 دقيقة", status: "جديد" },
    { title: "صيانة دورية - مولد كهرباء", team: "فريق الصيانة أ", time: "منذ ساعة", status: "قيد العمل" },
    { title: "تم استلام بلاغ من واتساب", team: "الموزع الذكي", time: "منذ ساعتين", status: "جديد" },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* الهيدر الذكي */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#C9A227]" />
            <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded-full">لوحة التحكم الذكية</span>
            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: tenant?.color || "#C9A227" }}>{tenant?.nameAr}</span>
          </div>
          <h1 className="text-3xl font-black text-[#1A0F09]">نظرة عامة</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            {currentTime.toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-600">النظام يعمل بكفاءة</span>
          </div>
          <Link href="/complaints/inbox" className="flex items-center gap-2 px-5 py-3 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm hover:bg-[#b89420] transition shadow-lg shadow-[#C9A227]/20">
            + بلاغ جديد
          </Link>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.light} rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${s.color}`} />
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.trend.startsWith("+") ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                  {s.trend}
                </span>
              </div>
              <p className="text-3xl font-black text-[#1A0F09]">{s.value}</p>
              <p className="text-sm font-bold text-gray-700 mt-1">{s.label}</p>
              <div className="mt-3 h-2 w-full bg-white rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${Math.min((s.value / 80) * 100, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* الوحدات + النشاط الأخير */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الوحدات */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-[#1A0F09] mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#C9A227]" />
            الوحدات
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.href} href={m.href} className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${m.grad} opacity-10 rounded-bl-full`} />
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.grad} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold">{m.badge}</span>
                  </div>
                  <h3 className="text-base font-black text-[#1A0F09] mb-1">{m.label}</h3>
                  <p className="text-xs text-gray-500 mb-4">{m.desc}</p>
                  <div className="flex items-center gap-2 text-[#C9A227] text-xs font-bold">
                    <span>دخول</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* النشاط الأخير */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1A0F09] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[#C9A227]" />
            النشاط الأخير
          </h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAF7F2] transition">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  item.status === "تم" ? "bg-emerald-500" : item.status === "جديد" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                <div>
                  <p className="text-sm font-bold text-[#1A0F09]">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.team} • {item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/complaints/history" className="block text-center text-xs font-bold text-[#C9A227] mt-4 hover:underline">
            عرض كل النشاطات
          </Link>
        </div>
      </div>
    </div>
  );
}