"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import { Wind, Upload, Download, FileSpreadsheet, Presentation, Printer, X } from "lucide-react";
import { useState } from "react";

export default function HvacReportPage() {
  const [showImportModal, setShowImportModal] = useState(false);

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "الجهاز,الموقع,الحالة,درجة الحرارة,الضغط,ملاحظات\n" +
      "مكيف مركزي,مبنى A,يعمل,22,150,طبيعي\n" +
      "مكيف سبلت,مبنى B,يعمل,24,145,طبيعي\n" +
      "مكيف شباك,مبنى C,عطل,—,—,يحتاج صيانة"
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "تقرير_التكييف_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPowerPoint = () => {
    const htmlContent = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>تقرير التكييف - يوليو 2026</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; color: #2C1810; }
            h1 { color: #C9A227; border-bottom: 3px solid #C9A227; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: linear-gradient(135deg, #C9A227, #E8D5A3); color: #1A0F09; padding: 12px; }
            td { padding: 10px; border-bottom: 1px solid #F5E6D3; }
            .fault { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>تقرير التكييف الشهري</h1>
          <p><strong>المدرسة:</strong> مدرسة النور</p>
          <p><strong>التاريخ:</strong> 20 يوليو 2026</p>
          
          <table>
            <tr>
              <th>الجهاز</th>
              <th>الموقع</th>
              <th>الحالة</th>
              <th>درجة الحرارة</th>
              <th>الضغط</th>
              <th>ملاحظات</th>
            </tr>
            <tr><td>مكيف مركزي</td><td>مبنى A</td><td>يعمل</td><td>22°</td><td>150</td><td>طبيعي</td></tr>
            <tr><td>مكيف سبلت</td><td>مبنى B</td><td>يعمل</td><td>24°</td><td>145</td><td>طبيعي</td></tr>
            <tr><td>مكيف شباك</td><td>مبنى C</td><td class="fault">عطل</td><td>—</td><td>—</td><td>يحتاج صيانة</td></tr>
          </table>
          
          <p style="margin-top: 30px; color: #5C3A2A;">
            <strong>المسؤول:</strong> م. محمد عبد الرحمن
          </p>
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "تقرير_التكييف_2026.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      alert(`✅ تم استيراد: ${file.name}\nالحجم: ${(file.size / 1024).toFixed(2)} KB\nسيتم تحليل البيانات...`);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="تقرير التكييف" subtitle="تقارير صيانة وأداء أنظمة التكييف" />
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
            <Wind className="w-7 h-7 text-[#1A0F09]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>تقرير التكييف الشهري</h2>
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
            <label className="block text-sm font-medium text-[#5C3A2A] mb-2">حالة أجهزة التكييف</label>
            <textarea rows={4} defaultValue="• مكيف مركزي مبنى A: يعمل بكفاءة (22°)
• مكيف سبلت مبنى B: يعمل بكفاءة (24°)
• مكيف شباك مبنى C: عطل - يحتاج صيانة عاجلة"
              className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] resize-none"
              style={{ fontFamily: "Tajawal, sans-serif" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">عدد الأجهزة</label>
              <input type="number" defaultValue="12"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">الأجهزة العاطلة</label>
              <input type="number" defaultValue="1"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">التكلفة (ر.س)</label>
              <input type="number" defaultValue="3500"
                className="w-full px-4 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227]" />
            </div>
          </div>
        </div>
      </Card>

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد نموذج تقرير التكييف</h3>
              <button onClick={() => setShowImportModal(false)} className="text-[#5C3A2A] hover:text-[#2C1810]"><X className="w-5 h-5" /></button>
            </div>
            <label className="border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 cursor-pointer hover:bg-[#C9A227]/5 transition-colors block">
              <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
              <p className="text-sm text-[#5C3A2A]">اضغط هنا لاختيار الملف</p>
              <p className="text-xs text-[#C9A227]/60 mt-1">Excel, PowerPoint</p>
              <input type="file" accept=".xlsx,.csv,.pptx,.ppt,.html" className="hidden" onChange={handleFileImport} />
            </label>
            <button onClick={() => setShowImportModal(false)}
              className="w-full py-2 rounded-lg text-sm font-medium text-[#5C3A2A] border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">إلغاء</button>
          </Card>
        </div>
      )}
    </div>
  );
}