"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Users, Wrench, Clock, Star } from "lucide-react";

export default function WorkforcePage() {
  const team = [
    { name: "أحمد محمد", role: "فني تكييف", status: "متاح", rating: 4.8, tasks: 12 },
    { name: "خالد عبدالله", role: "فني كهرباء", status: "مشغول", rating: 4.5, tasks: 8 },
    { name: "سعد إبراهيم", role: "فني سباكة", status: "متاح", rating: 4.9, tasks: 15 },
    { name: "ناصر علي", role: "فني عام", status: "إجازة", rating: 4.2, tasks: 5 },
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader 
        title="الفريق" 
        subtitle="إدارة فريق العمل والموظفين" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الفريق" value="45" icon={Users} delay={0} />
        <StatCard title="المتاحين" value="28" icon={Wrench} delay={0.1} />
        <StatCard title="المشغولين" value="12" icon={Clock} delay={0.2} />
        <StatCard title="متوسط التقييم" value="4.6" icon={Star} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>
            أعضاء الفريق
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A227]/20">
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>الاسم</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>الدور</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>التقييم</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>المهام</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, i) => (
                <tr key={i} className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8D5A3] flex items-center justify-center text-[#1A0F09] font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[#2C1810]">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{member.role}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === "متاح" ? "bg-green-100 text-green-800" :
                      member.status === "مشغول" ? "bg-amber-100 text-amber-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>{member.status}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#C9A227] fill-[#C9A227]" />
                      <span className="text-[#2C1810] font-medium">{member.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{member.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}