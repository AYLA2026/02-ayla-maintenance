"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Building2, Shield, User, Eye, HardHat, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserRole, ROLE_LABELS, ROLE_COLORS, Tenant } from "@/lib/permissions";

const ROLES: { key: UserRole; icon: any }[] = [
  { key: "super_admin", icon: Shield },
  { key: "admin", icon: Building2 },
  { key: "supervisor", icon: HardHat },
  { key: "technician", icon: Wrench },
  { key: "viewer", icon: Eye },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, tenants } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [selectedTenant, setSelectedTenant] = useState<Tenant>(tenants[0]);
  const [showRoles, setShowRoles] = useState(false);

  const handleLogin = () => {
    if (!name.trim()) return alert("الاسم مطلوب");
    const user = {
      id: `usr-${Date.now()}`,
      name,
      email: email || `${name}@ayla.app`,
      role: selectedRole,
      tenantId: selectedTenant.id,
    };
    login(user, selectedTenant);
    if (selectedRole === "technician") {
      router.push("/technician-app");
    } else {
      router.push("/");
    }
  };

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
          {/* الشركة */}
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">الشركة / المنشأة</label>
            <select
              value={selectedTenant.id}
              onChange={(e) => {
                const t = tenants.find((x) => x.id === e.target.value);
                if (t) setSelectedTenant(t);
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-[#C9A227] text-sm focus:outline-none focus:border-[#C9A227]"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* الدور */}
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">الدور الوظيفي</label>
            <div className="relative">
              <button
                onClick={() => setShowRoles(!showRoles)}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-bold flex items-center justify-between transition ${
                  ROLE_COLORS[selectedRole]
                }`}
              >
                <span className="flex items-center gap-2">
                  {(() => {
                    const Icon = ROLES.find((r) => r.key === selectedRole)?.icon || User;
                    return <Icon className="w-4 h-4" />;
                  })()}
                  {ROLE_LABELS[selectedRole]}
                </span>
                <ChevronDown className={`w-4 h-4 transition ${showRoles ? "rotate-180" : ""}`} />
              </button>
              {showRoles && (
                <div className="absolute top-full mt-1 w-full bg-[#2C1810] border border-[#C9A227]/20 rounded-xl overflow-hidden z-10">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.key}
                        onClick={() => {
                          setSelectedRole(r.key);
                          setShowRoles(false);
                        }}
                        className={`w-full px-4 py-3 text-right text-sm font-bold flex items-center gap-2 hover:bg-[#C9A227]/10 transition ${
                          selectedRole === r.key ? "text-[#C9A227]" : "text-gray-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {ROLE_LABELS[r.key]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* الاسم */}
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">الاسم الكامل</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: محمد عبدالرحمن"
              className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          {/* البريد (اختياري) */}
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">البريد الإلكتروني (اختياري)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition mt-2"
          >
            تسجيل الدخول
          </button>
        </div>

        <p className="text-center text-[10px] text-[#C9A227]/30 mt-6">
          v2.0 — نظام إدارة الصيانة المتكامل
        </p>
      </div>
    </div>
  );
}