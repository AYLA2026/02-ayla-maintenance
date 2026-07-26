"use client";

import { useState, useRef, useMemo } from "react";
import {
  Upload, Search, School, MapPin, Filter, Download, Trash2,
  Plus, X, Building2, GraduationCap
} from "lucide-react";

interface SchoolData {
  id: string;
  name: string;
  stage: string;
  region: string;
  district: string;
  buildingType: string;
  location: string;
  refNumber: string;
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

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("الكل");
  const [filterStage, setFilterStage] = useState("الكل");
  const [filterBuilding, setFilterBuilding] = useState("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const excelRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", stage: "", region: "", district: "",
    buildingType: "", location: "", refNumber: ""
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
      const imported: SchoolData[] = rows.map((row, idx) => ({
        id: `sch-${Date.now()}-${idx}`,
        name: String(row[0] || ""),
        stage: String(row[1] || ""),
        region: String(row[2] || ""),
        district: String(row[3] || ""),
        buildingType: String(row[4] || ""),
        location: String(row[5] || ""),
        refNumber: String(row[6] || ""),
      })).filter((s) => s.name.trim());
      setSchools((prev) => [...prev, ...imported]);
    } catch {
      alert("⚠️ تأكد من تثبيت: npm install xlsx");
    }
  };

  const addManual = () => {
    if (!form.name.trim()) return alert("اسم المدرسة مطلوب");
    setSchools((prev) => [...prev, { ...form, id: `sch-${Date.now()}` }]);
    setForm({ name: "", stage: "", region: "", district: "", buildingType: "", location: "", refNumber: "" });
    setShowAdd(false);
  };

  const exportExcel = async () => {
    if (schools.length === 0) return;
    const headers = [["اسم المدرسة", "المرحلة", "المنطقة", "الحي", "نوع المبنى", "الموقع", "الرقم المرجعي"]];
    const rows = schools.map((s) => [s.name, s.stage, s.region, s.district, s.buildingType, s.location, s.refNumber]);
    await exportWithHeader([...headers, ...rows], "المدارس_آيلا.xlsx", "المدارس");
  };

  const filtered = useMemo(() => {
    return schools.filter((s) => {
      const q = search.trim();
      const matchSearch = !q || s.name.includes(q) || s.refNumber.includes(q) || s.region.includes(q);
      const matchRegion = filterRegion === "الكل" || s.region === filterRegion;
      const matchStage = filterStage === "الكل" || s.stage === filterStage;
      const matchBuilding = filterBuilding === "الكل" || s.buildingType === filterBuilding;
      return matchSearch && matchRegion && matchStage && matchBuilding;
    });
  }, [schools, search, filterRegion, filterStage, filterBuilding]);

  const regions = useMemo(() => ["الكل", ...Array.from(new Set(schools.map((s) => s.region).filter(Boolean)))], [schools]);
  const stages = useMemo(() => ["الكل", ...Array.from(new Set(schools.map((s) => s.stage).filter(Boolean)))], [schools]);
  const buildings = useMemo(() => ["الكل", ...Array.from(new Set(schools.map((s) => s.buildingType).filter(Boolean)))], [schools]);

  const stats = {
    total: schools.length,
    big: schools.filter((s) => s.buildingType.includes("كبير")).length,
    medium: schools.filter((s) => s.buildingType.includes("وسط")).length,
    small: schools.filter((s) => s.buildingType.includes("صغير")).length,
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <School className="w-8 h-8 text-[#C9A227]" /> إدارة المدارس
          </h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => excelRef.current?.click()} className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm flex items-center gap-2 hover:bg-[#b89420] transition">
              <Upload className="w-4 h-4" /> استيراد Excel
            </button>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Plus className="w-4 h-4" /> إضافة يدوية
            </button>
            {schools.length > 0 && (
              <>
                <button onClick={exportExcel} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                  <Download className="w-4 h-4" /> تصدير
                </button>
                <button onClick={() => confirm("تأكيد الحذف؟") && setSchools([])} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition">
                  <Trash2 className="w-4 h-4" /> تفريغ
                </button>
              </>
            )}
          </div>
        </div>

        {schools.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
              <div className="text-3xl font-bold text-[#C9A227]">{stats.total}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي المدارس</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-green-200 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.big}</div>
              <div className="text-xs text-gray-500 mt-1">مباني كبيرة</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.medium}</div>
              <div className="text-xs text-gray-500 mt-1">مباني وسط</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-orange-200 text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.small}</div>
              <div className="text-xs text-gray-500 mt-1">مباني صغيرة</div>
            </div>
          </div>
        )}

        {schools.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-[#C9A227]" />
              <span className="font-bold text-sm text-[#2C1810]">فلترة البيانات</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم المدرسة أو الرقم..." className="w-full pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              </div>
              <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                {stages.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterBuilding} onChange={(e) => setFilterBuilding(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                {buildings.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        )}

        {schools.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
            <School className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد مدارس مسجلة</p>
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
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">اسم المدرسة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المرحلة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المنطقة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الحي</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">نوع المبنى</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الرقم المرجعي</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الموقع</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[#2C1810]">{s.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">{s.stage}</span></td>
                      <td className="px-4 py-3 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{s.region}</td>
                      <td className="px-4 py-3 text-gray-600">{s.district}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-bold ${s.buildingType.includes("كبير") ? "bg-green-50 text-green-700" : s.buildingType.includes("وسط") ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"}`}>{s.buildingType}</span></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.refNumber}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[150px]">{s.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-[#C9A227]/10 text-xs text-gray-500 text-center">
              عرض {filtered.length} من {schools.length} مدرسة
            </div>
          </div>
        )}
      </div>

      {/* Modal إضافة يدوية */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">إضافة مدرسة جديدة</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="اسم المدرسة *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="المرحلة (ابتدائي / متوسط / ثانوي)" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="المنطقة" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الحي" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="نوع المبنى (كبير / وسط / صغير)" value={form.buildingType} onChange={(e) => setForm({ ...form, buildingType: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الموقع / الإحداثيات" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الرقم المرجعي / الوزاري" value={form.refNumber} onChange={(e) => setForm({ ...form, refNumber: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2" />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addManual} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ المدرسة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}