"use client";

import { useState, useRef, useMemo } from "react";
import {
  Upload, Search, Car, Plus, X, Download, Trash2, Filter
} from "lucide-react";

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  model: string;
  year: string;
  driver: string;
  status: "نشط" | "صيانة" | "متوقف";
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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const excelRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    plate: "", type: "", model: "", year: "", driver: "", status: "نشط" as Vehicle["status"]
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
      const imported: Vehicle[] = rows.map((row, idx) => ({
        id: `veh-${Date.now()}-${idx}`,
        plate: String(row[0] || ""),
        type: String(row[1] || ""),
        model: String(row[2] || ""),
        year: String(row[3] || ""),
        driver: String(row[4] || ""),
        status: (["نشط", "صيانة", "متوقف"].includes(row[5]) ? row[5] : "نشط") as Vehicle["status"],
      })).filter((v) => v.plate.trim());
      setVehicles((prev) => [...prev, ...imported]);
    } catch {
      alert("⚠️ تأكد من تثبيت: npm install xlsx");
    }
  };

  const addManual = () => {
    if (!form.plate.trim()) return alert("رقم اللوحة مطلوب");
    setVehicles((prev) => [...prev, { ...form, id: `veh-${Date.now()}` }]);
    setForm({ plate: "", type: "", model: "", year: "", driver: "", status: "نشط" });
    setShowAdd(false);
  };

  const exportExcel = async () => {
    if (vehicles.length === 0) return;
    const headers = [["رقم اللوحة", "النوع", "الموديل", "السنة", "السائق", "الحالة"]];
    const rows = vehicles.map((v) => [v.plate, v.type, v.model, v.year, v.driver, v.status]);
    await exportWithHeader([...headers, ...rows], "المركبات_آيلا.xlsx", "المركبات");
  };

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.trim();
      const matchSearch = !q || v.plate.includes(q) || v.driver.includes(q) || v.type.includes(q);
      const matchStatus = filterStatus === "الكل" || v.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [vehicles, search, filterStatus]);

  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v) => v.status === "نشط").length,
    maintenance: vehicles.filter((v) => v.status === "صيانة").length,
    stopped: vehicles.filter((v) => v.status === "متوقف").length,
  };

  const statusColor = (s: string) => {
    if (s === "نشط") return "bg-green-50 text-green-700 border-green-200";
    if (s === "صيانة") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <Car className="w-8 h-8 text-[#C9A227]" /> إدارة المركبات
          </h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => excelRef.current?.click()} className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm flex items-center gap-2 hover:bg-[#b89420] transition">
              <Upload className="w-4 h-4" /> استيراد Excel
            </button>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Plus className="w-4 h-4" /> إضافة مركبة
            </button>
            {vehicles.length > 0 && (
              <>
                <button onClick={exportExcel} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                  <Download className="w-4 h-4" /> تصدير
                </button>
                <button onClick={() => confirm("تأكيد الحذف؟") && setVehicles([])} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition">
                  <Trash2 className="w-4 h-4" /> تفريغ
                </button>
              </>
            )}
          </div>
        </div>

        {vehicles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
              <div className="text-3xl font-bold text-[#C9A227]">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي المركبات</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-green-200 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-500 mt-1">نشطة</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-yellow-200 text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.maintenance}</div>
              <div className="text-xs text-gray-500 mt-1">في الصيانة</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-red-200 text-center">
              <div className="text-3xl font-bold text-red-600">{stats.stopped}</div>
              <div className="text-xs text-gray-500 mt-1">متوقفة</div>
            </div>
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث برقم اللوحة أو السائق..." className="w-full pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
              <option value="الكل">كل الحالات</option>
              <option value="نشط">نشط</option>
              <option value="صيانة">صيانة</option>
              <option value="متوقف">متوقف</option>
            </select>
          </div>
        )}

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
            <Car className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد مركبات مسجلة</p>
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
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">رقم اللوحة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">النوع</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الموديل</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">السنة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">السائق</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <tr key={v.id} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-bold text-[#2C1810]">{v.plate}</td>
                      <td className="px-4 py-3 text-gray-600">{v.type}</td>
                      <td className="px-4 py-3 text-gray-600">{v.model}</td>
                      <td className="px-4 py-3 text-gray-600">{v.year}</td>
                      <td className="px-4 py-3 text-gray-600">{v.driver}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-bold border ${statusColor(v.status)}`}>{v.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-[#C9A227]/10 text-xs text-gray-500 text-center">
              عرض {filtered.length} من {vehicles.length} مركبة
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">إضافة مركبة جديدة</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="رقم اللوحة *" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="نوع المركبة" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الموديل" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="السنة" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="اسم السائق" value={form.driver} onChange={(e) => setForm({ ...form, driver: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Vehicle["status"] })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                <option value="نشط">نشط</option>
                <option value="صيانة">صيانة</option>
                <option value="متوقف">متوقف</option>
              </select>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addManual} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ المركبة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}