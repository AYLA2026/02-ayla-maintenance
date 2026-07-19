"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import { ClipboardList, Wind, Droplets, Wrench, Camera } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const reports = [
    { href: "/reports/cleaning", title: "تقرير التنظيف", icon: Droplets, desc: "تقارير أعمال التنظيف والصيانة الدورية" },
    { href: "/reports/hvac", title: "تقرير التكييف", icon: Wind, desc: "تقارير صيانة وأداء أنظمة التكييف" },
    { href: "/reports/om", title: "تقرير الصيانة", icon: Wrench, desc: "تقارير الصيانة العامة والإصلاحات" },
    { href: "/reports/photo", title: "تقرير الصور", icon: Camera, desc: "تقارير مصورة للمواقع والأعمال" },
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader 
        title="التقارير" 
        subtitle="إدارة وعرض التقارير" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => (
          <Link key={i} href={report.href}>
            <Card delay={i * 0.1} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
                >
                  <report.icon className="w-7 h-7 text-[#1A0F09]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810] mb-1 text-lg" style={{ fontFamily: "Tajawal, sans-serif" }}>{report.title}</h3>
                  <p className="text-sm text-[#5C3A2A]">{report.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}