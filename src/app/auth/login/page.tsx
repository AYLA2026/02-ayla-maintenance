"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/auth-context";
import { Wrench, Building2, Shield, HardHat, UserCheck, Eye, ArrowRight } from "lucide-react";

const ROLES: { key: UserRole; labelAr: string; icon: any; color: string; desc: string }[] = [
  { key: "system_admin", labelAr: "مدير النظام", icon: Shield, color: "bg-purple-600", desc: "Full access" },
  { key: "company_manager", labelAr: "مدير الشركة", icon: Building2, color: "bg-[#C9A227]", desc: "Manage company" },
  { key: "site_engineer", labelAr: "مهندس موقع", icon: Wrench, color: "bg-blue-600", desc: "Buildings oversight" },
  { key: "supervisor", labelAr: "مشرف صيانة", icon: UserCheck, color: "bg-emerald-600", desc: "Field operations" },
  { key: "technician", labelAr: "فني صيانة", icon: HardHat, color: "bg-[#1A0F09]", desc: "Assigned tasks" },
  { key: "visitor", labelAr: "زائر", icon: Eye, color: "bg-gray-500", desc: "Read-only" },
];

export default function LoginPage() {
  const { tenants, login } = useAuth();
  const [step, setStep] = useState<"tenant" | "role" | "name">("tenant");
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!selectedTenant || !selectedRole || !name.trim()) return;
    setLoading(true);
    login(selectedTenant, selectedRole, name.trim());
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-[#C9A227] flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Wrench className="w-10 h-10 text-[#1A0F09]" />
          </div>
          <h1 className="text-3xl font-black text-[#1A0F09]">Ayla Maintenance</h1>
          <p className="text-gray-500 mt-2 text-sm">نظام إدارة الصيانة الذكي</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
          {step === "tenant" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#1A0F09] text-center">اختر الشركة</h2>
              <div className="grid grid-cols-1 gap-3">
                {tenants.map((t) => (
                  <button key={t.id} onClick={() => { setSelectedTenant(t.id); setStep("role"); }}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#C9A227] hover:bg-[#C9A227]/5 transition-all text-right">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: t.color }}>{t.nameAr.charAt(0)}</div>
                    <div className="flex-1"><p className="font-bold text-[#1A0F09]">{t.nameAr}</p><p className="text-xs text-gray-400">{t.name}</p></div>
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "role" && (
            <div className="space-y-4">
              <button onClick={() => setStep("tenant")} className="text-xs text-gray-400 hover:text-[#C9A227] transition">← تغيير الشركة</button>
              <h2 className="text-lg font-bold text-[#1A0F09] text-center">اختر الدور</h2>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button key={r.key} onClick={() => { setSelectedRole(r.key); setStep("name"); }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-300 transition-all">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${r.color}`}><Icon className="w-5 h-5" /></div>
                      <div className="text-center"><p className="font-bold text-sm text-[#1A0F09]">{r.labelAr}</p><p className="text-[10px] text-gray-400">{r.desc}</p></div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "name" && (
            <div className="space-y-4">
              <button onClick={() => setStep("role")} className="text-xs text-gray-400 hover:text-[#C9A227] transition">← تغيير الدور</button>
              <h2 className="text-lg font-bold text-[#1A0F09] text-center">بيانات الدخول</h2>
              <input autoFocus value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 outline-none transition" placeholder="الاسم الكامل" />
              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                <p><span className="font-bold text-[#1A0F09]">الشركة:</span> {tenants.find(t => t.id === selectedTenant)?.nameAr}</p>
                <p><span className="font-bold text-[#1A0F09]">الدور:</span> {ROLES.find(r => r.key === selectedRole)?.labelAr}</p>
              </div>
              <button onClick={handleLogin} disabled={!name.trim() || loading}
                className="w-full py-3 bg-[#1A0F09] text-white rounded-xl font-bold text-sm hover:bg-[#3d2317] transition disabled:opacity-50">
                {loading ? "جاري الدخول..." : "دخول المنصة"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}