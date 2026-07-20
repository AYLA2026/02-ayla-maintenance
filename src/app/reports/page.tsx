"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import { 
  ClipboardList, 
  Wind, 
  Droplets, 
  Wrench, 
  Camera, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  Presentation,
  X
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ReportsPage() {
  const [showImportModal, setShowImportModal] = useState(false);

  const reports = [
    { href: "/reports/cleaning", title: "تقرير التنظيف", icon: Droplets, desc: "تقارير أعمال التنظيف والصيانة الدورية" },
    { href: "/reports/hvac", title: "تقرير التكييف", icon: Wind, desc: "تقارير صيانة وأداء أنظمة التكييف" },
    { href: "/reports/om", title: "تقرير الصيانة", icon: Wrench, desc: "تقارير الصيانة العامة والإصلاحات" },
    { href: "/reports/photo", title: "تقرير الصور", icon: Camera, desc: "تقارير مصورة للمواقع والأعمال" },
  ];

  const eduTemplates = [
    { name: "تقرير صيانة المباني", format: "Excel", icon: FileSpreadsheet },
    { name: "تقرير التكييف الشهري", format: "PowerPoint", icon: Presentation },
    { name: "تقرير التنظيف الدوري", format: "Excel", icon: FileSpreadsheet },
    { name: "تقرير البلاغات", format: "PowerPoint", icon: Presentation },
  ];

  const exportExcel = (templateName: string) => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "التقرير,التاريخ,المدرسة,الحالة\n" +
      `${templateName},2026-07-20,مدرسة النور,مكتمل\n` +
      `${templateName},2026-07-19,مدرسة الفجر,قيد التنفيذ\n`
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = `${templateName.replace(/\s+/g, "_")}_2026.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPowerPoint = (templateName: string) => {
    const htmlContent = `
      <html>
        <head><title>${templateName}</title></head>
        <body style="font-family:Tajawal,sans-serif;direction:rtl;padding:40px;">
          <h1 style="color:#2C1810;">${templateName}</h1>
          <p style="color:#5C3A2A;">تاريخ التقرير: 20 يوليو 2026</p>
          <hr style="border-color:#C9A227;">
          <h2 style="color:#2C1810;">المدرسة: مدرسة النور</h2>
          <p style="color:#5C3A2A;">الحالة: مكتمل</p>
          <p style="color:#5C3A2A;">ملاحظات: تم إنجاز جميع الأعمال المطلوبة</p>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${templateName.replace(/\s+/g, "_")}_2026.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    alert(`✅ تم اختيار الملف: ${file.name}\nالحجم: ${(file.size / 1024).toFixed(2)} KB\n\nسيتم تحليل البيانات وتعبئة التقرير تلقائياً...`);
    setShowImportModal(false);
    // إعادة تعيين الـ input للسماح باختيار نفس الملف مرة أخرى
    e.target.value = "";
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="التقارير" subtitle="إدارة وعرض التقارير" />
        <div className="flex gap-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
          >
            <Upload className="w-4 h-4" />
            استيراد نموذج
          </button>
          <button 
            onClick={() => exportExcel("تقرير_مجمع")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button 
            onClick={() => exportPowerPoint("تقرير_مجمع")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
          >
            <Presentation className="w-4 h-4" />
            PowerPoint
          </button>
        </div>
      </div>

      {/* التقارير الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {reports.map((report, i) => (
          <Link key={i} href={report.href}>
            <Card delay={i * 0.1} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
                >
                  <report.icon className="w-7 h-7 text-[#1A0F09]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810] mb-1 text-lg" style={{ fontFamily: "Tajawal, sans-serif" }}>{report.title}</h3>
                  <p className="text-sm text-[#5C3A2A]">{report.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* نماذج تقارير إدارة التعليم */}
      <h2 className="text-xl font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>
        نماذج تقارير إدارة التعليم
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {eduTemplates.map((template, i) => (
          <Card key={i} delay={i * 0.1} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C9A227]/10">
                <template.icon className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#2C1810] text-sm mb-1" style={{ fontFamily: "Tajawal, sans-serif" }}>{template.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C9A227]/10 text-[#C9A227]">{template.format}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => template.format === "Excel" ? exportExcel(template.name) : exportPowerPoint(template.name)}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-[#1A0F09] text-center"
                style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
              >
                تعبئة تلقائية
              </button>
              <button 
                onClick={() => template.format === "Excel" ? exportExcel(template.name + "_فارغ") : exportPowerPoint(template.name + "_فارغ")}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-[#5C3A2A] border border-[#C9A227]/30 text-center hover:bg-[#C9A227]/10 transition-colors"
              >
                تحميل فارغ
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* نموذج استيراد */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>
                  استيراد نموذج تقرير
                </h3>
                <button onClick={() => setShowImportModal(false)} className="text-[#5C3A2A] hover:text-[#2C1810]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-[#5C3A2A] mb-4">
                اختر ملف Excel أو PowerPoint يحتوي على نموذج تقرير إدارة التعليم
              </p>
              
              {/* label + input - الطريقة الأكثر موثوقية */}
              <label 
                htmlFor="report-file-input"
                className="block w-full border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-[#C9A227]/5 transition-colors"
              >
                <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
                <p className="text-sm text-[#5C3A2A]">اضغط هنا لاختيار الملف</p>
                <p className="text-xs text-[#C9A227]/60 mt-1">Excel, PowerPoint</p>
              </label>
              <input 
                id="report-file-input"
                type="file" 
                accept=".xlsx,.csv,.pptx,.ppt,.html" 
                className="hidden"
                onChange={handleFileSelect}
              />

              <button 
                onClick={() => setShowImportModal(false)}
                className="w-full py-2 rounded-lg text-sm font-medium text-[#5C3A2A] border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
              >
                إلغاء
              </button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}