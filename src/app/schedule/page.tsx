"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Download, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState("15 - 21 يوليو 2026");

  const schedule = [
    { day: "الأحد", date: "15 يوليو", tasks: [
      { time: "08:00", title: "صيانة مكيفات", location: "مدرسة النور", team: "أحمد محمد", status: "مكتمل" },
      { time: "10:30", title: "تنظيف مباني", location: "مدرسة الفجر", team: "خالد عبدالله", status: "جاري" },
    ]},
    { day: "الاثنين", date: "16 يوليو", tasks: [
      { time: "09:00", title: "فحص كهرباء", location: "مدرسة الروضة", team: "سعد إبراهيم", status: "قادم" },
    ]},
    { day: "الثلاثاء", date: "17 يوليو", tasks: [
      { time: "08:00", title: "صيانة عامة", location: "مدرسة الأمل", team: "ناصر علي", status: "قادم" },
      { time: "13:00", title: "تنظيف حمامات", location: "مدرسة النور", team: "فريق التنظيف", status: "قادم" },
    ]},
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="الجدولة" subtitle="جدولة المهام والفريق" />
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" />
            استيراد
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <Link
            href="/schedule/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
          >
            <Plus className="w-4 h-4" />
            مهمة جديدة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="مهام الأسبوع" value="24" icon={Calendar} delay={0} />
        <StatCard title="مكتملة" value="18" icon={CheckCircle} delay={0.1} />
        <StatCard title="جارية" value="4" icon={Clock} delay={0.2} />
        <StatCard title="متأخرة" value="2" icon={AlertCircle} delay={0.3} />
      </div>

      {/* التنقل بين الأسابيع */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-[#5C3A2A] hover:bg-[#C9A227]/10 transition-colors">
          <ChevronRight className="w-4 h-4" />
          الأسبوع السابق
        </button>
        <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{currentWeek}</h2>
        <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-[#5C3A2A] hover:bg-[#C9A227]/10 transition-colors">
          الأسبوع التالي
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* الجدول */}
      <div className="space-y-4">
        {schedule.map((day, i) => (
          <Card key={i} delay={i * 0.1}>
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#C9A227]/10">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C9A227]/10">
                <Calendar className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{day.day}</h3>
                <p className="text-xs text-[#5C3A2A]">{day.date}</p>
              </div>
            </div>
            <div className="space-y-3">
              {day.tasks.map((task, j) => (
                <div key={j} className="flex items-center gap-4 p-3 rounded-lg bg-[#C9A227]/5">
                  <div className="text-sm font-bold text-[#C9A227] w-16">{task.time}</div>
                  <div className="flex-1">
                    <div className="font-medium text-[#2C1810] text-sm">{task.title}</div>
                    <div className="text-xs text-[#5C3A2A]">{task.location} • {task.team}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === "مكتمل" ? "bg-green-100 text-green-800" :
                    task.status === "جاري" ? "bg-amber-100 text-amber-800" :
                    "bg-blue-100 text-blue-800"
                  }`}>{task.status}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}