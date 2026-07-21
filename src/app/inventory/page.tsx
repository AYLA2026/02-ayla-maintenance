"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Package, ArrowDown, ArrowUp, AlertTriangle, Plus, Download, Upload, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function InventoryPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState([
    { name: "فلاتر مكيفات", category: "تكييف", qty: 45, min: 10, unit: "قطعة" },
    { name: "لمبات LED", category: "كهرباء", qty: 8, min: 20, unit: "علبة" },
    { name: "منظفات عامة", category: "تنظيف", qty: 120, min: 30, unit: "لتر" },
    { name: "مواسير PVC", category: "سباكة", qty: 25, min: 15, unit: "متر" },
  ]);

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "الصنف,التصنيف,الكمية,الحد الأدنى,الوحدة,الحالة\n" +
      items.map(i => `${i.name},${i.category},${i.qty},${i.min},${i.unit},${i.qty <= i.min ? "نفاد" : "متوفر"}`).join("\n")
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "المخزون_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const closeModal = () => setShowImportModal(false);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const lines = content.trim().split("\n");
        const newItems = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",");
          if (cols.length >= 5) {
            newItems.push({
              name: cols[0]?.trim() || "صنف جديد",
              category: cols[1]?.trim() || "عام",
              qty: parseInt(cols[2]?.trim()) || 0,
              min: parseInt(cols[3]?.trim()) || 0,
              unit: cols[4]?.trim() || "قطعة",
            });
          }
        }
        if (newItems.length > 0) {
          setItems(prev => [...prev, ...newItems]);
          alert(`✅ تم استيراد ${newItems.length} صنف بنجاح!`);
        }
      } catch (err) {
        alert("⚠️ خطأ في قراءة الملف.");
      }
      setShowImportModal(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input type="file" ref={fileInputRef} accept=".csv,.xlsx" className="hidden" onChange={handleFileImport} />

      <div className="flex items-center justify-between mb-8">
        <PageHeader title="المخازن" subtitle="إدارة المخزون والمواد" />
        <div className="flex gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" /> استيراد
          </button>
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
          <Link href="/inventory/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Plus className="w-4 h-4" /> صنف جديد
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الأصناف" value={items.length.toString()} icon={Package} delay={0} />
        <StatCard title="وارد اليوم" value="12" icon={ArrowDown} delay={0.1} />
        <StatCard title="صادر اليوم" value="8" icon={ArrowUp} delay={0.2} />
        <StatCard title="نفاد الكمية" value={items.filter(i => i.qty <= i.min).length.toString()} icon={AlertTriangle} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>جرد المخزون</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A227]/20">
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الصنف</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">التصنيف</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الكمية</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الحد الأدنى</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                  <td className="py-4 px-4 font-medium text-[#2C1810]">{item.name}</td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{item.category}</td>
                  <td className="py-4 px-4 text-[#2C1810] font-bold">{item.qty} {item.unit}</td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{item.min} {item.unit}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.qty <= item.min ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                      {item.qty <= item.min ? "نفاد" : "متوفر"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-md mx-4 rounded-2xl p-6"
            style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)", border: "1px solid rgba(201, 162, 39, 0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد المخزون</h3>
              <button onClick={closeModal} className="text-[#5C3A2A] hover:text-[#2C1810]"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-[#5C3A2A] mb-4">
              اختر ملف CSV يحتوي على بيانات المخزون:
            </p>
            <div className="bg-white/50 rounded-lg p-3 mb-4 text-xs text-[#5C3A2A] font-mono border border-[#C9A227]/20">
              الصنف,التصنيف,الكمية,الحد الأدنى,الوحدة<br/>
              فلاتر مكيفات,تكييف,45,10,قطعة
            </div>
            <button type="button" onClick={openFilePicker}
              className="w-full border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 hover:bg-[#C9A227]/5 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
              <p className="text-sm text-[#5C3A2A]">اضغط هنا لاختيار ملف CSV</p>
              <p className="text-xs text-[#C9A227]/60 mt-1">CSV فقط</p>
            </button>
            <button type="button" onClick={closeModal}
              className="w-full py-2 rounded-lg text-sm font-medium text-[#5C3A2A] border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}