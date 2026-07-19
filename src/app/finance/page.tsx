"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, Download, Upload } from "lucide-react";
import Link from "next/link";

export default function FinancePage() {
  const transactions = [
    { desc: "صيانة مكيفات مدرسة النور", type: "مصروف", amount: 3500, date: "2026/07/20" },
    { desc: "عقد صيانة شهري", type: "إيراد", amount: 15000, date: "2026/07/18" },
    { desc: "شراء مواد تنظيف", type: "مصروف", amount: 1200, date: "2026/07/15" },
    { desc: "صيانة مركبات", type: "مصروف", amount: 2800, date: "2026/07/10" },
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="المالية" subtitle="المصروفات والإيرادات" />
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Upload className="w-4 h-4" />
            استيراد
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#5C3A2A] text-sm border border-[#C9A227]/30 hover:bg-[#C9A227]/10 transition-colors">
            <Download className="w-4 h-4" />
            تصدير
          </button>
          <Link
            href="/finance/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
          >
            <Plus className="w-4 h-4" />
            معاملة جديدة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="الرصيد الحالي" value="45,250 ر.س" icon={Wallet} delay={0} />
        <StatCard title="إيرادات الشهر" value="32,000 ر.س" icon={TrendingUp} delay={0.1} />
        <StatCard title="مصروفات الشهر" value="18,750 ر.س" icon={TrendingDown} delay={0.2} />
        <StatCard title="صافي الربح" value="13,250 ر.س" icon={DollarSign} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>الحركات المالية</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A227]/20">
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الوصف</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">النوع</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">المبلغ</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                  <td className="py-4 px-4 font-medium text-[#2C1810]">{t.desc}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.type === "إيراد" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>{t.type}</span>
                  </td>
                  <td className={`py-4 px-4 font-bold ${t.type === "إيراد" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "إيراد" ? "+" : "-"}{t.amount.toLocaleString()} ر.س
                  </td>
                  <td className="py-4 px-4 text-[#5C3A2A] text-sm">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}