"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  School, Wrench, Package, Users, Car, HardHat,
  AlertTriangle, ClipboardList, Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const { user, tenant } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const runSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("✅ تم إضافة البيانات التجريبية!");
        fetchStats();
      } else {
        alert(data.error);
      }
    } catch {
      alert("Error seeding");
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    { label: "المدارس", value: stats?.schools ?? 0, icon: School, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "البلاغات", value: stats?.complaints ?? 0, icon: ClipboardList, color: "text-red-400", bg: "bg-red-400/10", badge: stats?.newComplaints ?? 0 },
    { label: "المخزون", value: stats?.inventory ?? 0, icon: Package, color: "text-emerald-400", bg: "bg-emerald-400/10", badge: stats?.lowStock ?? 0 },
    { label: "الفرق", value: stats?.teams ?? 0, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "السيارات", value: stats?.vehicles ?? 0, icon: Car, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "الموظفين", value: stats?.employees ?? 0, icon: HardHat, color: "text-sky-400", bg: "bg-sky-400/10" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2C1810]">لوحة التحكم</h1>
            <p className="text-sm text-gray-500">{tenant?.name}</p>
          </div>
          <button
            onClick={runSeed}
            disabled={seeding}
            className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-xs hover:bg-[#b89420] transition disabled:opacity-50 flex items-center gap-2"
          >
            {seeding ? <span className="w-4 h-4 border-2 border-[#1A0F09] border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
            تشغيل البيانات التجريبية
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-2xl border border-[#C9A227]/10 p-5 relative overflow-hidden">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-[#2C1810]">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                {card.badge ? (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold">
                    <AlertTriangle className="w-3 h-3" />
                    {card.badge} جديد
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-[#C9A227]/10 p-5">
          <h3 className="font-bold text-[#2C1810] mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#C9A227]" /> إجراءات سريعة
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <a href="/complaints/inbox" className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center hover:bg-red-100 transition">
              📋 البلاغات الواردة
            </a>
            <a href="/inventory" className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold text-center hover:bg-emerald-100 transition">
              📦 المخازن
            </a>
            <a href="/schools" className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold text-center hover:bg-blue-100 transition">
              🏫 المدارس
            </a>
            <a href="/teams" className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold text-center hover:bg-purple-100 transition">
              👥 الفرق
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
