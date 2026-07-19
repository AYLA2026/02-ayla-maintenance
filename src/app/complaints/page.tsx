"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function ComplaintsPage() {
  const complaints = [
    { title: "عطل في المكيف", school: "مدرسة النور", priority: "عالي", status: "جديد", date: "2026/07/20" },
    { title: "تسرب مياه", school: "مدرسة الفجر", priority: "متوسط", status: "قيد المعالجة", date: "2026/07/19" },
    { title: "إنارة خارجة", school: "مدرسة الروضة", priority: "منخفض", status: "مكتمل", date: "2026/07/18" },
    { title: "صرف مغلق", school: "مدرسة الأمل", priority: "عالي", status: "جديد", date: "2026/07/20" },
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader 
        title="البلاغات" 
        subtitle="متابعة البلاغات والشكاوى" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي البلاغات" value="48" icon={MessageSquare} delay={0} />
        <StatCard title="جديدة" value="8" icon={AlertTriangle} delay={0.1} />
        <StatCard title="قيد المعالجة" value="12" icon={Clock} delay={0.2} />
        <StatCard title="مكتملة" value="28" icon={CheckCircle} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>
            قائمة البلاغات
          </h2>
        </div>
        <div className="space-y-3">
          {complaints.map((complaint, i) => (
            <div 
              key={i} 
              className="p-4 rounded-xl border border-[#C9A227]/15 hover:border-[#C9A227]/40 transition-all"
              style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{complaint.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      complaint.priority === "عالي" ? "bg-red-100 text-red-800" :
                      complaint.priority === "متوسط" ? "bg-amber-100 text-amber-800" :
                      "bg-green-100 text-green-800"
                    }`}>{complaint.priority}</span>
                  </div>
                  <div className="text-sm text-[#5C3A2A] mb-1">{complaint.school}</div>
                  <div className="text-xs text-[#C9A227]/60">{complaint.date}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  complaint.status === "جديد" ? "bg-blue-100 text-blue-800" :
                  complaint.status === "قيد المعالجة" ? "bg-amber-100 text-amber-800" :
                  "bg-green-100 text-green-800"
                }`}>{complaint.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}