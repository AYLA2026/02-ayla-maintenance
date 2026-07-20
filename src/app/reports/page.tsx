"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import { Camera, Upload, Download, FileSpreadsheet, Presentation, Printer, X, ImagePlus } from "lucide-react";
import { useState, useRef } from "react";

export default function PhotoReportPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState([
    { id: 1, title: "صورة قبل التنظيف", desc: "مبنى A - الطابق الأول", date: "2026-07-15" },
    { id: 2, title: "صورة بعد التنظيف", desc: "مبنى A - الطابق الأول", date: "2026-07-20" },
    { id: 3, title: "عطل المكيف", desc: "مبنى C - غرفة 105", date: "2026-07-18" },
  ]);

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "الرقم,العنوان,الوصف,التاريخ\n" +
      photos.map(p => `${p.id},${p.title},${p.desc},${p.date}`).join("\n")
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "تقرير_الصور_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPowerPoint = () => {
    const htmlContent = `
      <html dir="rtl" lang="ar">
        <head><meta charset="UTF-8"><title>تقرير الصور</title>
        <style>body{font-family:'Tajawal',sans-serif;padding:40px;color:#2C1810;}h1{color:#C9A227;border-bottom:3px solid #C9A227;}.photo-box{border:2px dashed #C9A227;padding:40px;text-align:center;margin:20px 0;background:#FAF7F2;}</style></head>
        <body><h1>تقرير الصور المصورة</h1><p><strong>المدرسة:</strong> مدرسة النور</p><p><strong>التاريخ:</strong> 20 يوليو 2026</p>
        ${photos.map(p => `<div class="photo-box"><h3>${p.title}</h3><p>${p.desc}</p><p style="color:#5C3A2A;">${p.date}</p><p style="color:#C9A227;">[صورة]</p></div>`).join("")}
        </body></html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "تقرير_الصور_2026.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const openPhotoPicker = () => {
    photoInputRef.current?.click();
  };

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    alert(`تم اختيار ${files.length} صورة للرفع`);
    e.target.value = "";
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input 
        type="file" 
        ref={fileInputRef}
        accept=".xlsx,.csv,.pptx,.ppt,.html" 
        className="hidden" 
        onChange={handleFileImport}
      />
      <input 
        type="file" 
        ref={photoInputRef}
        accept="image/*" 
        multiple
        className="hidden" 
        onChange={handlePhotoUpload}
      />

      <div className="flex items-center justify-between mb-8">
        <PageHeader title="تقرير الصور" subtitle="تقارير مصورة للمواقع والأعمال" />
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
            <Camera className="w-7 h-7 text-[#1A0F09]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>تقرير الصور المصورة</h2>
            <p className="text-sm text-[#5C3A2A]">يوليو 2026 • مدرسة النور</p>
          </div>
        </div>

        <button
          onClick={openPhotoPicker}
          className="w-full border-2 border-dashed border-[#C9A227]/30 rounded-xl p-6 text-center mb-6 hover:bg-[#C9A227]/5 transition-colors"
        >
          <ImagePlus className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
          <p className="text-sm text-[#5C3A2A]">اضغط هنا لرفع صور جديدة</p>
          <p className="text-xs text-[#C9A227]/60 mt-1">JPG, PNG, WEBP</p>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="p-4 rounded-xl border border-[#C9A227]/15" style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
              <div className="w-full h-32 rounded-lg bg-[#C9A227]/10 flex items-center justify-center mb-3">
                <Camera className="w-10 h-10 text-[#C9A227]/40" />
              </div>
              <h3 className="font-bold text-[#2C1810] text-sm mb-1" style={{ fontFamily: "Tajawal, sans-serif" }}>{photo.title}</h3>
              <p className="text-xs text-[#5C3A2A] mb-1">{photo.desc}</p>
              <p className="text-xs text-[#C9A227]/60">{photo.date}</p>
            </div>
          ))}
        </div>
      </Card>

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد نموذج تقرير الصور</h3>
                <button onClick={() => setShowImportModal(false)} className="text-[#5C3A2A] hover:text-[#2C1810]"><X className="w-5 h-5" /></button>
              </div>
              <button
                onClick={openFilePicker}
                className="w-full border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 hover:bg-[#C9A227]/5 transition-colors"
              >
                <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
                <p className="text-sm text-[#5C3A2A]">اضغط هنا لاختيار الملف</p>
                <p className="text-xs text-[#C9A227]/60 mt-1">Excel, PowerPoint</p>
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