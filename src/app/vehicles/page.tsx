"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Truck, Fuel, Wrench, AlertTriangle, Plus, Download, Upload, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function VehiclesPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [vehicles, setVehicles] = useState([
    { plate: "أ ب ج 1234", type: "بيك أب", driver: "أحمد محمد", status: "متاح", fuel: 85, lastMaint: "2026/06/15" },
    { plate: "أ ب ج 5678", type: "فان", driver: "خالد عبدالله", status: "مشغول", fuel: 45, lastMaint: "2026/07/01" },
    { plate: "أ ب ج 9012", type: "سطحه", driver: "سعد إبراهيم", status: "صيانة", fuel: 20, lastMaint: "2026/05/20" },
    { plate: "أ ب ج 3456", type: "بيك أب", driver: "محمد سالم", status: "متاح", fuel: 90, lastMaint: "2026/07/10" },
  ]);

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "اللوحة,النوع,السائق,الحالة,الوقود,آخر صيانة\n" +
      vehicles.map(v => `${v.plate},${v.type},${v.driver},${v.status},${v.fuel},${v.lastMaint}`).join("\n")
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "المركبات_2026.csv";
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
        const newVehicles = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",");
          if (cols.length >= 6) {
            newVehicles.push({
              plate: cols[0]?.trim() || "",
              type: cols[1]?.trim() || "غير محدد",
              driver: cols[2]?.trim() || "غير محدد",
              status: cols[3]?.trim() || "متاح",
              fuel: parseInt(cols[4]?.trim()) || 0,
              lastMaint: cols[5]?.trim() || new Date().toISOString().split("T")[0].replace(/-/g, "/"),
            });
          }
        }
        if (newVehicles.length > 0) {
          setVehicles(prev => [...prev, ...newVehicles]);
          alert(`✅ تم استيراد ${newVehicles.length} مركبة بنجاح!`);
        }
      } catch (err) {
        alert("⚠️ خطأ في قراءة الملف.");
      }
      setShowImportModal(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح": return "bg-green-100 text-green-800";
      case "مشغول": return "bg-yellow-100 text-yellow-800";
      case "صيانة": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input type="file" ref={fileInputRef} accept=".csv,.xlsx" className="hidden" onChange={handleFileImport} />

      <div className="flex items-center justify-between mb-8">
        <PageHeader title="المركبات" subtitle="إدارة المركبات والصيانة" />
        <div className="flex gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" /> استيراد
          </button>
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" /> تصدير
          </button>
          <Link href="/vehicles/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Plus className="w-4 h-4" /> مركبة جديدة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي المركبات" value={vehicles.length.toString()} icon={Truck} delay={0} />
        <StatCard title="المتاحة" value={vehicles.filter(v => v.status === "متاح").length.toString()} icon={Fuel} delay={0.1} />
        <StatCard title="في الصيانة" value={vehicles.filter(v => v.status === "صيانة").length.toString()} icon={Wrench} delay={0.2} />
        <StatCard title="تحتاج صيانة" value={vehicles.filter(v => v.fuel < 25).length.toString()} icon={AlertTriangle} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>قائمة المركبات</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A227]/20">
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">اللوحة</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">النوع</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">السائق</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الوقود %</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">آخر صيانة</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle, i) => (
                <tr key={i} className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#2C1810] font-mono">{vehicle.plate}</td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{vehicle.type}</td>
                  <td className="py-4 px-4 text-[#2C1810]">{vehicle.driver}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${vehicle.fuel}%`, background: vehicle.fuel < 25 ? "#ef4444" : vehicle.fuel < 50 ? "#eab308" : "#22c55e" }} />
                      </div>
                      <span className="text-xs text-[#5C3A2A]">{vehicle.fuel}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{vehicle.lastMaint}</td>
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
              <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد المركبات</h3>
              <button onClick={closeModal} className="text-[#5C3A2A] hover:text-[#2C1810]"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-[#5C3A2A] mb-4">
              اختر ملف CSV يحتوي على بيانات المركبات:
            </p>
            <div className="bg-white/50 rounded-lg p-3 mb-4 text-xs text-[#5C3A2A] font-mono border border-[#C9A227]/20">
              اللوحة,النوع,السائق,الحالة,الوقود,آخر صيانة<br/>
              أ ب ج 1234,بيك أب,أحمد محمد,متاح,85,2026/06/15
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