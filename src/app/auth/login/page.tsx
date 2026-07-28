"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Wrench, Shield, Building2, HardHat, Eye, LogIn, Zap, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { UserRole, ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions";

const ROLES = [
  { key: "super_admin" as UserRole, icon: Shield, desc: "Full system access" },
  { key: "admin" as UserRole, icon: Building2, desc: "Company manager" },
  { key: "supervisor" as UserRole, icon: HardHat, desc: "Complaints + teams" },
  { key: "technician" as UserRole, icon: Wrench, desc: "Technician app" },
  { key: "viewer" as UserRole, icon: Eye, desc: "View only" },
];

const DEMO_USERS = [
  { role: "super_admin" as UserRole, name: "Ayman Al-Admin", label: "مدير النظام" },
  { role: "admin" as UserRole, name: "Khaled Al-Manager", label: "مدير الشركة" },
  { role: "supervisor" as UserRole, name: "Faisal Al-Supervisor", label: "مشرف ميداني" },
  { role: "technician" as UserRole, name: "Fahad Al-Tech", label: "فني صيانة" },
  { role: "viewer" as UserRole, name: "Reviewer", label: "مشاهد" },
];

function LoginInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, tenants, user, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"demo" | "real">("real");

  const roleParam = searchParams.get("role") as UserRole | null;
  const validRoles: UserRole[] = ["super_admin", "admin", "supervisor", "technician", "viewer"];
  const role = validRoles.includes(roleParam as UserRole) ? (roleParam as UserRole) : null;

  useEffect(() => {
    if (tenants.length > 0 && !tenantId) setTenantId(tenants[0].id);
  }, [tenants, tenantId]);

  useEffect(() => {
    if (!isLoading && user) {
      const path = user.role === "technician" ? "/technician-app" : "/";
      window.location.assign(path);
    }
  }, [isLoading, user]);

  const selectedTenant = tenants.find((t) => t.id === tenantId) || tenants[0];

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { alert("Email and password required"); return; }
    setSubmitting(true);
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    
    if (res?.error) {
      alert("Invalid email or password");
      setSubmitting(false);
    } else {
      window.location.assign("/");
    }
  };

  const doDemoLogin = (r: UserRole, n: string) => {
    if (!selectedTenant) return;
    const newUser = { 
      id: `usr-${Date.now()}`, 
      name: n, 
      email: `${n.replace(/\s+/g, "").toLowerCase()}@demo.com`, 
      role: r, 
      tenantId: selectedTenant.id 
    };
    login(newUser, selectedTenant);
    window.location.assign(r === "technician" ? "/technician-app" : "/");
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (user) {
    const path = user.role === "technician" ? "/technician-app" : "/";
    return <div className="min-h-screen bg-[#1A0F09] flex flex-col items-center justify-center gap-4"><p className="text-[#C9A227] font-bold">Welcome, {user.name}</p><button onClick={() => window.location.assign(path)} className="px-6 py-2 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm">Enter Platform</button></div>;
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-[#C9A227] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#C9A227]/20">
              <Wrench className="w-10 h-10 text-[#1A0F09]" />
            </div>
            <h1 className="text-3xl font-bold text-[#C9A227] mb-2">Ayla Maintenance</h1>
            <p className="text-[#C9A227]/50 text-sm">Multi-Tenant Maintenance Management</p>
          </div>

          <div className="bg-white/5 border border-[#C9A227]/20 rounded-2xl p-5 mb-6">
            <h3 className="text-[#C9A227] font-bold text-sm mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> دخول سريع (وضع العرض)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {DEMO_USERS.map((u) => (
                <button key={u.role} onClick={() => doDemoLogin(u.role, u.name)} className={`px-3 py-2 rounded-xl border text-xs font-bold text-center transition hover:scale-105 ${ROLE_COLORS[u.role]}`}>
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button key={r.key} onClick={() => router.push(`/auth/login?role=${r.key}`)} className="group relative bg-white/5 hover:bg-[#C9A227]/10 border border-[#C9A227]/10 hover:border-[#C9A227]/40 rounded-2xl p-6 text-right transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${ROLE_COLORS[r.key]}`}><Icon className="w-7 h-7" /></div>
                  </div>
                  <h3 className="text-lg font-bold text-[#C9A227] mb-1">{ROLE_LABELS[r.key]}</h3>
                  <p className="text-xs text-[#C9A227]/50">{r.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <button onClick={() => router.push("/auth/register")} className="text-[#C9A227] text-sm underline hover:text-[#e0b840] transition">سجل شركتك الجديدة →</button>
          </div>

          <p className="text-center text-[10px] text-[#C9A227]/30 mt-10">v2.0 — Ayla Maintenance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <button onClick={() => router.push("/auth/login")} className="flex items-center gap-2 text-[#C9A227]/60 text-sm mb-6 hover:text-[#C9A227] transition">← Back</button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A227] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C9A227]/20">
            <Wrench className="w-8 h-8 text-[#1A0F09]" />
          </div>
          <h1 className="text-2xl font-bold text-[#C9A227]">{ROLE_LABELS[role]}</h1>
        </div>

        <div className="flex bg-white/5 rounded-xl p-1 mb-4 border border-[#C9A227]/10">
          <button onClick={() => setMode("real")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${mode === "real" ? "bg-[#C9A227] text-[#1A0F09]" : "text-[#C9A227]/60"}`}>دخول حقيقي</button>
          <button onClick={() => setMode("demo")} className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${mode === "demo" ? "bg-[#C9A227] text-[#1A0F09]" : "text-[#C9A227]/60"}`}>وضع العرض</button>
        </div>

        {mode === "real" ? (
          <form onSubmit={handleRealLogin} className="bg-white/5 backdrop-blur border border-[#C9A227]/10 rounded-2xl p-6 space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${ROLE_COLORS[role]}`}>Role: {ROLE_LABELS[role]}</div>
            <div>
              <label className="text-xs text-[#C9A227]/60 block mb-1.5 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" required />
            </div>
            <div>
              <label className="text-xs text-[#C9A227]/60 block mb-1.5 flex items-center gap-1"><Lock className="w-3 h-3" /> Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" required />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <span className="w-5 h-5 border-2 border-[#1A0F09] border-t-transparent rounded-full animate-spin" /> : <><LogIn className="w-4 h-4" /> Login</>}
            </button>
            <p className="text-[10px] text-gray-500 text-center">Requires registered account</p>
          </form>
        ) : (
          <div className="bg-white/5 backdrop-blur border border-[#C9A227]/10 rounded-2xl p-6 space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${ROLE_COLORS[role]}`}>Demo: {ROLE_LABELS[role]}</div>
            <div>
              <label className="text-xs text-[#C9A227]/60 block mb-1.5">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" />
            </div>
            <button onClick={() => { if (!name.trim()) { alert("Name required"); return; } doDemoLogin(role, name.trim()); }} className="w-full py-3 rounded-xl bg-[#C9A227]/80 text-[#1A0F09] font-bold text-sm hover:bg-[#C9A227] transition flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Demo Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1A0F09] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginInner />
    </Suspense>
  );
}
