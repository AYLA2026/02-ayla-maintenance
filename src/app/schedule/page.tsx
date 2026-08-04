"use client";

import { useAuth } from "@/lib/auth-context";
import { Calendar, Users, Building2, Wrench, RotateCcw, Save, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ScheduleDay {
  date: string;
  dayName: string;
  isFriday: boolean;
  teamId: string | null;
  schools: string[];
  taskType: string;
  status: "مجدول" | "منفذ" | "متأخر";
}

const SCHOOLS_POOL = [
  "مجمع مدارس الأمل", "مدرسة النور الابتدائية", "مدرسة المستقبل الثانوية",
  "مدرسة الابتكار المتوسطة", "مدرسة الفجر الابتدائية", "مدرسة النخبة الثانوية",
  "مجمع الرواد التعليمي", "مدرسة الرياض الابتدائية", "مدرسة الفيصلية المتوسطة",
  "مدرسة الغد الثانوية", "مجمع العلوم الحديثة", "مدرسة الأمل الخاصة",
  "مدرسة التحفيظ الابتدائية", "مدرسة النور الثانوية", "مدرسة السلام المتوسطة",
  "مجمع التربية النموذجي", "مدرسة الابتكار الابتدائية", "مدرسة الفتح الثانوية",
  "مدرسة الزهراء المتوسطة", "مدرسة الصفوة الابتدائية", "مجمع الملك سلمان",
  "مدرسة العليا الثانوية", "مدرسة الروضة الابتدائية", "مدرسة المجد المتوسطة",
  "مدرسة الإبداع الثانوية", "مدرسة السعادة الابتدائية", "مدرسة التميز المتوسطة",
  "مدرسة الأمجاد الثانوية", "مدرسة الوسطى الابتدائية", "مدرسة الغيث المتوسطة",
];

const TEAMS = [
  { id: "t1", name: "فريق الصيانة أ", members: 4, status: "متاح" as "متاح" | "مشغول" | "خارج الخدمة" },
  { id: "t2", name: "فريق الصيانة ب", members: 3, status: "متاح" as "متاح" | "مشغول" | "خارج الخدمة" },
  { id: "t3", name: "فريق التكييف ب", members: 2, status: "مشغول" as "متاح" | "مشغول" | "خارج الخدمة" },
  { id: "t4", name: "فريق النظافة ج", members: 6, status: "متاح" as "متاح" | "مشغول" | "خارج الخدمة" },
  { id: "t5", name: "فريق الطوارئ", members: 3, status: "متاح" as "متاح" | "مشغول" | "خارج الخدمة" },
];

const TASK_TYPES = ["صيانة عامة", "كهرباء", "سباكة", "تكييف", "نظافة", "فحص دوري"];

function getDaysInMonth(year: number, month: number): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    const dayOfWeek = date.getDay();
    const iso = date.toISOString().split("T")[0];
    days.push({
      date: iso,
      dayName: date.toLocaleDateString("ar-SA", { weekday: "long" }),
      isFriday: dayOfWeek === 5,
      teamId: null,
      schools: [],
      taskType: "صيانة عامة",
      status: "مجدول",
    });
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function SchedulePage() {
  const { tenant } = useAuth();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(8);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSchedule(year, month);
  }, []);

  const loadSchedule = (y: number, m: number) => {
    const key = `ayla-schedule-${y}-${m}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setSchedule(JSON.parse(saved));
    } else {
      setSchedule(getDaysInMonth(y, m));
    }
  };

  const generateSchedule = () => {
    const days = getDaysInMonth(year, month);
    const availableTeams = TEAMS.filter((t) => t.status !== "خارج الخدمة");
    if (availableTeams.length === 0) return;

    let teamIndex = 0;
    let schoolIndex = 0;
    const chunkSize = 25;

    const updated = days.map((day) => {
      if (day.isFriday) return { ...day, teamId: null, schools: [], taskType: "راحة" };

      const team = availableTeams[teamIndex % availableTeams.length];
      const schoolsForDay: string[] = [];
      const dailyCount = Math.ceil(chunkSize / 20);

      for (let i = 0; i < dailyCount && schoolIndex < SCHOOLS_POOL.length; i++) {
        schoolsForDay.push(SCHOOLS_POOL[schoolIndex]);
        schoolIndex++;
      }

      const task = TASK_TYPES[teamIndex % TASK_TYPES.length];
      teamIndex++;
      return { ...day, teamId: team.id, schools: schoolsForDay, taskType: task };
    });

    setSchedule(updated);
    setSaved(false);
  };

  const saveSchedule = () => {
    const key = `ayla-schedule-${year}-${month}`;
    localStorage.setItem(key, JSON.stringify(schedule));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateDay = (index: number, updates: Partial<ScheduleDay>) => {
    const next = [...schedule];
    next[index] = { ...next[index], ...updates };
    setSchedule(next);
    setSaved(false);
  };

  const workDays = schedule.filter((d) => !d.isFriday);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A0F09]">جدولة الصيانة الدورية</h1>
          <p className="text-gray-500 text-sm mt-1">توزيع 25 مدرسة لكل فرقة شهرياً — {tenant?.nameAr}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={generateSchedule} className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm hover:bg-[#b89420] transition">
            <RotateCcw className="w-4 h-4" /> توليد جدول {month}/{year}
          </button>
          <button onClick={saveSchedule} className="flex items-center gap-2 px-4 py-2.5 bg-[#1A0F09] text-white rounded-xl font-bold text-sm hover:bg-[#3d2317] transition">
            {saved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            {saved ? "تم الحفظ" : "حفظ الجدول"}
          </button>
        </div>
      </div>

      {/* اختيار الشهر */}
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <Calendar className="w-5 h-5 text-[#C9A227]" />
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-[#1A0F09]">السنة</label>
          <input type="number" value={year} onChange={(e) => { const y = Number(e.target.value); setYear(y); loadSchedule(y, month); }}
            className="w-20 px-3 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-[#1A0F09]">الشهر</label>
          <select value={month} onChange={(e) => { const m = Number(e.target.value); setMonth(m); loadSchedule(year, m); }}
            className="px-3 py-2 rounded-xl border border-gray-200 focus:border-[#C9A227] outline-none text-sm">
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
        </div>
        <div className="mr-auto text-xs text-gray-500">أيام العمل: {workDays.length} | الجمعة: {schedule.filter((d) => d.isFriday).length}</div>
      </div>

      {/* ملخص الفرق */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TEAMS.map((t) => {
          const assignedDays = schedule.filter((d) => d.teamId === t.id).length;
          return (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A0F09] flex items-center justify-center text-[#C9A227] font-bold text-xs">{t.name.charAt(t.name.length - 1)}</div>
              <div>
                <p className="text-sm font-bold text-[#1A0F09]">{t.name}</p>
                <p className="text-[10px] text-gray-500">{assignedDays} أيام • {t.members} فنيين</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7F2] text-gray-500">
                <th className="text-right py-3 px-4 font-bold">اليوم</th>
                <th className="text-right py-3 px-4 font-bold">التاريخ</th>
                <th className="text-right py-3 px-4 font-bold">الفريق</th>
                <th className="text-right py-3 px-4 font-bold">المهمة</th>
                <th className="text-right py-3 px-4 font-bold">المدارس</th>
                <th className="text-right py-3 px-4 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((day, idx) => {
                const team = TEAMS.find((t) => t.id === day.teamId);
                return (
                  <tr key={day.date} className={`border-b border-gray-50 ${day.isFriday ? "bg-gray-50 opacity-60" : "hover:bg-[#FAF7F2]"} transition`}>
                    <td className="py-3 px-4 font-bold text-[#1A0F09]">
                      {day.dayName}
                      {day.isFriday && <span className="text-[10px] text-red-500 mr-1">(إجازة)</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{day.date}</td>
                    <td className="py-3 px-4">
                      {day.isFriday ? <span className="text-gray-400 text-xs">—</span> : (
                        <select value={day.teamId || ""} onChange={(e) => updateDay(idx, { teamId: e.target.value || null })}
                          className="px-2 py-1 rounded-lg border border-gray-200 text-xs focus:border-[#C9A227] outline-none bg-white">
                          <option value="">اختر فريق</option>
                          {TEAMS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {day.isFriday ? <span className="text-gray-400 text-xs">—</span> : (
                        <select value={day.taskType} onChange={(e) => updateDay(idx, { taskType: e.target.value })}
                          className="px-2 py-1 rounded-lg border border-gray-200 text-xs focus:border-[#C9A227] outline-none bg-white">
                          {TASK_TYPES.map((tt) => <option key={tt} value={tt}>{tt}</option>)}
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {day.isFriday ? <span className="text-gray-400 text-xs">—</span> : (
                        <div className="flex flex-wrap gap-1">
                          {day.schools.length > 0 ? day.schools.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">{s}</span>
                          )) : <span className="text-gray-400 text-xs">لا توجد</span>}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select value={day.status} onChange={(e) => updateDay(idx, { status: e.target.value as any })}
                        className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none ${day.status === "منفذ" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : day.status === "متأخر" ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                        <option value="مجدول">مجدول</option>
                        <option value="منفذ">منفذ</option>
                        <option value="متأخر">متأخر</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}