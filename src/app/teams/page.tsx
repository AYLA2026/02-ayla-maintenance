"use client";

import { useState, useRef, useMemo } from "react";
import {
  Upload, Search, Users, Plus, X, Download, Trash2,
  Car, School, UserCheck, Shield
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  supervisor: string;
  vehicle: string;
  technicians: string[];
  schools: string[];
}

const exportWithHeader = async (data: any[][], filename: string, sheetName: string) => {
  const XLSX = await import("xlsx");
  const headerRows = [
    ["Ayla Maintenance"], ["م. محمد عبد الرحمن"],
    [new Date().toLocaleDateString("ar-SA")], [],
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

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const excelRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", supervisor: "", vehicle: "",
    technicians: "", schools: ""
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
      const imported: Team[] = rows.map((row, idx) => ({
        id: `team-${Date.now()}-${idx}`,
        name: String(row[0] || ""),
        supervisor: String(row[1] || ""),
        vehicle: String(row[2] || ""),
        technicians: String(row[3] || "").split(",").map((s) => s.trim()).filter(Boolean),
        schools: String(row[4] || "").split(",").map((s) => s.trim()).filter(Boolean),
      })).filter((t) => t.name.trim());
      setTeams((prev) => [...prev, ...imported]);
    } catch {
      alert("⚠️ تأكد من تثبيت: npm install xlsx");
    }
  };

  const addManual = () => {
    if (!form.name.trim()) return alert("اسم الفرقة مطلوب");
    if (!form.supervisor.trim()) return alert("اسم المشرف مطلوب");
    setTeams((prev) => [...prev, {
      id: `team-${Date.now()}`,
      name: form.name,
      supervisor: form.supervisor,
      vehicle: form.vehicle,
      technicians: form.technicians.split(",").map((s) => s.trim()).filter(Boolean),
      schools: form.schools.split(",").map((s) => s.trim()).filter(Boolean),
    }]);
    setForm({ name: "", supervisor: "", vehicle: "", technicians: "", schools: "" });
    setShowAdd(false);
  };

  const exportExcel = async () => {
    if (teams.length === 0) return;
    const headers = [["اسم الفرقة", "المشرف", "السيارة", "الفنيون", "المدارس"]];
    const rows = teams.map((t) => [t.name, t.supervisor, t.vehicle, t.technicians.join(" | "), t.schools.join(" | ")]);
    await exportWithHeader([...headers, ...rows], "الفرق_آيلا.xlsx", "الفرق");
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return teams;
    return teams.filter((t) =>
      t.name.includes(search) || t.supervisor.includes(search) || t.vehicle.includes(search)
    );
  }, [teams, search]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <Shield className="w-8 h-8 text-[#C9A227]" /> إدارة الفرق
          </h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => excelRef.current?.click()} className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm flex items-center gap-2 hover:bg-[#b89420] transition">
              <Upload className="w-4 h-4" /> استيراد Excel
            </button>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Plus className="w-4 h-4" /> إضافة فرقة
            </button>
            {teams.length > 0 && (
              <>
                <button onClick={exportExcel} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                  <Download className="w-4 h-4" /> تصدير
                </button>
                <button onClick={() => confirm("تأكيد؟") && setTeams([])} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition">
                  <Trash2 className="w-4 h-4" /> تفريغ
                </button>
              </>
            )}
          </div>
        </div>

        {teams.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
              <div className="text-3xl font-bold text-[#C9A227]">{teams.length}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي الفرق</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-blue-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{teams.reduce((s, t) => s + t.technicians.length, 0)}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي الفنين</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-green-200 text-center">
              <div className="text-3xl font-bold text-green-600">{teams.reduce((s, t) => s + t.schools.length, 0)}</div>
              <div className="text-xs text-gray-500 mt-1">إجمالي المدارس</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-purple-200 text-center">
              <div className="text-3xl font-bold text-purple-600">{teams.filter((t) => t.schools.length >= 25).length}</div>
              <div className="text-xs text-gray-500 mt-1">فرق كاملة (25+)</div>
            </div>
          </div>
        )}

        {teams.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم الفرقة أو المشرف..." className="w-full md:w-96 pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
          </div>
        )}

        {teams.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
            <Shield className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد فرق مسجلة</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => excelRef.current?.click()} className="px-6 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold hover:bg-[#b89420] transition">استيراد من Excel</button>
              <button onClick={() => setShowAdd(true)} className="px-6 py-3 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold hover:bg-[#2C1810] transition">إضافة يدوية</button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-[#C9A227]/10 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#C9A227]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#2C1810]">{t.name}</h3>
                      <p className="text-xs text-gray-500">{t.schools.length} مدرسة | {t.technicians.length} فني</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${t.schools.length >= 25 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {t.schools.length >= 25 ? "فرقة كاملة" : "ناقصة"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* المشرف والسيارة */}
                  <div className="bg-[#FAF7F2] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-4 h-4 text-[#C9A227]" />
                      <span className="font-bold text-sm text-[#2C1810]">المشرف</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{t.supervisor}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Car className="w-3 h-3" /> {t.vehicle || "—"}
                    </div>
                  </div>

                  {/* الفنيون */}
                  <div className="bg-[#FAF7F2] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-[#C9A227]" />
                      <span className="font-bold text-sm text-[#2C1810]">الفنيون ({t.technicians.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {t.technicians.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">{tech}</span>
                      ))}
                      {t.technicians.length === 0 && <span className="text-xs text-gray-400">لا يوجد فنيون</span>}
                    </div>
                  </div>

                  {/* المدارس */}
                  <div className="bg-[#FAF7F2] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <School className="w-4 h-4 text-[#C9A227]" />
                      <span className="font-bold text-sm text-[#2C1810]">المدارس ({t.schools.length})</span>
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-1">
                      {t.schools.slice(0, 8).map((sch, i) => (
                        <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> {sch}
                        </div>
                      ))}
                      {t.schools.length > 8 && <div className="text-[10px] text-gray-400">+ {t.schools.length - 8} مدرسة أخرى</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">إضافة فرقة جديدة</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="اسم الفرقة *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="اسم المشرف *" value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="رقم / نوع السيارة" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="الفنيون (افصل بينهم بفاصلة)" value={form.technicians} onChange={(e) => setForm({ ...form, technicians: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2" />
              <textarea placeholder="المدارس (افصل بينها بفاصلة) — 25 مدرسة لكل فرقة" value={form.schools} onChange={(e) => setForm({ ...form, schools: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2 h-24 resize-none" />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addManual} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ الفرقة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}