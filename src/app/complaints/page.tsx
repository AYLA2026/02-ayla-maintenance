"use client";

import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Inbox,
  Bot,
  History,
  ArrowLeft,
} from "lucide-react";

const cards = [
  {
    title: "البلاغات الواردة",
    desc: "استلام البلاغات من واتساب والموقع",
    href: "/complaints/inbox",
    icon: Inbox,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    title: "التوزيع الذكي",
    desc: "AI يوزع البلاغات للفنيين تلقائياً",
    href: "/complaints/auto-dispatch",
    icon: Bot,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    title: "سجل البلاغات",
    desc: "جميع البلاغات المنجزة والمغلقة",
    href: "/complaints/history",
    icon: History,
    color: "bg-green-50 text-green-600 border-green-100",
    iconBg: "bg-green-100",
  },
];

export default function ComplaintsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#2C1810] flex items-center gap-3"
            style={{ fontFamily: "Tajawal, sans-serif" }}
          >
            <ClipboardList className="w-8 h-8 text-[#C9A227]" />
            إدارة البلاغات
          </h1>
          <p className="text-[#5C3A2A] mt-2">
            نظام متكامل لاستلام وتوزيع بلاغات الصيانة
          </p>
        </div>

        <div className="grid gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.href}
                onClick={() => router.push(card.href)}
                className={`p-6 rounded-2xl border ${card.color} bg-white hover:shadow-md transition text-right flex items-center gap-5 group`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition`}
                >
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