"use client";

import { useState, useEffect } from "react";
import { Wrench, Building2, Shield, Eye, HardHat, ChevronDown, UserCheck, LogOut, Home } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserRole, ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions";

const ROLE_LIST = [
  { key: "super_admin" as UserRole, label: "مدير النظام", icon: Shield },
  { key: "admin" as UserRole, label: "مدير الشركة", icon: Building2 },
  { key: "supervisor" as UserRole, label: "مشرف", icon: HardHat },
  { key: "technician" as UserRole, label: "فني", icon: Wrench },
  { key: "viewer" as UserRole, label: "مشاهد", icon: Eye },
];

export default function LoginPage() {
  const { login, logout, tenants, user, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [tenantId, setTenantId] = useState("");
  const [showRoles, setShowRoles] = useState(false);

  useEffect(() => {
    if (tenants.length > 0 && !tenantId) {
      setTenantId(tenants[0].id);
    }
  }, [tenants, tenantId]);

  useEffect(() => {
    if (!isLoading && user) {
      const path = user.role === "technician" ? "/technician-app" : "/";
      window.location.assign(path);
    }
  }, [isLoading, user]);

  const selectedTenant = tenants.find((t) => t.id === tenantId) || tenants[0];
  const selectedRoleData = ROLE_LIST.find((r) => r.key === role);
  const RoleIcon = selectedRoleData?.icon || Shield;

  const handleLogin = () => {
    if (!name.trim()) { alert("الاسم مطلوب"); return; }
    if (!selectedTenant) { alert("اختر شركة"); return; }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.trim()}@ayla.app`,
      role,
      tenantId: selectedTenant.id,
    };

    login(newUser, selectedTenant);
    const path = role === "technician" ? "/technician-app" : "/";
    window.location.assign(path);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    const path = user.role === "technician" ? "/technician-app" : "/";
    return (
      <div className="min-h-screen bg-[#1A0F09] flex flex-col items-center justify-center gap-5 p-6">
        <div className="w-12 h-12 rounded-2xl bg-[#C9A227] flex items-center justify-center mb-2 shadow-lg shadow-[#C9A227]/20">
          <Wrench className="w-6 h-6 text-[#1A0F09]" />
        </div>
        <h2 className="text-[#C9A227] text-lg font-bold">أهلا {user.name}</h2>
        <p className="text-[#C9A227]/60 text-sm">تم تسجيل الدخول كـ {ROLE_LABELS[user.role]}</p>
        <button onClick={() => window.location.assign(path)} className="px-8 py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition flex items-center gap-2 shadow-lg shadow-[#C9A227]/20">
          <Home className="w-4 h-4" /> الدخول للمنصة
        </button>
        <a href={path} className="text-xs text-[#C9A227] underline hover:text-[#b89420] transition">أو اضغط هنا (رابط مباشر)</a>
        <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-600/30 transition mt-4">
          <LogOut className="w-3 h-3" /> تسجيل الخروج
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A227] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C9A227]/20">
            <Wrench className="w-8 h-8 text-[#1A0F09]" />
          </div>
          <h1 className="text-2xl font-bold text-[#C9A227]">آيلا للصيانة</h1>
          <p className="text-[#C9A227]/50 text-sm mt-1">نظام إدارة متعدد الشركات</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-[#C9A227]/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">الشركة / المنشأة</label>
            <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-[#C9A227] text-sm focus:outline-none focus:border-[#C9A227]">
              {tenants.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">الدور الوظيفي</label>
            <div className="relative">
              <button type="button" onClick={() => setShowRoles(!showRoles)} className={`w-full px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-between transition ${ROLE_COLORS[role]}`}>
                <span className="flex items-center gap-2"><RoleIcon className="w-4 h-4" />{ROLE_LABELS[role]}</span>
                <ChevronDown className={`w-4 h-4 transition ${showRoles ? "rotate-180" : ""}`} />
              </button>
              {showRoles && (
                <div className="absolute top-full mt-1 w-full bg-[#2C1810] border border-[#C9A227]/20 rounded-xl overflow-hidden z-10 shadow-xl">
                  {ROLE_LIST.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button key={r.key} type="button" onClick={() => { setRole(r.key); setShowRoles(false); }} className={`w-full px-4 py-3 text-right text-sm font-bold flex items-center gap-2 hover:bg-[#C9A227]/10 transition ${role === r.key ? "text-[#C9A227]" : "text-gray-400"}`}>
                        <Icon className="w-4 h-4" /> {r.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">الاسم الكامل *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: محمد عبدالرحمن" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" />
          </div>
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">البريد الإلكتروني (اختياري)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" />
          </div>
          <button type="button" onClick={handleLogin} className="w-full py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition flex items-center justify-center gap-2">
            <UserCheck className="w-4 h-4" /> تسجيل الدخول
          </button>
        </div>
        <p className="text-center text-[10px] text-[#C9A227]/30 mt-6">v2.0 — نظام إدارة الصيانة المتكامل</p>
      </div>
    </div>
  );
}
