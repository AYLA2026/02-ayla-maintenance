"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import WhatsAppSender from "@/components/notifications/WhatsAppSender";
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, MapPin, Users, ChevronDown, ChevronUp, Trash2, Wrench } from "lucide-react";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  school: string;
  team: string;
  teamCode: string;
  leader: string;
  leaderPhone: string;
  date: string;
  time: string;
  status: "مجدولة" | "قيد التنفيذ" | "مكتملة" | "متأخرة";
  type: string;
  priority: "عادي" | "عاجل" | "حرج";
  notes: string;
}

export default function SchedulePage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "تنظيف الفصول", school: "مدرسة النور", team: "الفريق أ", teamCode: "F1", leader: "أحمد محمد", leaderPhone: "0501111111", date: "2026-07-22", time: "06:00", status: "مجدولة", type: "تنظيف", priority: "عادي", notes: "تنظيف 10 فصول" },
    { id: 2, title: "صيانة مكيفات", school: "مدرسة الفجر", team: "الفريق ب", teamCode: "F2", leader: "محمد سالم", leaderPhone: "0505555555", date: "2026-07-22", time: "08:00", status: "قيد التنفيذ", type: "تكييف", priority: "عاجل", notes: "فحص ضغط الفريون" },
    { id: 3, title: "تفتيش سباكة", school: "مدرسة الروضة", team: "الفريق أ", teamCode: "F1", leader: "أحمد محمد", leaderPhone: "0501111111", date: "2026-07-21", time: "14:00", status: "مكتملة", type: "تفتيش", priority: "عادي", notes: "تم" },
    { id: 4, title: "إصلاح كهرباء", school: "مدرسة الأمل", team: "فريق الطوارئ", teamCode: "F3", leader: "يوسف أحمد", leaderPhone: "0508888888", date: "2026-07-20", time: "10:00", status: "متأخرة", type: "كهرباء", priority: "حرج", notes: "انقطاع جزئي" },
  ]);

  const [filter, setFilter] = useState("الكل");
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("2026-07-22");

  const stats = {
    total: tasks.length,
    scheduled: tasks.filter(t => t.status === "مجدولة").length,
    inProgress: tasks.filter(t => t.status === "قيد التنفيذ").length,
    completed: tasks.filter(t => t.status === "مكتملة").length,
    late: tasks.filter(t => t.status === "متأخرة").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مجدولة": return "bg-blue-100 text-blue-800";
      case "قيد التنفيذ": return "bg-yellow-100 text-yellow-800";
      case "مكتملة": return "bg-green-100 text-green-800";
      case "متأخرة": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "عادي": return "bg-gray-100 text-gray-600";
      case "عاجل": return "bg-orange-100 text-orange-700";
      case "حرج": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const toggleExpand = (id: number) => setExpandedTask(expandedTask === id ? null : id);

  const updateStatus = (id: number, status: Task["status"]) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: number) => {
    if (confirm("هل أنت متأكد؟")) setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = filter === "الكل" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <PageHeader title="الجدولة" subtitle="إدارة المهام والمواعيد اليومية" />
        <div className="flex gap-2">
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-3 py-2 rounded-lg border border-[#C9A227]/20 bg-white text-sm outline-none focus:border-[#C9A227]" />
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm" style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Plus className="w-4 h-4" /> مهمة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard title="إجمالي" value={stats.total.toString()} icon={Calendar} delay={0} />
        <StatCard title="مجدولة" value={stats.scheduled.toString()} icon={Clock} delay={0.1} />
        <StatCard title="قيد التنفيذ" value={stats.inProgress.toString()} icon={AlertCircle} delay={0.2} />
        <StatCard title="مكتملة" value={stats.completed.toString()} icon={CheckCircle} delay={0.3} />
        <StatCard title="متأخرة" value={stats.late.toString()} icon={AlertCircle} delay={0.4} />
      </div>

      <Card className="mb-6">
        <WhatsAppSender />
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#2C1810]">📋 المهام</h2>
        <div className="flex gap-2 flex-wrap">
          {["الكل", "مجدولة", "قيد التنفيذ", "مكتملة", "متأخرة"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? "bg-[#C9A227] text-[#1A0F09]" : "bg-[#C9A227]/10 text-[#5C3A2A]"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div key={task.id} className="rounded-xl border border-[#C9A227]/10" style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
            <div className="p-4 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-[#2C1810] text-sm">{task.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(task.status)}`}>{task.status}</span>
                </div>
                <div className="flex gap-3 text-xs text-[#5C3A2A] flex-wrap">
                  <span>🏫 {task.school}</span>
                  <span>👤 {task.leader} ({task.teamCode})</span>
                  <span>📞 {task.leaderPhone}</span>
                  <span>🕐 {task.date} {task.time}</span>
                </div>
              </div>
              <button onClick={() => toggleExpand(task.id)} className="text-[#5C3A2A]">
                {expandedTask === task.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            {expandedTask === task.id && (
              <div className="px-4 pb-4 border-t border-[#C9A227]/10">
                <p className="text-sm text-[#2C1810] bg-white/50 p-2 rounded-lg mt-3 mb-3">{task.notes}</p>
                <div className="flex gap-2 flex-wrap">
                  {task.status !== "قيد التنفيذ" && <button onClick={() => updateStatus(task.id, "قيد التنفيذ")} className="px-3 py-1.5 rounded-lg text-xs bg-yellow-100 text-yellow-800"><Wrench className="w-3 h-3 inline" /> بدء</button>}
                  {task.status !== "مكتملة" && <button onClick={() => updateStatus(task.id, "مكتملة")} className="px-3 py-1.5 rounded-lg text-xs bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 inline" /> إنجاز</button>}
                  <button onClick={() => deleteTask(task.id)} className="px-3 py-1.5 rounded-lg text-xs bg-red-100 text-red-800 mr-auto"><Trash2 className="w-3 h-3 inline" /> حذف</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}