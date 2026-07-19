"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import { Truck, Fuel, Wrench, AlertTriangle, Plus, Download, Upload } from "lucide-react";
import Link from "next/link";

export default function VehiclesPage() {
  const vehicles = [
    { plate: "أ ب ج 1234", type: "بيك أب", driver: "أحمد محمد", status: "متاح", fuel: 85, lastMaint: "2026/06/15" },
    { plate: "أ ب ج 5678", type: "فان", driver: "خالد عبدالله", status: "مشغول", fuel: 45, lastMaint: "2026/07/01" },
    { plate: "أ ب ج 9012", type: "سطحه", driver: "سعد إبراهيم", status: "صيانة", fuel: 20, lastMaint: "2026/05/20" },
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="المركبات" subtitle="تتبع المركبات والصيانة" />
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
            href="/vehicles/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#1A0F09] font-medium text-sm"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
          >
            <Plus className="w-4 h-4" />
            مركبة جديدة
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي المركبات" value="8" icon={Truck} delay={0} />
        <StatCard title="المتاحة" value="5" icon={Fuel} delay={0.1} />
        <StatCard title="قيد الصيانة" value="2" icon={Wrench} delay={0.2} />
        <StatCard title="تحتاج صيانة" value="1" icon={AlertTriangle} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle, i) => (
          <Card key={i} delay={i * 0.1}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#2C1810] text-lg" style={{ fontFamily: "Tajawal, sans-serif" }}>{vehicle.plate}</h3>
                <p className="text-sm text-[#5C3A2A]">{vehicle.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                vehicle.status === "متاح" ? "bg-green-100 text-green-800" :
                vehicle.status === "مشغول" ? "bg-amber-100 text-amber-800" :
                "bg-red-100 text-red-800"
              }`}>{vehicle.status}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#5C3A2A]">السائق:</span>
                <span className="text-[#2C1810] font-medium">{vehicle.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C3A2A]">الوقود:</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 rounded-full bg-[#C9A227]/10 overflow-hidden">
                    <div className="h-full rounded-full bg-[#C9A227]" style={{ width: `${vehicle.fuel}%` }} />
                  </div>
                  <span className="text-[#2C1810] font-medium">{vehicle.fuel}%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C3A2A]">آخر صيانة:</span>
                <span className="text-[#2C1810] font-medium">{vehicle.lastMaint}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}