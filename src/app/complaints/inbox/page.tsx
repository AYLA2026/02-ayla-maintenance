"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import {
  Inbox, Plus, X, Download, Upload, Search, Filter,
  AlertCircle, Clock, CheckCircle, UserCheck, Phone,
  MapPin, Calendar, Wrench, ChevronDown, Trash2, Eye
} from "lucide-react";

type Priority = "عاجل" | "عادي" | "منخفض";
type Status = "جديد" | "قيد المراجعة" | "تم التوزيع" | "قيد العمل" | "في الانتظار قطع غيار" | "تم الإنجاز" | "مغلق";
type IssueType = "كهرباء" | "سباكة" | "تكييف" | "معماري" | "نظافة" | "أخرى";

interface Complaint {
  id: string;
  school: string;
  location: string;
  issueType: IssueType;
  description: string;
  priority: Priority;
  status: Status;
  assignedTo: string;
  team: string;
  date: string;
  reporter: string;
  phone: string;
  notes: string;
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

const ISSUE_TYPES: IssueType[] = ["كهرباء", "سباكة", "تكييف", "معماري", "نظافة", "أخرى"];
const PRIORITIES: Priority[] = ["عاجل", "عادي", "منخفض"];
const STATUSES: Status[] = ["جديد", "قيد المراجعة", "تم التوزيع", "قيد العمل", "في الانتظار قطع غيار", "تم الإنجاز", "مغلق"];

const DEFAULT_COMPLAINTS: Complaint[] = [
  {
    id: "BLG-001",
    school: "مدرسة النور الابتدائية",
    location: "الرياض - حي النزهة",
    issueType: "سباكة",
    description: "تسريب مياه في دورة المياه الرئيسية بالطابق الأول",
    priority: "عاجل",
    status: "جديد",
    assignedTo: "",
    team: "",
    date: "2026-07-27",
    reporter: "أحمد العتيبي",
    phone: "0551234567",
    notes: "",
  },
  {
    id: "BLG-002",
    school: "مدرسة الفجر المتوسطة",
    location: "الرياض - حي الروضة",
    issueType: "تكييف",
    description: "تكييف غرفة المعلمين لا يعمل منذ 3 أيام",
    priority: "عادي",
    status: "قيد العمل",
    assignedTo: "خالد السبيعي",
    team: "فرقة الصيانة أ",
    date: "2026-07-26",
    reporter: "محمد الدوسري",
    phone: "0559876543",
    notes: "تم الفحص الأولي وتحديد العطل في الكمبرسر",
  },
  {
    id: "BLG-003",
    school: "مدرسة الرواد الثانوية",
    location: "الرياض - حي العليا",
    issueType: "كهرباء",
    description: "إنارة الملعب الخارجي معطلة بالكامل",
    priority: "منخفض",
    status: "تم الإنجاز",
    assignedTo: "سعد الحربي",
    team: "فرقة الكهرباء",
    date: "2026-07-25",
    reporter: "عبدالله القحطاني",
    phone: "0555551212",
    notes: "تم تغيير اللمبات واختبار النظام بنجاح",
  },
];

export default function ComplaintsInboxPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(DEFAULT_COMPLAINTS);
 useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ayla_complaints", JSON.stringify(complaints));
  }
}, [complaints]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "الكل">("الكل");
  const [filterPriority, setFilterPriority] = useState<Priority | "الكل">("الكل");
  const [filterType, setFilterType] = useState<IssueType | "الكل">("الكل");
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState<Complaint | null>(null);
  const excelRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    school: "", location: "", issueType: "أخرى" as IssueType,
    description: "", priority: "عادي" as Priority, reporter: "", phone: ""
  });

  const [detailForm, setDetailForm] = useState({
    status: "جديد" as Status, assignedTo: "", team: "", notes: ""
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
      const imported: Complaint[] = rows.map((row, idx) => ({
        id: `BLG-${Date.now()}-${idx}`,
        school: String(row[0] || ""),
        location: String(row[1] || ""),
        issueType: (ISSUE_TYPES.includes(row[2]) ? row[2] : "أخرى") as IssueType,
        description: String(row[3] || ""),
        priority: (PRIORITIES.includes(row[4]) ? row[4] : "عادي") as Priority,
        status: "جديد" as Status,  // ← هنا التعديل
        assignedTo: String(row[5] || ""),
        team: String(row[6] || ""),
        date: new Date().toISOString().split("T")[0],
        reporter: String(row[7] || ""),
        phone: String(row[8] || ""),
        notes: "",
      })).filter((c) => c.school.trim());
      setComplaints((prev) => [...prev, ...imported]);
    } catch {
      alert("⚠️ تأكد من تثبيت: npm install xlsx");
    }
  };

  const addManual = () => {
    if (!form.school.trim() || !form.description.trim()) return alert("اسم المدرسة والوصف مطلوبان");
    setComplaints((prev) => [...prev, {
      id: `BLG-${Date.now()}`,
      school: form.school,
      location: form.location,
      issueType: form.issueType,
      description: form.description,
      priority: form.priority,
      status: "جديد" as Status,  // ← هنا التعديل
      assignedTo: "",
      team: "",
      date: new Date().toISOString().split("T")[0],
      reporter: form.reporter,
      phone: form.phone,
      notes: "",
    }]);
    setForm({ school: "", location: "", issueType: "أخرى", description: "", priority: "عادي", reporter: "", phone: "" });
    setShowAdd(false);
  };

  const updateComplaint = (id: string) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? {
      ...c,
      status: detailForm.status,
      assignedTo: detailForm.assignedTo,
      team: detailForm.team,
      notes: detailForm.notes,
    } : c));
    setShowDetail(null);
  };

  const exportExcel = async () => {
    if (complaints.length === 0) return;
    const headers = [["الرقم", "المدرسة", "الموقع", "النوع", "الوصف", "الأولوية", "الحالة", "المسؤول", "الفريق", "التاريخ", "مقدم البلاغ", "الجوال"]];
    const rows = complaints.map((c) => [c.id, c.school, c.location, c.issueType, c.description, c.priority, c.status, c.assignedTo, c.team, c.date, c.reporter, c.phone]);
    await exportWithHeader([...headers, ...rows], "البلاغات_آيلا.xlsx", "البلاغات");
  };

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const q = search.trim();
      const matchSearch = !q || c.school.includes(q) || c.description.includes(q) || c.id.includes(q) || c.assignedTo.includes(q);
      const matchStatus = filterStatus === "الكل" || c.status === filterStatus;
      const matchPriority = filterPriority === "الكل" || c.priority === filterPriority;
      const matchType = filterType === "الكل" || c.issueType === filterType;
      return matchSearch && matchStatus && matchPriority && matchType;
    });
  }, [complaints, search, filterStatus, filterPriority, filterType]);

  const stats = {
    total: complaints.length,
    new: complaints.filter((c) => c.status === "جديد").length,
    inProgress: complaints.filter((c) => c.status === "قيد العمل").length,
    done: complaints.filter((c) => c.status === "تم الإنجاز").length,
    closed: complaints.filter((c) => c.status === "مغلق").length,
  };

  const priorityColor = (p: Priority) => {
    if (p === "عاجل") return "bg-red-50 text-red-700 border-red-200";
    if (p === "عادي") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const statusColor = (s: Status) => {
    switch (s) {
      case "جديد": return "bg-blue-50 text-blue-700 border-blue-200";
      case "قيد المراجعة": return "bg-purple-50 text-purple-700 border-purple-200";
      case "تم التوزيع": return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "قيد العمل": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "في الانتظار قطع غيار": return "bg-orange-50 text-orange-700 border-orange-200";
      case "تم الإنجاز": return "bg-green-50 text-green-700 border-green-200";
      case "مغلق": return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const openDetail = (c: Complaint) => {
    setDetailForm({ status: c.status, assignedTo: c.assignedTo, team: c.team, notes: c.notes });
    setShowDetail(c);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <Inbox className="w-8 h-8 text-[#C9A227]" /> صندوق البلاغات
          </h1>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => excelRef.current?.click()} className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm flex items-center gap-2 hover:bg-[#b89420] transition">
              <Upload className="w-4 h-4" /> استيراد Excel
            </button>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
            <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Plus className="w-4 h-4" /> بلاغ جديد
            </button>
            {complaints.length > 0 && (
              <>
                <button onClick={exportExcel} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
                  <Download className="w-4 h-4" /> تصدير
                </button>
                <button onClick={() => confirm("تأكيد تفريغ جميع البلاغات؟") && setComplaints([])} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition">
                  <Trash2 className="w-4 h-4" /> تفريغ
                </button>
              </>
            )}
          </div>
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
            <div className="text-3xl font-bold text-[#C9A227]">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">إجمالي البلاغات</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-blue-200 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-xs text-gray-500 mt-1">جديدة</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-yellow-200 text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-xs text-gray-500 mt-1">قيد العمل</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-green-200 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.done}</div>
            <div className="text-xs text-gray-500 mt-1">تم الإنجاز</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-600">{stats.closed}</div>
            <div className="text-xs text-gray-500 mt-1">مغلقة</div>
          </div>
        </div>

        {/* فلاتر */}
        <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-[#C9A227]" />
            <span className="font-bold text-sm text-[#2C1810]">فلترة البلاغات</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث باسم المدرسة أو الوصف..." className="w-full pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | "الكل")} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
              <option value="الكل">كل الحالات</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as Priority | "الكل")} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
              <option value="الكل">كل الأولويات</option>
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value as IssueType | "الكل")} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
              <option value="الكل">كل الأنواع</option>
              {ISSUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* الجدول */}
        {complaints.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
            <Inbox className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد بلاغات مسجلة</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => excelRef.current?.click()} className="px-6 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold hover:bg-[#b89420] transition">استيراد من Excel</button>
              <button onClick={() => setShowAdd(true)} className="px-6 py-3 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold hover:bg-[#2C1810] transition">إضافة بلاغ</button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAF7F2]">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الرقم</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المدرسة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">النوع</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الأولوية</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الحالة</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المسؤول</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">التاريخ</th>
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">تفاصيل</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#2C1810]">{c.school}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {c.location}
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-lg bg-[#C9A227]/10 text-[#5C3A2A] text-xs font-bold">{c.issueType}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-bold border ${priorityColor(c.priority)}`}>{c.priority}</span></td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-bold border ${statusColor(c.status)}`}>{c.status}</span></td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{c.assignedTo || "—"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{c.date}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openDetail(c)} className="p-1.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227] hover:bg-[#C9A227]/20 transition">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-[#C9A227]/10 text-xs text-gray-500 text-center">
              عرض {filtered.length} من {complaints.length} بلاغ
            </div>
          </div>
        )}
      </div>

      {/* Modal إضافة بلاغ */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">تسجيل بلاغ جديد</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="اسم المدرسة *" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] md:col-span-2" />
              <input placeholder="الموقع / الحي" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <select value={form.issueType} onChange={(e) => setForm({ ...form, issueType: e.target.value as IssueType })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                {ISSUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <textarea placeholder="وصف البلاغ بالتفصيل *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] h-24 resize-none md:col-span-2" />
              <input placeholder="اسم مقدم البلاغ" value={form.reporter} onChange={(e) => setForm({ ...form, reporter: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="رقم الجوال" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addManual} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ البلاغ</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal تفاصيل البلاغ */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#2C1810]">بلاغ {showDetail.id}</h2>
                <p className="text-xs text-gray-400 mt-1">{showDetail.school}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FAF7F2] rounded-xl p-4">
                <h3 className="font-bold text-sm text-[#2C1810] mb-1">وصف البلاغ:</h3>
                <p className="text-sm text-gray-700">{showDetail.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-[#C9A227]" /> {showDetail.location}</div>
                <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-[#C9A227]" /> {showDetail.phone || "—"}</div>
                <div className="flex items-center gap-2 text-gray-600"><UserCheck className="w-4 h-4 text-[#C9A227]" /> {showDetail.reporter || "—"}</div>
                <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-[#C9A227]" /> {showDetail.date}</div>
              </div>

              <div className="border-t border-[#C9A227]/10 pt-4 space-y-3">
                <h3 className="font-bold text-sm text-[#2C1810] flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#C9A227]" /> تحديث البلاغ
                </h3>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">الحالة</label>
                  <select value={detailForm.status} onChange={(e) => setDetailForm({ ...detailForm, status: e.target.value as Status })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">المسؤول / المشرف</label>
                    <input value={detailForm.assignedTo} onChange={(e) => setDetailForm({ ...detailForm, assignedTo: e.target.value })} placeholder="اسم المشرف" className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">الفريق</label>
                    <input value={detailForm.team} onChange={(e) => setDetailForm({ ...detailForm, team: e.target.value })} placeholder="اسم الفريق" className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">ملاحظات التنفيذ</label>
                  <textarea value={detailForm.notes} onChange={(e) => setDetailForm({ ...detailForm, notes: e.target.value })} placeholder="أضف ملاحظات..." className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] h-20 resize-none" />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowDetail(null)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
                <button onClick={() => updateComplaint(showDetail.id)} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ التحديث</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}