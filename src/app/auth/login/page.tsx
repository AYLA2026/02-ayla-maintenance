"use client";

import { useRouter } from "next/navigation";
import { Wrench, Shield, Building2, HardHat, Eye } from "lucide-react";
import { UserRole, ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions";

const ROLES: { key: UserRole; icon: React.ElementType; desc: string }[] = [
  { key: "super_admin", icon: Shield, desc: "Full system access + tenant management" },
  { key: "admin", icon: Building2, desc: "Company management + all modules" },
  { key: "supervisor", icon: HardHat, desc: "Complaints + teams + inventory + schedule" },
  { key: "technician", icon: Wrench, desc: "Technician mobile app access" },
  { key: "viewer", icon: Eye, desc: "View-only: reports + schools + vehicles" },
];

export default function RoleSelectorPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-[#C9A227] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#C9A227]/20">
            <Wrench className="w-10 h-10 text-[#1A0F09]" />
          </div>
          <h1 className="text-3xl font-bold text-[#C9A227] mb-2">Ayla Maintenance</h1>
          <p className="text-[#C9A227]/50 text-sm">Multi-Tenant Maintenance Management System</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                onClick={() => router.push(`/auth/login/${r.key}`)}
                className="group relative bg-white/5 hover:bg-[#C9A227]/10 border border-[#C9A227]/10 hover:border-[#C9A227]/40 rounded-2xl p-6 text-right transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A227]/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${ROLE_COLORS[r.key]}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] text-[#C9A227]/40 font-mono uppercase tracking-wider">{r.key}</span>
                </div>
                <h3 className="text-lg font-bold text-[#C9A227] mb-1 group-hover:text-[#e0b840] transition">{ROLE_LABELS[r.key]}</h3>
                <p className="text-xs text-[#C9A227]/50 leading-relaxed">{r.desc}</p>
              </button>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-[#C9A227]/30 mt-10">
          v2.0 — Ayla Maintenance Management System
        </p>
      </div>
    </div>
  );
}
