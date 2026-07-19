"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Package, ArrowDown, ArrowUp, AlertTriangle, Plus, Download, Upload } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  const items = [
    { name: "فلاتر مكيفات", category: "تكييف", qty: 45, min: 10, unit: "قطعة" },
    { name: "لمبات LED", category: "كهرباء", qty: 8, min: 20, unit: "علبة" },
    { name: "منظفات عامة", category: "تنظيف", qty: 120, min: 30, unit: "لتر" },
    { name: "مواسير PVC", category: "سباكة", qty: 25, min: 15, unit: "متر" },
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="المخازن" subtitle="إدارة المخزون والمواد" />
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
            href="/inventory/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
          >
            <Plus className="w-4 h-4" />
            صنف جديد
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي الأصناف" value="156" icon={Package} delay={0} />
        <StatCard title="وارد اليوم" value="12" icon={ArrowDown} delay={0.1} />
        <StatCard title="صادر اليوم" value="8" icon={ArrowUp} delay={0.2} />
        <StatCard title="نفاد الكمية" value="3" icon={AlertTriangle} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>جرد المخزون</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A227]/20">
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الصنف</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">التصنيف</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الكمية</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الحد الأدنى</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-[#2C1810]">{item.name}</div>
                  </td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{item.category}</td>
                  <td className="py-4 px-4 text-[#2C1810] font-bold">{item.qty} {item.unit}</td>
                  <td className="py-4 px-4 text-[#5C3A2A]">{item.min} {item.unit}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.qty <= item.min ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {item.qty <= item.min ? "نفاد" : "متوفر"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}