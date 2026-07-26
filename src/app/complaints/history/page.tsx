"use client";

import { useState, useMemo } from "react";
import {
  History, Download, Search, Filter, MapPin, Calendar,
  CheckCircle, X, Eye
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

const STATUSES: Status[] = ["جديد", "قيد المراجعة", "تم التوزيع", "قيد العمل", "في الانتظار قطع غيار", "تم الإنجاز", "مغلق"];
const PRIORITIES: Priority[] = ["عاجل", "عادي", "منخفض"];
const ISSUE_TYPES: IssueType[] = ["كهرباء", "سباكة", "تكييف", "معماري", "نظافة", "أخرى"];

export default function ComplaintsHistoryPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ayla_complaints");
      if (saved) {
        try { return JSON.parse(saved); } catch { return []; }
      }
    }
    return [];
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "الكل">("الكل");
  const [filterPriority, setFilterPriority] = useState<Priority | "الكل">("الكل");
  const [filterType, setFilterType] = useState<IssueType | "الكل">("الكل");
  const [showDetail, setShowDetail] = useState<Complaint | null>(null);

  const exportExcel = async () => {
    if (complaints.length === 0) return alert("لا توجد بيانات للتصدير");
    const headers = [["الرقم", "المدرسة", "الموقع", "النوع", "الوصف", "الأولوية", "الحالة", "المسؤول", "الفريق", "التاريخ", "مقدم البلاغ", "الجوال"]];
    const rows = complaints.map((c) => [c.id, c.school, c.location, c.issueType, c.description, c.priority, c.status, c.assignedTo, c.team, c.date, c.reporter, c.phone]);
    await exportWithHeader([...headers, ...rows], "سجل_البلاغات_آيلا.xlsx", "السجل");
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
    done: complaints.filter((c) => c.status === "تم الإنجاز").length,
    closed: complaints.filter((c) => c.status === "مغلق").length,
    urgent: complaints.filter((c) => c.priority === "عاجل").length,
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <History className="w-8 h-8 text-[#C9A227]" /> سجل البلاغات
          </h1>
          {complaints.length > 0 && (
            <button onClick={exportExcel} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition">
              <Download className="w-4 h-4" /> تصدير Excel
            </button>
          )}
        </div>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/10 text-center">
            <div className="text-3xl font-bold text-[#C9A227]">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">إجمالي البلاغات</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-green-200 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.done}</div>
            <div className="text-xs text-gray-500 mt-1">تم الإنجاز</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-600">{stats.closed}</div>
            <div className="text-xs text-gray-500 mt-1">مغلقة</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-red-200 text-center">
            <div className="text-3xl font-bold text-red-600">{stats.urgent}</div>
            <div className="text-xs text-gray-500 mt-1">عاجلة</div>
          </div>
        </div>

        {/* فلاتر */}
        <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-[#C9A227]" />
            <span className="font-bold text-sm text-[#2C1810]">فلترة السجل</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="w-full pr-9 pl-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
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
            <History className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">لا يوجد سجل محفوظ</p>
            <p className="text-xs text-gray-400">سيتم حفظ البلاغات تلقائياً عند إضافتها من صندوق البلاغات</p>
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
                    <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">عرض</th>
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
                        <button onClick={() => setShowDetail(c)} className="p-1.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227] hover:bg-[#C9A227]/20 transition">
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

      {/* Modal تفاصيل */}
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
            <div className="space-y-3 text-sm">
              <div className="bg-[#FAF7F2] rounded-xl p-4">
                <h3 className="font-bold text-[#2C1810] mb-1">الوصف:</h3>
                <p className="text-gray-700">{showDetail.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-[#C9A227]" /> {showDetail.location}</div>
                <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-[#C9A227]" /> {showDetail.date}</div>
                <div className="flex items-center gap-2 text-gray-600">الحالة: <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor(showDetail.status)}`}>{showDetail.status}</span></div>
                <div className="flex items-center gap-2 text-gray-600">الأولوية: <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${priorityColor(showDetail.priority)}`}>{showDetail.priority}</span></div>
              </div>
              {showDetail.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <h3 className="font-bold text-xs text-yellow-800 mb-1">ملاحظات التنفيذ:</h3>
                  <p className="text-xs text-yellow-700">{showDetail.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}