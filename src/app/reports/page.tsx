"use client";

import { useRouter } from "next/navigation";
import {
  FileText, Sparkles, Wrench, Wind, Camera, CheckCircle, ArrowLeft,
} from "lucide-react";

const cards = [
  { title: "تقرير النظافة", desc: "استيراد Excel + صور + فلترة ذكية", href: "/reports/cleaning", icon: Sparkles, color: "bg-green-50 text-green-600 border-green-100", iconBg: "bg-green-100" },
  { title: "تقرير الصيانة", desc: "استيراد Excel + صور + فلترة ذكية", href: "/reports/maintenance", icon: Wrench, color: "bg-blue-50 text-blue-600 border-blue-100", iconBg: "bg-blue-100" },
  { title: "تقرير التكييف", desc: "استيراد Excel + صور + فلترة ذكية", href: "/reports/hvac", icon: Wind, color: "bg-cyan-50 text-cyan-600 border-cyan-100", iconBg: "bg-cyan-100" },
  { title: "التقرير المصور PPT", desc: "رفع صور → فلترة → تصدير PowerPoint", href: "/reports/ppt", icon: Camera, color: "bg-purple-50 text-purple-600 border-purple-100", iconBg: "bg-purple-100" },
  { title: "بلاغات مغلقة", desc: "تقارير البلاغات المنجزة من الفنيين", href: "/reports/closed-complaints", icon: CheckCircle, color: "bg-[#C9A227]/5 text-[#C9A227] border-[#C9A227]/20", iconBg: "bg-[#C9A227]/10" },
];

export default function ReportsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2C1810] mb-8 flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
          <FileText className="w-8 h-8 text-[#C9A227]" />
          التقارير الإدارية
        </h1>
        <div className="grid gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button key={card.href} onClick={() => router.push(card.href)} className={`p-6 rounded-2xl border ${card.color} bg-white hover:shadow-md transition text-right flex items-center gap-5 group`}>
                <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.desc}</p>
                </div>
                <ArrowLeft className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:-translate-x-1 transition" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}