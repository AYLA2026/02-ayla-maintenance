"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Users, UserCheck, UserX, Wrench, Upload, Download, Plus, Trash2, Edit3 } from "lucide-react";
import { useState, useRef } from "react";

interface Worker {
  id: number;
  name: string;
  idNumber: string;
  phone: string;
  role: string;
  team: string;
  status: "نشط" | "إجازة" | "معلق";
  joinDate: string;
}

export default function WorkforcePage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workers, setWorkers] = useState<Worker[]>([
    { id: 1, name: "أحمد محمد علي", idNumber: "1098765432", phone: "0501234567", role: "فني كهرباء", team: "الفريق أ", status: "نشط", joinDate: "2024-01-15" },
    { id: 2, name: "خالد عبدالله", idNumber: "1098765433", phone: "0501234568", role: "فني سباكة", team: "الفريق أ", status: "نشط", joinDate: "2024-02-01" },
    { id: 3, name: "سعد إبراهيم", idNumber: "1098765434", phone: "0501234569", role: "عامل نظافة", team: "الفريق ب", status: "إجازة", joinDate: "2024-03-10" },
    { id: 4, name: "محمد سالم", idNumber: "1098765435", phone: "0501234570", role: "فني تكييف", team: "الفريق ب", status: "نشط", joinDate: "2024-01-20" },
    { id: 5, name: "يوسف أحمد", idNumber: "1098765436", phone: "0501234571", role: "مشرف", team: "الإدارة", status: "نشط", joinDate: "2023-12-01" },
  ]);

  const stats = {
    total: workers.length,
    active: workers.filter(w => w.status === "نشط").length,
    onLeave: workers.filter(w => w.status === "إجازة").length,
    suspended: workers.filter(w => w.status === "معلق").length,
  };

  const exportExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      "الرقم,الاسم,رقم الهوية,الجوال,الدور,الفريق,الحالة,تاريخ الانضمام\n" +
      workers.map(w => `${w.id},${w.name},${w.idNumber},${w.phone},${w.role},${w.team},${w.status},${w.joinDate}`).join("\n")
    )}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "القوى_العاملة_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const closeModal = () => setShowImportModal(false);

  const parseCSV = (text: string): Partial<Worker>[] => {
    const lines = text.trim().split("\n");
    const result: Partial<Worker>[] = [];
    // تخطي السطر الأول (العناوين)
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length >= 4) {
        result.push({
          name: cols[0]?.trim() || cols[1]?.trim(),
          idNumber: cols[1]?.trim() || cols[2]?.trim(),
          phone: cols[2]?.trim() || cols[3]?.trim(),
          role: cols[3]?.trim() || cols[4]?.trim() || "عامل",
          team: cols[4]?.trim() || cols[5]?.trim() || "غير محدد",
          status: (cols[5]?.trim() as Worker["status"]) || "نشط",
          joinDate: cols[6]?.trim() || new Date().toISOString().split("T")[0],
        });
      }
    }
    return result;
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const imported = parseCSV(content);
        const newWorkers: Worker[] = imported.map((w, idx) => ({
          id: workers.length + idx + 1,
          name: w.name || "غير معروف",
          idNumber: w.idNumber || "",
          phone: w.phone || "",
          role: w.role || "عامل",
          team: w.team || "غير محدد",
          status: w.status || "نشط",
          joinDate: w.joinDate || new Date().toISOString().split("T")[0],
        }));
        setWorkers(prev => [...prev, ...newWorkers]);
        alert(`✅ تم استيراد ${newWorkers.length} عامل بنجاح!`);
      } catch (err) {
        alert("⚠️ خطأ في قراءة الملف. تأكد من تنسيق CSV.");
      }
      setShowImportModal(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const removeWorker = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العامل؟")) {
      setWorkers(prev => prev.filter(w => w.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط": return "bg-green-100 text-green-800";
      case "إجازة": return "bg-yellow-100 text-yellow-800";
      case "معلق": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input type="file" ref={fileInputRef} accept=".csv,.xlsx" className="hidden" onChange={handleFileImport} />

      <div className="flex items-center justify-between mb-8">
        <PageHeader title="القوى العاملة" subtitle="إدارة العمال والفنيين" />
        <div className="flex gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" /> استيراد Excel
          </button>
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" /> تصدير Excel
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Plus className="w-4 h-4" /> عامل جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي العمال" value={stats.total.toString()} icon={Users} delay={0} />
        <StatCard title="النشطين" value={stats.active.toString()} icon={UserCheck} delay={0.1} />
        <StatCard title="في إجازة" value={stats.onLeave.toString()} icon={UserX} delay={0.2} />
        <StatCard title="الفنيين" value={workers.filter(w => w.role.includes("فني")).length.toString()} icon={Wrench} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>قائمة العمال</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A227]/20">
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">#</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الاسم</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">رقم الهوية</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الجوال</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الدور</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الفريق</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id} className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                  <td className="py-4 px-4 text-[#5C3A2A]">{worker.id}</td>
                  <td className="py-4 px-4 font-bold text-[#2C1810]">{worker.name}</td>
                  <td className="py-4 px-4 text-[#5C3A2A] font-mono">{worker.idNumber}</td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{worker.phone}</td>
                  <td className="py-4 px-4 text-[#2C1810]">{worker.role}</td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{worker.team}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-[#C9A227]/10 text-[#C9A227]">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeWorker(worker.id)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
          <div className="relative w-full max-w-lg mx-4 rounded-2xl p-6"
            style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)", border: "1px solid rgba(201, 162, 39, 0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد القوى العاملة</h3>
              <button onClick={closeModal} className="text-[#5C3A2A] hover:text-[#2C1810]"><Users className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-[#5C3A2A] mb-4">
              اختر ملف CSV يحتوي على بيانات العمال. التنسيق المطلوب:
            </p>
            <div className="bg-white/50 rounded-lg p-3 mb-4 text-xs text-[#5C3A2A] font-mono border border-[#C9A227]/20">
              الاسم,رقم الهوية,الجوال,الدور,الفريق,الحالة,تاريخ الانضمام<br/>
              أحمد محمد,1098765432,0501234567,فني كهرباء,الفريق أ,نشط,2024-01-15
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