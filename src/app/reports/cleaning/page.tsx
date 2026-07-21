"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import { Droplets, Upload, FileSpreadsheet, Presentation, Printer, X } from "lucide-react";
import { useState, useRef } from "react";

export default function CleaningReportPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "البند,الكمية,الوحدة,التكلفة,ملاحظات\n" +
      "تنظيف فصول,10,فصل,1500,تم التنظيف الكامل\n" +
      "تنظيف حمامات,6,حمام,800,تم التعقيم\n" +
      "تنظيف ممرات,5,ممر,500,تم الغسيل\n" +
      "إجمالي,,,2800,"
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "تقرير_التنظيف_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPowerPoint = () => {
    const htmlContent = `
      <html dir="rtl" lang="ar">
        <head><meta charset="UTF-8"><title>تقرير التنظيف</title>
        <style>body{font-family:'Tajawal',sans-serif;padding:40px;color:#2C1810;}h1{color:#C9A227;border-bottom:3px solid #C9A227;}table{width:100%;border-collapse:collapse;margin-top:20px;}th{background:linear-gradient(135deg,#C9A227,#E8D5A3);padding:12px;}td{padding:10px;border-bottom:1px solid #F5E6D3;}.total{font-weight:bold;background:#FAF7F2;}</style></head>
        <body><h1>تقرير التنظيف الشهري</h1><p><strong>المدرسة:</strong> مدرسة النور</p><p><strong>التاريخ:</strong> 20 يوليو 2026</p>
        <table><tr><th>البند</th><th>الكمية</th><th>الوحدة</th><th>التكلفة</th><th>ملاحظات</th></tr>
        <tr><td>تنظيف فصول</td><td>10</td><td>فصل</td><td>1,500</td><td>تم التنظيف الكامل</td></tr>
        <tr><td>تنظيف حمامات</td><td>6</td><td>حمام</td><td>800</td><td>تم التعقيم</td></tr>
        <tr><td>تنظيف ممرات</td><td>5</td><td>ممر</td><td>500</td><td>تم الغسيل</td></tr>
        <tr class="total"><td colspan="3">الإجمالي</td><td>2,800</td><td></td></tr>
        </table></body></html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "تقرير_التنظيف_2026.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();
  const openFilePicker = () => fileInputRef.current?.click();
  const closeModal = () => setShowImportModal(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      alert(`✅ تم استيراد: ${file.name}\nالحجم: ${(file.size / 1024).toFixed(2)} KB`);
      setShowImportModal(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input type="file" ref={fileInputRef} accept=".xlsx,.csv,.pptx,.ppt,.html" className="hidden" onChange={handleFileImport} />

      <div className="flex items-center justify-between mb-8">
        <PageHeader title="تقرير التنظيف" subtitle="تقارير أعمال التنظيف والصيانة الدورية" />
        <div className="flex gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" /> استيراد نموذج
          </button>
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={exportPowerPoint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Presentation className="w-4 h-4" /> PowerPoint
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Printer className="w-4 h-4" /> طباعة
          </button>
        </div>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#C9A227]/20">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Droplets className="w-7 h-7 text-[#1A0F09]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>تقرير التنظيف الشهري</h2>
            <p className="text-sm text-[#5C3A2A]">يوليو 2026 • مدرسة النور</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">اسم المدرسة</label>
              <input type="text" defaultValue="مدرسة النور"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]"
                style={{ fontFamily: "Tajawal, sans-serif" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">التاريخ</label>
              <input type="date" defaultValue="2026-07-20"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C3A2A] mb-2">تفاصيل أعمال التنظيف</label>
            <textarea rows={4} defaultValue="• تنظيف الفصول الدراسية (10 فصول)
• تنظيف الممرات والحمامات
• تعقيم الأسطح والمقابض
• إزالة الأتربة من المكيفات"
              className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] resize-none"
              style={{ fontFamily: "Tajawal, sans-serif" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">عدد العمال</label>
              <input type="number" defaultValue="5"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">الساعات</label>
              <input type="number" defaultValue="8"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">التكلفة (ر.س)</label>
              <input type="number" defaultValue="2500"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]" />
            </div>
          </div>
        </div>
      </Card>

      {/* مودال الاستيراد - div عادي بدون Card component */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-md mx-4 rounded-2xl p-6 bg-white"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد نموذج تقرير التنظيف</h3>
              <button onClick={closeModal} className="text-[#5C3A2A] hover:text-[#2C1810] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-[#5C3A2A] mb-4">
              اختر ملف نموذج تقرير إدارة التعليم وسيقوم النظام بتحليله وتعبئة البيانات تلقائياً
            </p>
            
            <div
              onClick={openFilePicker}
              className="w-full border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 hover:bg-[#C9A227]/5 transition-colors cursor-pointer"
            >
              <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
              <p className="text-sm text-[#5C3A2A]">اضغط هنا لاختيار الملف</p>
              <p className="text-xs text-[#C9A227]/60 mt-1">Excel (.xlsx, .csv) • PowerPoint (.pptx)</p>
            </div>

            <button onClick={closeModal}
              className="w-full py-2 rounded-lg text-sm font-medium text-[#5C3A2A] border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}