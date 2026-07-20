"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Building2, MapPin, Users, Wrench, Download, Upload, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function SchoolsPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const schools = [
    { name: "مدرسة النور", location: "حي الروضة", students: 1200, projects: 5 },
    { name: "مدرسة الفجر", location: "حي الصفا", students: 800, projects: 3 },
    { name: "مدرسة الروضة", location: "حي النزهة", students: 1500, projects: 7 },
    { name: "مدرسة الأمل", location: "حي الورود", students: 950, projects: 2 },
  ];

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "المدرسة,الموقع,الطلاب,المشاريع\n" +
      schools.map(s => `${s.name},${s.location},${s.students},${s.projects}`).join("\n")
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "المدارس_2026.csv";
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
      alert(`✅ تم استيراد: ${file.name}\nالحجم: ${(file.size / 1024).toFixed(2)} KB\nسيتم إضافة المدارس...`);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="المدارس" subtitle="إدارة المدارس والمواقع" />
        <div className="flex gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" /> استيراد
          </button>
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
          <Link href="/schools/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Plus className="w-4 h-4" /> مدرسة جديدة
          </Link>
        </div>
      </div>

      <input type="file" ref={fileInputRef} accept=".xlsx,.csv" className="hidden" onChange={handleFileImport} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي المدارس" value="12" icon={Building2} delay={0} />
        <StatCard title="الطلاب" value="8,500" icon={Users} delay={0.1} />
        <StatCard title="المشاريع النشطة" value="18" icon={Wrench} delay={0.2} />
        <StatCard title="المواقع" value="8" icon={MapPin} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>قائمة المدارس</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schools.map((school, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#C9A227]/15 hover:border-[#C9A227]/40 transition-all cursor-pointer"
              style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[#2C1810] mb-1" style={{ fontFamily: "Tajawal, sans-serif" }}>{school.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-[#5C3A2A] mb-2">
                    <MapPin className="w-3 h-3" /> {school.location}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C9A227]/10">
                  <Building2 className="w-5 h-5 text-[#C9A227]" />
                </div>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-[#C9A227]/10">
                <div className="text-center">
                  <div className="text-lg font-bold text-[#2C1810]">{school.students}</div>
                  <div className="text-xs text-[#5C3A2A]">طالب</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#2C1810]">{school.projects}</div>
                  <div className="text-xs text-[#5C3A2A]">مشروع</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <Card>
              <h3 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد المدارس</h3>
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