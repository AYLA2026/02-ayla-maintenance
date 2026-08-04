import os

base = os.path.dirname(os.path.abspath(__file__))

def w(path_rel, content):
    full = os.path.join(base, path_rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print('✅', path_rel)

# ─── 1. offline-store.ts ───
w('src/lib/offline-store.ts', '''
export interface OfflineComplaint {
  id: string;
  title: string;
  school: string;
  schoolRef: string;
  type: string;
  priority: string;
  status: string;
  description?: string;
  createdAt: string;
  assignedTo?: string;
  team?: string;
  distributed: boolean;
  synced: boolean;
  source: "whatsapp" | "education_app" | "manual" | "smart_distributor";
}

export interface Team {
  id: string;
  name: string;
  specialty: string[];
  status: "متاح" | "مشغول" | "خارج الخدمة";
  members: number;
  currentLoad: number;
  schools: string[];
}

const STORAGE_KEY = "ayla-offline-complaints";
const TEAMS_KEY = "ayla-teams";

export function getTeams(): Team[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TEAMS_KEY);
  if (raw) return JSON.parse(raw);
  const defaultTeams: Team[] = [
    { id: "t1", name: "فريق الصيانة أ", specialty: ["صيانة", "كهرباء"], status: "متاح", members: 4, currentLoad: 2, schools: ["مجمع مدارس الأمل", "مدرسة النور الابتدائية", "مدرسة الفجر الابتدائية", "مدرسة النخبة الثانوية", "مجمع الرواد التعليمي"] },
    { id: "t2", name: "فريق الصيانة ب", specialty: ["صيانة", "سباكة"], status: "متاح", members: 3, currentLoad: 1, schools: ["مدرسة المستقبل الثانوية", "مدرسة الابتكار المتوسطة", "مدرسة الرياض الابتدائية", "مدرسة الفيصلية المتوسطة", "مدرسة الغد الثانوية"] },
    { id: "t3", name: "فريق التكييف ب", specialty: ["تكييف"], status: "مشغول", members: 2, currentLoad: 4, schools: ["مجمع العلوم الحديثة", "مدرسة الأمل الخاصة", "مدرسة التحفيظ الابتدائية", "مدرسة النور الثانوية", "مدرسة السلام المتوسطة"] },
    { id: "t4", name: "فريق النظافة ج", specialty: ["نظافة"], status: "متاح", members: 6, currentLoad: 0, schools: ["مجمع التربية النموذجي", "مدرسة الابتكار الابتدائية", "مدرسة الفتح الثانوية", "مدرسة الزهراء المتوسطة", "مدرسة الصفوة الابتدائية"] },
    { id: "t5", name: "فريق الطوارئ", specialty: ["صيانة", "تكييف", "كهرباء"], status: "متاح", members: 3, currentLoad: 1, schools: ["مجمع الملك سلمان", "مدرسة العليا الثانوية", "مدرسة الروضة الابتدائية", "مدرسة المجد المتوسطة", "مدرسة الإبداع الثانوية"] },
  ];
  localStorage.setItem(TEAMS_KEY, JSON.stringify(defaultTeams));
  return defaultTeams;
}

export function getOfflineComplaints(): OfflineComplaint[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addOfflineComplaint(data: Omit<OfflineComplaint, "id" | "createdAt" | "distributed" | "synced">): OfflineComplaint {
  const complaints = getOfflineComplaints();
  const newC: OfflineComplaint = {
    ...data,
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    distributed: false,
    synced: false,
  };
  complaints.unshift(newC);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return newC;
}

export function updateComplaint(id: string, updates: Partial<OfflineComplaint>) {
  const complaints = getOfflineComplaints();
  const idx = complaints.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  complaints[idx] = { ...complaints[idx], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return complaints[idx];
}

function findBestTeam(complaint: OfflineComplaint, teams: Team[]): Team | null {
  const schoolTeam = teams.find((t) => t.schools.includes(complaint.school) && t.status !== "خارج الخدمة");
  if (schoolTeam) return schoolTeam;
  const typeMap: Record<string, string[]> = {
    صيانة: ["فريق الصيانة أ", "فريق الصيانة ب", "فريق الطوارئ"],
    نظافة: ["فريق النظافة ج"],
    تكييف: ["فريق التكييف ب", "فريق الطوارئ"],
    كهرباء: ["فريق الصيانة أ", "فريق الطوارئ"],
    سباكة: ["فريق الصيانة ب", "فريق الطوارئ"],
  };
  const candidates = typeMap[complaint.type] || teams.map((t) => t.name);
  const available = teams.filter((t) => candidates.includes(t.name) && t.status === "متاح");
  if (available.length === 0) return teams.find((t) => candidates.includes(t.name)) || null;
  return available.sort((a, b) => a.currentLoad - b.currentLoad)[0];
}

export function distributeComplaints(): { complaints: OfflineComplaint[]; distributed: number } {
  const teams = getTeams();
  const complaints = getOfflineComplaints();
  let count = 0;
  const updated = complaints.map((c) => {
    if (c.distributed && c.team) return c;
    const team = findBestTeam(c, teams);
    if (team) {
      count++;
      return { ...c, assignedTo: team.id, team: team.name, distributed: true, status: "قيد العمل" };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return { complaints: updated, distributed: count };
}

export function seedDemoData() {
  const existing = getOfflineComplaints();
  if (existing.length > 0) return;
  const demo: Omit<OfflineComplaint, "id" | "createdAt" | "distributed" | "synced">[] = [
    { title: "تسرب مياه في مبنى الإدارة - الدور الثاني", school: "مجمع مدارس الأمل", schoolRef: "REF-1001", type: "سباكة", priority: "عالي", status: "قيد العمل", description: "تسرب خلف الحمام الرئيسي", team: "فريق الصيانة ب", assignedTo: "t2", distributed: true, synced: true, source: "whatsapp" },
    { title: "عطل مكيف قاعة الاجتماعات", school: "مدرسة النور الابتدائية", schoolRef: "REF-1002", type: "تكييف", priority: "عالي", status: "جديد", description: "لا يبرد، يحتاج فحص فريون", source: "education_app" },
    { title: "تبديل لمبات LED الممر الشرقي", school: "مدرسة المستقبل الثانوية", schoolRef: "REF-1003", type: "كهرباء", priority: "متوسط", status: "جديد", description: "8 لمبات محروقة", source: "manual" },
    { title: "تنظيف شامل لقاعة الملك فهد", school: "مجمع مدارس الأمل", schoolRef: "REF-1001", type: "نظافة", priority: "منخفض", status: "جديد", description: "مطلوب بعد الاحتفال", source: "whatsapp" },
    { title: "كسر باب غرفة الخوادم", school: "مدرسة المستقبل الثانوية", schoolRef: "REF-1003", type: "صيانة", priority: "عالي", status: "جديد", description: "الباب لا يغلق، يحتاج قفل جديد", source: "education_app" },
    { title: "صيانة دورية لمولد الكهرباء", school: "مدرسة النور الابتدائية", schoolRef: "REF-1002", type: "صيانة", priority: "متوسط", status: "جديد", description: "فحص زيت + فلتر", source: "manual" },
  ];
  demo.forEach((d, i) => {
    const c: OfflineComplaint = { ...d, id: `demo-${i + 1}`, createdAt: new Date(Date.now() - i * 3600000).toISOString(), distributed: !!d.distributed, synced: !!d.synced };
    if (!c.distributed) {
      const teams = getTeams();
      const team = findBestTeam(c, teams);
      if (team) { c.assignedTo = team.id; c.team = team.name; c.distributed = true; }
    }
    const all = getOfflineComplaints();
    all.push(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  });
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TEAMS_KEY);
}
''')

# ─── 2. complaints/distributor/page.tsx ───
w('src/app/complaints/distributor/page.tsx', '''
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Settings, ArrowRight, Users, AlertTriangle, RotateCcw, Zap, MapPin, Wifi, WifiOff, MessageCircle, School } from "lucide-react";
import { getOfflineComplaints, distributeComplaints, getTeams, type OfflineComplaint, type Team } from "@/lib/offline-store";

export default function DistributorPage() {
  const { tenant } = useAuth();
  const [isDistributing, setIsDistributing] = useState(false);
  const [logs, setLogs] = useState<OfflineComplaint[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState({ pending: 0, available: 0, today: 0, whatsapp: 0, education: 0 });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    refresh();
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);

  const refresh = () => {
    const complaints = getOfflineComplaints();
    const allTeams = getTeams();
    setLogs(complaints.filter((c) => c.distributed).slice(0, 20));
    setTeams(allTeams);
    setStats({
      pending: complaints.filter((c) => c.status === "جديد").length,
      available: allTeams.filter((t) => t.status === "متاح").length,
      today: complaints.filter((c) => c.distributed).length,
      whatsapp: complaints.filter((c) => c.source === "whatsapp").length,
      education: complaints.filter((c) => c.source === "education_app").length,
    });
  };

  const handleDistribute = () => {
    setIsDistributing(true);
    setTimeout(() => { distributeComplaints(); refresh(); setIsDistributing(false); }, 1500);
  };

  const getSourceIcon = (source: string) => {
    if (source === "whatsapp") return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
    if (source === "education_app") return <School className="w-3.5 h-3.5 text-blue-500" />;
    return <Zap className="w-3.5 h-3.5 text-amber-500" />;
  };

  const getSourceLabel = (source: string) => {
    if (source === "whatsapp") return "واتساب";
    if (source === "education_app") return "منصة التعليم";
    if (source === "smart_distributor") return "موزع ذكي";
    return "يدوي";
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A0F09]">الموزع الذكي 24/7</h1>
          <p className="text-gray-500 text-sm mt-1">استقبال وتوزيع تلقائي — يعمل Offline وOnline — {tenant?.nameAr}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? "متصل — الاستقبال نشط" : "غير متصل — يعمل Offline"}
          </div>
          <button onClick={refresh} className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"><RotateCcw className="w-4 h-4 text-gray-500" /></button>
          <button onClick={handleDistribute} disabled={isDistributing} className="px-6 py-3 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm hover:bg-[#b89420] transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#C9A227]/20">
            <Settings className={`w-5 h-5 ${isDistributing ? "animate-spin" : ""}`} />
            {isDistributing ? "جاري التوزيع..." : "توزيع ذكي"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-amber-700" /></div><span className="text-sm text-gray-500">قيد الانتظار</span></div>
          <p className="text-3xl font-black text-[#1A0F09]">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Users className="w-5 h-5 text-emerald-700" /></div><span className="text-sm text-gray-500">الفرق المتاحة</span></div>
          <p className="text-3xl font-black text-[#1A0F09]">{stats.available}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Zap className="w-5 h-5 text-blue-700" /></div><span className="text-sm text-gray-500">موزعة</span></div>
          <p className="text-3xl font-black text-[#1A0F09]">{stats.today}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-emerald-600" /></div><span className="text-sm text-gray-500">واتساب</span></div>
          <p className="text-3xl font-black text-emerald-600">{stats.whatsapp}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><School className="w-5 h-5 text-blue-600" /></div><span className="text-sm text-gray-500">منصة التعليم</span></div>
          <p className="text-3xl font-black text-blue-600">{stats.education}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-[#1A0F09] mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#C9A227]" /> سجل التوزيع</h3>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            {logs.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0"><ArrowRight className="w-4 h-4 text-[#C9A227]" /></div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1A0F09] truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.team || "غير موزع"} • {item.school} {item.schoolRef && <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded mr-1">{item.schoolRef}</span>}<span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded mr-1">ذكي</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100" title={getSourceLabel(item.source)}>{getSourceIcon(item.source)}<span className="text-[10px] text-gray-500">{getSourceLabel(item.source)}</span></div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">{item.status}</span>
                </div>
              </div>
            ))}
            {logs.length === 0 && <p className="text-center text-gray-400 text-sm py-8">لا توجد بلاغات موزعة بعد</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-[#1A0F09] mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-[#C9A227]" /> حالة الفرق والمدارس</h3>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            {teams.map((t) => (
              <div key={t.id} className="p-4 bg-[#FAF7F2] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-bold text-sm text-[#1A0F09]">{t.name}</p><p className="text-xs text-gray-500">{t.specialty.join(" + ")} • {t.members} أعضاء</p></div>
                  <div className="flex items-center gap-3"><div className="text-xs text-gray-500">حمل: {t.currentLoad}</div><span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${t.status === "متاح" ? "bg-emerald-100 text-emerald-700" : t.status === "مشغول" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{t.status}</span></div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">{t.schools.map((s, i) => <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
''')

# ─── 3. complaints/inbox/page.tsx ───
w('src/app/complaints/inbox/page.tsx', '''
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
''')

print("✅ تم إنشاء 3 ملفات:")
print("   - src/lib/offline-store.ts")
print("   - src/app/complaints/distributor/page.tsx")
print("   - src/app/complaints/inbox/page.tsx")