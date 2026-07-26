"use client";

import { useState, useMemo } from "react";
import {
  Calendar, Shield, School, CheckCircle, Clock
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  supervisor: string;
  schools: string[];
}

interface DaySchedule {
  day: number;
  dayName: string;
  schools: string[];
  completed: boolean;
}

interface MonthSchedule {
  teamId: string;
  month: string;
  days: DaySchedule[];
}

const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function generateSchedule(team: Team, year: number, month: number): DaySchedule[] {
  const daysCount = getDaysInMonth(year, month);
  const schools = [...team.schools];
  const days: DaySchedule[] = [];
  let schoolIndex = 0;

  for (let d = 1; d <= daysCount; d++) {
    const date = new Date(year, month - 1, d);
    const dayOfWeek = date.getDay();
    const dayName = DAY_NAMES[dayOfWeek];

    if (dayOfWeek === 5) {
      days.push({ day: d, dayName, schools: [], completed: false });
      continue;
    }

    const assigned: string[] = [];
    const perDay = Math.max(1, Math.ceil(schools.length / (daysCount - Math.floor(daysCount / 7))));
    for (let i = 0; i < perDay && schoolIndex < schools.length; i++) {
      assigned.push(schools[schoolIndex]);
      schoolIndex++;
    }
    if (schoolIndex >= schools.length) schoolIndex = 0;

    days.push({ day: d, dayName, schools: assigned, completed: false });
  }
  return days;
}

export default function SchedulePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [schedules, setSchedules] = useState<MonthSchedule[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(7);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [showTeamAdd, setShowTeamAdd] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: "", supervisor: "", schools: "" });

  const addTeam = () => {
    if (!teamForm.name.trim() || !teamForm.supervisor.trim()) return alert("اسم الفرقة والمشرف مطلوبان");
    const schools = teamForm.schools.split(",").map((s) => s.trim()).filter(Boolean);
    const newTeam: Team = {
      id: `schteam-${Date.now()}`,
      name: teamForm.name,
      supervisor: teamForm.supervisor,
      schools,
    };
    setTeams((prev) => [...prev, newTeam]);
    setTeamForm({ name: "", supervisor: "", schools: "" });
    setShowTeamAdd(false);
  };

  const generateForTeam = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    const days = generateSchedule(team, year, month);
    setSchedules((prev) => {
      const filtered = prev.filter((s) => !(s.teamId === teamId && s.month === `${year}-${month}`));
      return [...filtered, { teamId, month: `${year}-${month}`, days }];
    });
  };

  const toggleDay = (teamId: string, day: number) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.teamId !== teamId || s.month !== `${year}-${month}`) return s;
        return {
          ...s,
          days: s.days.map((d) => (d.day === day ? { ...d, completed: !d.completed } : d)),
        };
      })
    );
  };

  const currentSchedule = useMemo(() => {
    return schedules.find((s) => s.teamId === selectedTeam && s.month === `${year}-${month}`);
  }, [schedules, selectedTeam, year, month]);

  const selectedTeamData = teams.find((t) => t.id === selectedTeam);

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
            <Calendar className="w-8 h-8 text-[#C9A227]" /> الصيانة المجدولة
          </h1>
          <div className="flex gap-2">
            <button onClick={() => setShowTeamAdd(true)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Shield className="w-4 h-4" /> إضافة فرقة
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs text-gray-500 block mb-1">الفرقة</label>
              <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                <option value="">اختر الفرقة</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.supervisor}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">السنة</label>
              <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">الشهر</label>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm bg-white focus:outline-none focus:border-[#C9A227]">
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => selectedTeam && generateForTeam(selectedTeam)}
              disabled={!selectedTeam}
              className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition disabled:opacity-50"
            >
              توليد الجدول
            </button>
          </div>
        </div>

        {selectedTeamData && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-4 mb-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C9A227]" />
              <span className="font-bold text-[#2C1810]">{selectedTeamData.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-bold">المشرف:</span> {selectedTeamData.supervisor}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <School className="w-4 h-4 text-green-600" />
              <span>{selectedTeamData.schools.length} مدرسة</span>
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <button onClick={() => setViewMode("calendar")} className={`px-3 py-1 rounded-lg text-xs font-bold ${viewMode === "calendar" ? "bg-[#C9A227] text-[#1A0F09]" : "bg-gray-100 text-gray-600"}`}>تقويم</button>
              <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded-lg text-xs font-bold ${viewMode === "list" ? "bg-[#C9A227] text-[#1A0F09]" : "bg-gray-100 text-gray-600"}`}>قائمة</button>
            </div>
          </div>
        )}

        {!currentSchedule && selectedTeam && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
            <Calendar className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">اضغط "توليد الجدول" لإنشاء جدول الصيانة</p>
          </div>
        )}

        {currentSchedule && viewMode === "calendar" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {currentSchedule.days.map((d) => (
              <div
                key={d.day}
                onClick={() => d.schools.length > 0 && toggleDay(selectedTeam, d.day)}
                className={`rounded-2xl border p-4 min-h-[140px] transition cursor-pointer ${
                  d.dayName === "الجمعة"
                    ? "bg-gray-100 border-gray-200 opacity-60"
                    : d.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-[#C9A227]/10 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-[#2C1810]">{d.day}</span>
                  <span className="text-[10px] text-gray-400">{d.dayName}</span>
                </div>
                {d.dayName === "الجمعة" ? (
                  <div className="text-center text-xs text-gray-400 mt-4">إجازة</div>
                ) : (
                  <>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {d.schools.map((s, i) => (
                        <div key={i} className="text-[10px] text-gray-600 truncate flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#C9A227]" /> {s}
                        </div>
                      ))}
                      {d.schools.length === 0 && <div className="text-[10px] text-gray-400">لا توجد مدارس</div>}
                    </div>
                    {d.schools.length > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        {d.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-[10px] font-bold">{d.completed ? "تمت" : "معلقة"}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {currentSchedule && viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF7F2]">
                <tr>
                  <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">اليوم</th>
                  <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">المدارس</th>
                  <th className="px-4 py-3 text-right font-bold text-[#5C3A2A]">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {currentSchedule.days.filter((d) => d.dayName !== "الجمعة").map((d) => (
                  <tr key={d.day} className="border-t border-[#C9A227]/5 hover:bg-[#FAF7F2]/50 transition">
                    <td className="px-4 py-3 font-bold text-[#2C1810]">{d.dayName}</td>
                    <td className="px-4 py-3 text-gray-600">{d.day} / {month} / {year}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {d.schools.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-[#C9A227]/10 text-[#5C3A2A] text-[10px] font-bold">{s}</span>
                        ))}
                        {d.schools.length === 0 && <span className="text-xs text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleDay(selectedTeam, d.day)} className={`px-3 py-1 rounded-lg text-xs font-bold transition ${d.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {d.completed ? "تمت" : "معلقة"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!selectedTeam && teams.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-12 text-center">
            <Shield className="w-16 h-16 text-[#C9A227]/20 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">لا توجد فرق مسجلة</p>
            <button onClick={() => setShowTeamAdd(true)} className="px-6 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold hover:bg-[#b89420] transition">إضافة فرقة</button>
          </div>
        )}
      </div>

      {showTeamAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTeamAdd(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#2C1810]">إضافة فرقة للصيانة المجدولة</h2>
              <button onClick={() => setShowTeamAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><span className="text-gray-500 text-xl">×</span></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input placeholder="اسم الفرقة *" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <input placeholder="اسم المشرف *" value={teamForm.supervisor} onChange={(e) => setTeamForm({ ...teamForm, supervisor: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
              <textarea placeholder="المدارس (افصل بينها بفاصلة)" value={teamForm.schools} onChange={(e) => setTeamForm({ ...teamForm, schools: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227] h-24 resize-none" />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => setShowTeamAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition">إلغاء</button>
              <button onClick={addTeam} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition">حفظ الفرقة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}