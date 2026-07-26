"use client";

import { useState, useRef, useMemo } from "react";
import {
  Upload, Search, Briefcase, Plus, X, Download, Trash2,
  Building2, Calendar, DollarSign, User
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  schoolCount: number;
  totalPrice: string;
  startDate: string;
  status: "قيد التنفيذ" | "منتهي" | "معلق";
  manager: string;
}

const exportWithHeader = async (data: any[][], filename: string, sheetName: string) => {
  const XLSX = await import("xlsx");
  const headerRows = [
    ["Ayla Maintenance"],
    ["م. محمد عبد الرحمن"],
    [new Date().toLocaleDateString("ar-SA")],
    [],
  ];
  const allRows = [...headerRows, ...data];
  const ws = XLSX.utils.aoa_to_sheet(allRows);
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: data[0].length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: data[0].length - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: data[0].length - 1 } },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const excelRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", schoolCount: "", totalPrice: "", startDate: "", status: "قيد التنفيذ" as Project["status"], manager: ""
  });

  const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const XLSX = await import("xlsx");
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      const rows = data.slice(1);
      const imported: Project[] = rows.map((row, idx) => ({
        id: `prj-${Date.now()}-${idx}`,
        name: String(row[0] || ""),
        schoolCount: Number(row[1] || 0),
        totalPrice: String(row[2] || ""),
        startDate: String(row[3] || ""),
        status: (["قيد التنفيذ", "منتهي", "معلق"].includes(row[4]) ? row[4] : "قيد التنفيذ") as Project["status"],
        manager: String(row[5] || ""),
      })).filter((p) => p.name.trim());
      setProjects((prev) => [...prev, ...imported]);
    } catch {
      alert("⚠️ تأكد من تثبيت: npm install xlsx");
    }
  };

  const addManual = () => {
    if (!form.name.trim()) return alert("اسم المشروع مطلوب");
    setProjects((prev) => [...prev, {
      ...form,
      id: `prj-${Date.now()}`,
      schoolCount: Number(form.schoolCount) || 0
    }]);
    setForm({ name: "", schoolCount: "", totalPrice: "", startDate: "", status: "قيد التنفيذ", manager: "" });
    setShowAdd(false);
  };

  const exportExcel = async () => {
    if (projects.length === 0) return;
    const headers = [["اسم المشروع", "عدد المدارس", "السعر الإجمالي", "تاريخ البدء", "الحالة", "المسؤول"]];
    const rows = projects.map((p) => [p.name, p.schoolCount, p.totalPrice, p.startDate, p.status, p.manager]);
    await exportWithHeader([...headers, ...rows], "المشاريع_آيلا.xlsx", "المشاريع");
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = search.trim();
      const matchSearch = !q || p.name.includes(q) || p.manager.includes(q);
      const matchStatus = filterStatus === "الكل" || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [projects, search, filterStatus]);

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "قيد التنفيذ").length,
    done: projects.filter((p) => p.status === "منتهي").length,
    hold: projects.filter((p) => p.status === "معلق").length,
    totalSchools: projects.reduce((sum, p) => sum + (Number(p.schoolCount) || 0), 0),
  };

  const statusColor = (s: string) => {
    if (s === "قيد التنفيذ") return "bg-green-50 text-green-700 border-green-200";
    if (s === "منتهي") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-orange-50 text-orange-700 border-orange-200";
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <Briefcase className="w-8 h-8 text-[#C9A227]" /> إدارة المشاريع
          </h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => excelRef.current?.click()} className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm flex items-center gap-2 hover:bg-[#b89420] transition">
              <Upload className="w-4 h-4" /> استيراد Excel
            </button>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Plus className="w-4 h-4" /> إضافة مشروع
            </button>
            {projects.length > 0 && (
              <>
                <button onClick={exportExcel} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                  <Download className="w-4 h-4" /> تصدير
                </button>
                <button onClick={() => confirm("تأكيد الحذف؟") && setProjects([])} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition">
                  <Trash2 className="w-4 h-4" /> تفريغ
                </button>
              </>
            )}
          </div>
        </div>

        {projects.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
              <div className="text-3xl font-bold text-[#C9A227]">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي المشاريع</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-green-200 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-500 mt-1">قيد التنفيذ</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.done}</div>
              <div className="text-xs text-gray-500 mt-1">منتهية</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-orange-200 text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.hold}</div>
              <div className="text-xs text-gray-500 mt-1">معلقة</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalSchools}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي المدارس</div>
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم المشروع أو المسؤول..." className="w-full pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
              <option value="الكل">كل الحالات</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="منتهي">منتهي</option>
              <option value="معلق">معلق</option>
            </select>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
            <Briefcase className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد مشاريع مسجلة</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => excelRef.current?.click()} className="px-6 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold hover:bg-[#b89420] transition">استيراد من Excel</button>
              <button onClick={() => setShowAdd(true)} className="px-6 py-3 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold hover:bg-[#2C1810] transition">إضافة يدوية</button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF7F2]">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">#</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">اسم المشروع</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">عدد المدارس</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">السعر الإجمالي</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">تاريخ البدء</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المسؤول</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-bold text-[#2C1810]">{p.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold">{p.schoolCount} مدرسة</span></td>
                      <td className="px-4 py-3 text-gray-600 font-mono">{p.totalPrice}</td>
                      <td className="px-4 py-3 text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" />{p.startDate}</td>
                      <td className="px-4 py-3 text-gray-600 flex items-center gap-1"><User className="w-3 h-3 text-gray-400" />{p.manager}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-bold border ${statusColor(p.status)}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-[#C9A227]/10 text-xs text-gray-500 text-center">
              عرض {filtered.length} من {projects.length} مشروع
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">إضافة مشروع جديد</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="اسم المشروع *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="عدد المدارس" type="number" value={form.schoolCount} onChange={(e) => setForm({ ...form, schoolCount: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="السعر الإجمالي" value={form.totalPrice} onChange={(e) => setForm({ ...form, totalPrice: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="تاريخ البدء" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="اسم المسؤول" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project["status"] })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="منتهي">منتهي</option>
                <option value="معلق">معلق</option>
              </select>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addManual} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ المشروع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}