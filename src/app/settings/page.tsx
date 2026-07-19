"use client";

import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import { User, Bell, Shield, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  const settings = [
    { icon: User, title: "الملف الشخصي", description: "تعديل بيانات الحساب والمعلومات الشخصية" },
    { icon: Bell, title: "الإشعارات", description: "إعدادات التنبيهات والإشعارات" },
    { icon: Shield, title: "الأمان", description: "تغيير كلمة المرور وإعدادات الأمان" },
    { icon: Palette, title: "المظهر", description: "تخصيص ألوان وشكل النظام" },
    { icon: Globe, title: "اللغة", description: "تغيير لغة واجهة النظام" },
  ];

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader 
        title="الإعدادات" 
        subtitle="تخصيص إعدادات النظام" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settings.map((setting, i) => (
          <Card key={i} delay={i * 0.1} className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
              >
                <setting.icon className="w-6 h-6 text-[#1A0F09]" />
              </div>
              <div>
                <h3 className="font-bold text-[#2C1810] mb-1" style={{ fontFamily: "Tajawal, sans-serif" }}>{setting.title}</h3>
                <p className="text-sm text-[#5C3A2A]">{setting.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <h2 className="text-lg font-bold text-[#2C1810] mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>
          معلومات النظام
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-[#5C3A2A] mb-1">الإصدار</div>
            <div className="font-bold text-[#2C1810]">v2.0.0</div>
          </div>
          <div>
            <div className="text-[#5C3A2A] mb-1">آخر تحديث</div>
            <div className="font-bold text-[#2C1810]">2026/07/20</div>
          </div>
          <div>
            <div className="text-[#5C3A2A] mb-1">المسؤول</div>
            <div className="font-bold text-[#2C1810]">م. محمد عبد الرحمن</div>
          </div>
        </div>
      </Card>
    </div>
  );
}