"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import { Droplets, Upload, Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { useState } from "react";

export default function CleaningReportPage() {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExportExcel = () => {
    alert("جاري تصدير التقرير بصيغة Excel...");
  };

  const handleExportWord = () => {
    alert("جاري تصدير التقرير بصيغة Word...");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="تقرير التنظيف" subtitle="تقارير أعمال التنظيف والصيانة الدورية" />
        <div className="flex gap-2">
          <button 
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
          >
            <Upload className="w-4 h-4" />
            استيراد نموذج
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button 
            onClick={handleExportWord}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Word
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
          >
            <Printer className="w-4 h-4" />
            طباعة
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

        {/* نموذج التقرير */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">اسم المدرسة</label>
              <input 
                type="text" 
                defaultValue="مدرسة النور"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]"
                style={{ fontFamily: "Tajawal, sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">التاريخ</label>
              <input 
                type="date" 
                defaultValue="2026-07-20"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C3A2A] mb-2">تفاصيل أعمال التنظيف</label>
            <textarea 
              rows={4}
              defaultValue="• تنظيف الفصول الدراسية (10 فصول)
• تنظيف الممرات والحمامات
• تعقيم الأسطح والمقابض
• إزالة الأتربة من المكيفات"
              className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] resize-none"
              style={{ fontFamily: "Tajawal, sans-serif" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">عدد العمال</label>
              <input 
                type="number" 
                defaultValue="5"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">الساعات</label>
              <input 
                type="number" 
                defaultValue="8"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">التكلفة (ر.س)</label>
              <input 
                type="number" 
                defaultValue="2500"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5C3A2A] mb-2">ملاحظات</label>
            <textarea 
              rows={2}
              placeholder="أضف أي ملاحظات إضافية..."
              className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] resize-none"
              style={{ fontFamily: "Tajawal, sans-serif" }}
            />
          </div>
        </div>
      </Card>

      {/* نموذج استيراد */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>
              استيراد نموذج تقرير التنظيف
            </h3>
            <p className="text-sm text-[#5C3A2A] mb-4">
              اختر ملف نموذج تقرير إدارة التعليم وسيقوم النظام بتحليله وتعبئة البيانات تلقائياً
            </p>
            <div className="border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-[#C9A227]/5 transition-colors">
              <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
              <p className="text-sm text-[#5C3A2A]">اسحب الملف هنا أو اضغط للاختيار</p>
              <p className="text-xs text-[#C9A227]/60 mt-1">Excel, Word, PDF</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-[#5C3A2A] border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors"
              >
                إلغاء
              </button>
              <button 
                onClick={() => {
                  alert("تم استيراد النموذج بنجاح! جاري تحليل البيانات وتعبئة التقرير...");
                  setShowImportModal(false);
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-[#1A0F09]"
                style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
              >
                استيراد وتحليل
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}