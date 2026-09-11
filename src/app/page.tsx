"use client";

import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, TrendingUp, AlertTriangle, CheckCircle2,
  Clock, Wrench, Users, Building2, Zap, ArrowUpRight,
  CalendarDays, Bell,
} from "lucide-react";

const stats = [
  { label: "إجمالي البلاغات", value: "128", change: "+12%", trend: "up", icon: LayoutDashboard, color: "from-amber-400 to-yellow-600" },
  { label: "المنجزة", value: "96", change: "+8%", trend: "up", icon: CheckCircle2, color: "from-emerald-400 to-green-600" },
  { label: "قيد العمل", value: "24", change: "-3%", trend: "down", icon: Clock, color: "from-blue-400 to-blue-600" },
  { label: "متأخرة", value: "8", change: "+2%", trend: "up", icon: AlertTriangle, color: "from-red-400 to-red-600" },
];

const quickActions = [
  { label: "بلاغ جديد", icon: Zap, href: "/complaints/inbox", color: "bg-[#C9A227] text-[#1A0F09]" },
  { label: "الجدولة", icon: CalendarDays, href: "/schedule", color: "bg-[#1A0F09] text-[#C9A227]" },
  { label: "الفرق", icon: Users, href: "/teams", color: "bg-white border-2 border-[#C9A227]/20 text-[#1A0F09]" },
  { label: "المخزن", icon: Building2, href: "/inventory", color: "bg-white border-2 border-[#C9A227]/20 text-[#1A0F09]" },
];

const recentActivity = [
  { id: 1, title: "بلاغ صيانة كهرباء", school: "مدرسة النور", time: "منذ 5 دقائق", status: "جديد", statusColor: "bg-amber-100 text-amber-700" },
  { id: 2, title: "تم إغلاق بلاغ سباكة", school: "مجمع الأمل", time: "منذ 30 دقيقة", status: "تم", statusColor: "bg-emerald-100 text-emerald-700" },
  { id: 3, title: "فريق التكييف مشغول", school: "مدرسة المستقبل", time: "منذ ساعة", status: "تنبيه", statusColor: "bg-red-100 text-red-700" },
  { id: 4, title: "بلاغ نظافة دوري", school: "مجمع العلوم", time: "منذ ساعتين", status: "مجدول", statusColor: "bg-blue-100 text-blue-700" },
];

export default function DashboardPage() {
  const { tenant, user } = useAuth();

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-[#1A0F09]">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-1">نظرة عامة على أداء النظام — {tenant?.nameAr}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Bell className="w-4 h-4 text-[#C9A227]" />
            <span className="text-xs font-bold text-[#1A0F09]">4 تنبيهات</span>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-[#C9A227] to-[#b89420] text-[#1A0F09] rounded-xl text-xs font-bold shadow-lg shadow-[#C9A227]/20">
            {user?.role === "system_admin" ? "مدير النظام" : user?.role === "company_manager" ? "مدير الشركة" : user?.role}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#C9A227]/5 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${s.color}`} />
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${s.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                  {s.change}
                  <ArrowUpRight className={`w-3 h-3 ${s.trend === "down" ? "rotate-90" : ""}`} />
                </span>
              </div>
              <p className="text-3xl font-black text-[#1A0F09] mb-1">{s.value}</p>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-5">
          <h2 className="text-lg font-black text-[#1A0F09] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#C9A227]" /> إجراءات سريعة
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl ${action.color} hover:scale-[1.02] hover:shadow-lg transition-all duration-300 border border-transparent`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-bold">{action.label}</span>
                </a>
              );
            })}
          </div>

          {/* Mini Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1A0F09] mb-4">أداء الشهر</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {[45, 72, 58, 89, 65, 95, 78, 82, 60, 88, 75, 92].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: `${h}%` }}>
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#C9A227] to-[#e8c96a] rounded-t-lg transition-all duration-700 group-hover:from-[#b89420] group-hover:to-[#C9A227]" 
                      style={{ height: "100%" }} 
                    />
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#1A0F09] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#C9A227]" /> النشاط الأخير
            </h2>
            <a href="/complaints/inbox" className="text-xs font-bold text-[#C9A227] hover:text-[#b89420] transition">عرض الكل</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((item) => (
              <div key={item.id} className="p-5 flex items-center gap-4 hover:bg-[#FAF7F2]/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#1A0F09] truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{item.school} • {item.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#1A0F09] to-[#2C1810] rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-3xl" />
          <div className="relative">
            <h3 className="text-lg font-black text-[#C9A227] mb-2">الموزع الذكي</h3>
            <p className="text-white/60 text-sm mb-4">توزيع تلقائي للبلاغات على الفرق المتاحة بناءً على التخصص والموقع</p>
            <a href="/complaints/distributor" className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A227] text-[#1A0F09] rounded-xl text-xs font-bold hover:bg-[#e8c96a] transition">
              فتح الموزع <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-black text-[#1A0F09] mb-4">حالة الفرق</h3>
          <div className="space-y-3">
            {[
              { name: "فريق الصيانة أ", status: "متاح", load: 40, color: "bg-emerald-500" },
              { name: "فريق التكييف", status: "مشغول", load: 85, color: "bg-amber-500" },
              { name: "فريق الطوارئ", status: "متاح", load: 20, color: "bg-emerald-500" },
            ].map((team) => (
              <div key={team.name} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#1A0F09]">{team.name}</span>
                    <span className="text-[10px] font-bold text-gray-500">{team.status}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${team.color} rounded-full transition-all duration-1000`} style={{ width: `${team.load}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}