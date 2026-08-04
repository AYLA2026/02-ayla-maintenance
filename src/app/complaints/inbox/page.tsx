"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Plus, Wifi, WifiOff, RotateCcw, CheckCircle } from "lucide-react";
import { getOfflineComplaints, addOfflineComplaint, distributeComplaints, seedDemoData, updateComplaint, type OfflineComplaint } from "@/lib/offline-store";

export default function ComplaintsInboxPage() {
  const { tenant } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [complaints, setComplaints] = useState<OfflineComplaint[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [filterStatus, setFilterStatus] = useState("الكل");

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    seedDemoData();
    setComplaints(getOfflineComplaints());
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);

  const refresh = () => setComplaints(getOfflineComplaints());

  const [form, setForm] = useState({
    title: "", school: "", schoolRef: "", type: "صيانة", priority: "متوسط", description: "", source: "manual" as "whatsapp" | "education_app" | "manual",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOfflineComplaint({ title: form.title, school: form.school, schoolRef: form.schoolRef, type: form.type, priority: form.priority, status: "جديد", description: form.description, source: form.source });
    distributeComplaints();
    setForm({ title: "", school: "", schoolRef: "", type: "صيانة", priority: "متوسط", description: "", source: "manual" });
    setShowForm(false);
    refresh();
  };

  const handleStatusChange = (id: string, newStatus: string) => { updateComplaint(id, { status: newStatus }); refresh(); };

  const filtered = complaints.filter((c) => filterStatus === "الكل" || c.status === filterStatus);

  const getPriorityColor = (p: string) => { if (p === "عالي") return "bg-red-100 text-red-600"; if (p === "متوسط") return "bg-amber-100 text-amber-600"; return "bg-blue-100 text-blue-600"; };
  const getStatusColor = (s: string) => { if (s === "تم") return "bg-emerald-100 text-emerald-700"; if (s === "قيد العمل") return "bg-blue-100 text-blue-700"; return "bg-amber-100 text-amber-700"; };
  const getSourceBadge = (source: string) => {
    if (source === "whatsapp") return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">واتساب</span>;
    if (source === "education_app") return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">تعليم</span>;
    return <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">يدوي</span>;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A0F09]">سجل البلاغات</h1>
          <p className="text-gray-500 text-sm mt-1">إدارة بلاغات الصيانة والنظافة والتكييف — {tenant?.nameAr}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}{isOnline ? "متصل" : "غير متصل — يعمل Offline"}</div>
          <button onClick={refresh} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"><RotateCcw className="w-4 h-4 text-gray-500" /></button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-3 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm hover:bg-[#b89420] transition shadow-lg shadow-[#C9A227]/20"><Plus className="w-4 h-4" /> {showForm ? "إلغاء" : "بلاغ جديد"}</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1A0F09] mb-4">إضافة بلاغ جديد</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-[#1A0F09] mb-1">عنوان البلاغ</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition" placeholder="مثال: تسرب مياه في مبنى 12" /></div>
            <div><label className="block text-sm font-bold text-[#1A0F09] mb-1">المدرسة / المبنى</label><input required value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none transition" placeholder="مثال: مدرسة الأمل" /></div>
            <div><label className="block text-sm font-bold text-[#1A0F09] mb-1">الرقم المرجعي للمدرسة</label><input required value={form.schoolRef} onChange={(e) => setForm({ ...form, schoolRef: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none transition" placeholder="مثال: REF-1001" /></div>
            <div><label className="block text-sm font-bold text-[#1A0F09] mb-1">مصدر البلاغ</label><select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as typeof form.source })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none transition"><option value="manual">يدوي</option><option value="whatsapp">واتساب</option><option value="education_app">منصة التعليم</option></select></div>
            <div><label className="block text-sm font-bold text-[#1A0F09] mb-1">نوع البلاغ</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none transition"><option>صيانة</option><option>نظافة</option><option>تكييف</option><option>كهرباء</option><option>سباكة</option></select></div>
            <div><label className="block text-sm font-bold text-[#1A0F09] mb-1">الأولوية</label><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none transition"><option>عالي</option><option>متوسط</option><option>منخفض</option></select></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold text-[#1A0F09] mb-1">وصف تفصيلي</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none transition h-24 resize-none" placeholder="وصف المشكلة بالتفصيل..." /></div>
            <div className="md:col-span-2"><button type="submit" className="px-6 py-3 bg-[#1A0F09] text-white rounded-xl font-bold text-sm hover:bg-[#3d2317] transition">حفظ البلاغ + توزيع ذكي</button></div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["الكل", "جديد", "قيد العمل", "تم"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${filterStatus === s ? "bg-[#1A0F09] text-white border-[#1A0F09]" : "bg-white text-gray-500 border-gray-200 hover:border-[#C9A227]"}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-[#FAF7F2] text-gray-500">
              <th className="text-right py-3 px-4 font-bold">#</th>
              <th className="text-right py-3 px-4 font-bold">البلاغ</th>
              <th className="text-right py-3 px-4 font-bold">المدرسة</th>
              <th className="text-right py-3 px-4 font-bold">المرجعي</th>
              <th className="text-right py-3 px-4 font-bold">المصدر</th>
              <th className="text-right py-3 px-4 font-bold">النوع</th>
              <th className="text-right py-3 px-4 font-bold">الأولوية</th>
              <th className="text-right py-3 px-4 font-bold">الفريق</th>
              <th className="text-right py-3 px-4 font-bold">الحالة</th>
              <th className="text-right py-3 px-4 font-bold">الإجراء</th>
            </tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-[#FAF7F2] transition">
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{c.id.slice(-6)}</td>
                  <td className="py-3 px-4 font-bold text-[#1A0F09]">{c.title}</td>
                  <td className="py-3 px-4 text-gray-500">{c.school}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-mono font-bold">{c.schoolRef || "-"}</span></td>
                  <td className="py-3 px-4">{getSourceBadge(c.source)}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-bold">{c.type}</span></td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityColor(c.priority)}`}>{c.priority}</span></td>
                  <td className="py-3 px-4 text-xs text-gray-500">{c.team || "-"}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(c.status)}`}>{c.status}</span></td>
                  <td className="py-3 px-4">
                    {c.status === "جديد" && <button onClick={() => handleStatusChange(c.id, "قيد العمل")} className="text-xs font-bold text-[#C9A227] hover:underline">بدء العمل</button>}
                    {c.status === "قيد العمل" && <button onClick={() => handleStatusChange(c.id, "تم")} className="text-xs font-bold text-emerald-600 hover:underline">إغلاق</button>}
                    {c.status === "تم" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={10} className="py-12 text-center text-gray-400 text-sm">لا توجد بلاغات</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}