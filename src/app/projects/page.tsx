"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Wrench, Clock, CheckCircle, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader 
          title="المشاريع" 
          subtitle="إدارة مشاريع الصيانة والمتابعة" 
        />
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
          style={{
            background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)",
            fontFamily: "Tajawal, sans-serif",
          }}
        >
          <Plus className="w-4 h-4" />
          مشروع جديد
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي المشاريع" value="24" icon={Wrench} delay={0} />
        <StatCard title="المشاريع النشطة" value="18" icon={Clock} delay={0.1} />
        <StatCard title="المكتملة" value="5" icon={CheckCircle} delay={0.2} />
        <StatCard title="العاجلة" value="1" icon={AlertTriangle} delay={0.3} />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>
            قائمة المشاريع
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A227]/20">
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>المشروع</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>المدرسة</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-[#2C1810]">صيانة مكيفات المبنى A</div>
                  <div className="text-xs text-[#5C3A2A]">#PRJ-001</div>
                </td>
                <td className="py-4 px-4 text-[#5C3A2A]">مدرسة النور</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">نشط</span>
                </td>
                <td className="py-4 px-4 text-[#5C3A2A] text-sm">2026/07/20</td>
              </tr>
              <tr className="border-b border-[#C9A227]/10 hover:bg-[#C9A227]/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-[#2C1810]">تنظيف المباني</div>
                  <div className="text-xs text-[#5C3A2A]">#PRJ-002</div>
                </td>
                <td className="py-4 px-4 text-[#5C3A2A]">مدرسة الفجر</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">مكتمل</span>
                </td>
                <td className="py-4 px-4 text-[#5C3A2A] text-sm">2026/07/15</td>
              </tr>
              <tr className="hover:bg-[#C9A227]/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-[#2C1810]">إصلاح كهرباء</div>
                  <div className="text-xs text-[#5C3A2A]">#PRJ-003</div>
                </td>
                <td className="py-4 px-4 text-[#5C3A2A]">مدرسة الروضة</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">عاجل</span>
                </td>
                <td className="py-4 px-4 text-[#5C3A2A] text-sm">2026/07/20</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}