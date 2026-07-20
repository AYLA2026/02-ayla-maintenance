"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, Download, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function SchedulePage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "اليوم,التاريخ,الوقت,المهمة,الموقع,الفريق,الحالة\n" +
      schedule.flatMap(d => d.tasks.map(t => `${d.day},${d.date},${t.time},${t.title},${t.location},${t.team},${t.status}`)).join("\n")
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "الجدولة_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      alert(`✅ تم استيراد: ${file.name}\nالحجم: ${(file.size / 1024).toFixed(2)} KB\nسيتم تحديث الجدولة...`);
      setShowImportModal(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input 
        type="file" 
        ref={fileInputRef}
        accept=".xlsx,.csv" 
        className="hidden" 
        onChange={handleFileImport}
      />

      <div className="flex items-center justify-between mb-8">
        <PageHeader title="الجدولة" subtitle="جدولة المهام والفريق" />
        <div className="flex gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" /> استيراد
          </button>
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
          <Link href="/schedule/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Plus className="w-4 h-4" /> مهمة جديدة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="مهام الأسبوع" value="24" icon={Calendar} delay={0} />
        <StatCard title="مكتملة" value="18" icon={CheckCircle} delay={0.1} />
        <StatCard title="جارية" value="4" icon={Clock} delay={0.2} />
        <StatCard title="متأخرة" value="2" icon={AlertCircle} delay={0.3} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-[#5C3A2A] hover:bg-[#C9A227]/10 transition-colors">
          <ChevronRight className="w-4 h-4" /> الأسبوع السابق
        </button>
        <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{currentWeek}</h2>
        <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-[#5C3A2A] hover:bg-[#C9A227]/10 transition-colors">
          الأسبوع التالي <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

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

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <Card>
              <h3 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد الجدولة</h3>
              <button
                onClick={openFilePicker}
                className="w-full border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 hover:bg-[#C9A227]/5 transition-colors"
              >
                <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
                <p className="text-sm text-[#5C3A2A]">اضغط هنا لاختيار ملف Excel</p>
              </button>
              <button onClick={() => setShowImportModal(false)}
                className="w-full py-2 rounded-lg text-sm font-medium text-[#5C3A2A] border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">إلغاء</button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}