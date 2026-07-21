// src/app/teams/page.tsx (مُحدث)
"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Users, UserPlus, MapPin, Calendar, ChevronDown, ChevronUp, Phone, Truck, School } from "lucide-react";
import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  phone: string;
}

interface Team {
  id: number;
  code: string;           // F1, F2, F3...
  leader: string;
  leaderPhone: string;
  members: TeamMember[];
  vehicle: string;        // رقم اللوحة
  schools: string[];      // المدارس المربوطة
  shift: string;
  status: "نشط" | "غير نشط";
}

export default function TeamsPage() {
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      code: "F1",
      leader: "أحمد محمد",
      leaderPhone: "0501111111",
      members: [
        { name: "خالد عبدالله", role: "فني سباكة", phone: "0502222222" },
        { name: "سعد إبراهيم", role: "عامل نظافة", phone: "0503333333" },
        { name: "عمر فارس", role: "فني كهرباء", phone: "0504444444" },
      ],
      vehicle: "أ ب ج 1234",
      schools: ["مدرسة النور", "مدرسة الفجر"],
      shift: "الصباحية (6 ص - 2 م)",
      status: "نشط",
    },
    {
      id: 2,
      code: "F2",
      leader: "محمد سالم",
      leaderPhone: "0505555555",
      members: [
        { name: "يوسف أحمد", role: "فني تكييف", phone: "0506666666" },
        { name: "ناصر علي", role: "عامل صيانة", phone: "0507777777" },
      ],
      vehicle: "أ ب ج 5678",
      schools: ["مدرسة الروضة"],
      shift: "المسائية (2 م - 10 م)",
      status: "نشط",
    },
    {
      id: 3,
      code: "F3",
      leader: "يوسف أحمد",
      leaderPhone: "0508888888",
      members: [
        { name: "فهد محمد", role: "فني كهرباء", phone: "0509999999" },
        { name: "بندر سعد", role: "فني سباكة", phone: "0500000000" },
      ],
      vehicle: "أ ب ج 9012",
      schools: ["مدرسة الأمل", "مدرسة النور"],
      shift: "24 ساعة",
      status: "نشط",
    },
  ]);

  const toggleExpand = (id: number) => {
    setExpandedTeam(expandedTeam === id ? null : id);
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="الفرق" subtitle="إدارة فرق العمل والورديات" />
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
          style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
          <UserPlus className="w-4 h-4" /> فريق جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الفرق" value={teams.length.toString()} icon={Users} delay={0} />
        <StatCard title="الفرق النشطة" value={teams.filter(t => t.status === "نشط").length.toString()} icon={UserPlus} delay={0.1} />
        <StatCard title="إجمالي الفنيين" value={teams.reduce((sum, t) => sum + t.members.length, 0).toString()} icon={Users} delay={0.2} />
        <StatCard title="المركبات" value={teams.length.toString()} icon={Truck} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
                  <span className="text-[#1A0F09] font-bold text-sm">{team.code}</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810] text-lg" style={{ fontFamily: "Tajawal, sans-serif" }}>{team.leader}</h3>
                  <div className="flex items-center gap-1 text-xs text-[#5C3A2A]">
                    <Phone className="w-3 h-3" /> {team.leaderPhone}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${team.status === "نشط" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                {team.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-[#5C3A2A] mb-3">
              <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {team.vehicle}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {team.shift}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-[#5C3A2A] mb-3">
              <School className="w-3 h-3" />
              <span>المدارس: {team.schools.join("، ")}</span>
            </div>

            <button onClick={() => toggleExpand(team.id)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-[#C9A227]/5 hover:bg-[#C9A227]/10 transition-colors text-sm text-[#2C1810]">
              <span>الفنيين ({team.members.length})</span>
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
                    <span className="text-xs text-[#5C3A2A]">{member.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}