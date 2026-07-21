"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Users, UserPlus, MapPin, Calendar, Upload, Download, Plus, Trash2, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef } from "react";

interface TeamMember {
  name: string;
  role: string;
}

interface Team {
  id: number;
  name: string;
  leader: string;
  members: TeamMember[];
  location: string;
  shift: string;
  status: "نشط" | "غير نشط";
}

export default function TeamsPage() {
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "الفريق أ",
      leader: "أحمد محمد",
      members: [
        { name: "خالد عبدالله", role: "فني سباكة" },
        { name: "سعد إبراهيم", role: "عامل نظافة" },
        { name: "عمر فارس", role: "فني كهرباء" },
      ],
      location: "مدرسة النور",
      shift: "الصباحية (6 ص - 2 م)",
      status: "نشط",
    },
    {
      id: 2,
      name: "الفريق ب",
      leader: "محمد سالم",
      members: [
        { name: "يوسف أحمد", role: "فني تكييف" },
        { name: "ناصر علي", role: "عامل صيانة" },
      ],
      location: "مدرسة الفجر",
      shift: "المسائية (2 م - 10 م)",
      status: "نشط",
    },
    {
      id: 3,
      name: "فريق الطوارئ",
      leader: "يوسف أحمد",
      members: [
        { name: "فهد محمد", role: "فني كهرباء" },
        { name: "بندر سعد", role: "فني سباكة" },
      ],
      location: "جميع المواقع",
      shift: "24 ساعة",
      status: "نشط",
    },
  ]);

  const stats = {
    total: teams.length,
    active: teams.filter(t => t.status === "نشط").length,
    totalMembers: teams.reduce((sum, t) => sum + t.members.length, 0),
    locations: [...new Set(teams.map(t => t.location))].length,
  };

  const exportExcel = () => {
    let csv = "الفريق,القائد,الموقع,الوردية,الحالة,العضو,الدور\n";
    teams.forEach(team => {
      team.members.forEach(member => {
        csv += `${team.name},${team.leader},${team.location},${team.shift},${team.status},${member.name},${member.role}\n`;
      });
    });
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    const link = document.createElement("a");
    link.href = csvContent;
    link.download = "الفرق_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const closeModal = () => setShowImportModal(false);

  const parseTeamCSV = (text: string): Partial<Team>[] => {
    const lines = text.trim().split("\n");
    const teamsMap = new Map<string, Partial<Team>>();
    
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length >= 7) {
        const teamName = cols[0]?.trim();
        if (!teamsMap.has(teamName)) {
          teamsMap.set(teamName, {
            name: teamName,
            leader: cols[1]?.trim(),
            location: cols[2]?.trim(),
            shift: cols[3]?.trim(),
            status: (cols[4]?.trim() as Team["status"]) || "نشط",
            members: [],
          });
        }
        const team = teamsMap.get(teamName)!;
        team.members = [...(team.members || []), { name: cols[5]?.trim(), role: cols[6]?.trim() }];
      }
    }
    return Array.from(teamsMap.values());
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const imported = parseTeamCSV(content);
        const newTeams: Team[] = imported.map((t, idx) => ({
          id: teams.length + idx + 1,
          name: t.name || "فريق جديد",
          leader: t.leader || "غير محدد",
          members: t.members || [],
          location: t.location || "غير محدد",
          shift: t.shift || "الصباحية",
          status: t.status || "نشط",
        }));
        setTeams(prev => [...prev, ...newTeams]);
        alert(`✅ تم استيراد ${newTeams.length} فريق بنجاح!`);
      } catch (err) {
        alert("⚠️ خطأ في قراءة الملف. تأكد من تنسيق CSV.");
      }
      setShowImportModal(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const removeTeam = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا الفريق؟")) {
      setTeams(prev => prev.filter(t => t.id !== id));
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedTeam(expandedTeam === id ? null : id);
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <input type="file" ref={fileInputRef} accept=".csv,.xlsx" className="hidden" onChange={handleFileImport} />

      <div className="flex items-center justify-between mb-8">
        <PageHeader title="توزيع الفرق" subtitle="إدارة فرق العمل والورديات" />
        <div className="flex gap-2">
          <button onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" /> استيراد Excel
          </button>
          <button onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" /> تصدير Excel
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <Plus className="w-4 h-4" /> فريق جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الفرق" value={stats.total.toString()} icon={Users} delay={0} />
        <StatCard title="الفرق النشطة" value={stats.active.toString()} icon={UserPlus} delay={0.1} />
        <StatCard title="إجمالي الأعضاء" value={stats.totalMembers.toString()} icon={Users} delay={0.2} />
        <StatCard title="المواقع" value={stats.locations.toString()} icon={MapPin} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
                  <Users className="w-6 h-6 text-[#1A0F09]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810] text-lg" style={{ fontFamily: "Tajawal, sans-serif" }}>{team.name}</h3>
                  <p className="text-xs text-[#5C3A2A]">القائد: {team.leader}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${team.status === "نشط" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {team.status}
                </span>
                <button onClick={() => removeTeam(team.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-[#5C3A2A] mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {team.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {team.shift}</span>
            </div>

            <button onClick={() => toggleExpand(team.id)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-[#C9A227]/5 hover:bg-[#C9A227]/10 transition-colors text-sm text-[#2C1810]">
              <span>الأعضاء ({team.members.length})</span>
              {expandedTeam === team.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedTeam === team.id && (
              <div className="mt-3 space-y-2">
                {team.members.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-[#C9A227]/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#C9A227]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#2C1810]">{member.name}</p>
                        <p className="text-xs text-[#5C3A2A]">{member.role}</p>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-[#C9A227]/10 text-[#C9A227]">
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-lg mx-4 rounded-2xl p-6"
            style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)", border: "1px solid rgba(201, 162, 39, 0.15)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>استيراد الفرق</h3>
              <button onClick={closeModal} className="text-[#5C3A2A] hover:text-[#2C1810]"><Users className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-[#5C3A2A] mb-4">
              اختر ملف CSV يحتوي على بيانات الفرق. التنسيق المطلوب:
            </p>
            <div className="bg-white/50 rounded-lg p-3 mb-4 text-xs text-[#5C3A2A] font-mono border border-[#C9A227]/20">
              الفريق,القائد,الموقع,الوردية,الحالة,العضو,الدور<br/>
              الفريق أ,أحمد محمد,مدرسة النور,الصباحية,نشط,خالد عبدالله,فني سباكة<br/>
              الفريق أ,أحمد محمد,مدرسة النور,الصباحية,نشط,سعد إبراهيم,عامل نظافة
            </div>
            <button type="button" onClick={openFilePicker}
              className="w-full border-2 border-dashed border-[#C9A227]/30 rounded-xl p-8 text-center mb-4 hover:bg-[#C9A227]/5 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-[#C9A227] mx-auto mb-2" />
              <p className="text-sm text-[#5C3A2A]">اضغط هنا لاختيار ملف CSV</p>
              <p className="text-xs text-[#C9A227]/60 mt-1">CSV فقط</p>
            </button>
            <button type="button" onClick={closeModal}
              className="w-full py-2 rounded-lg text-sm font-medium text-[#5C3A2A] border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">إلغاء</button>
          </div>
        </div>
      )}
    </div>
  );
}