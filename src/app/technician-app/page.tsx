"use client";

import { useAuth } from "@/lib/auth-context";
import { LogOut } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Lock, Wrench } from "lucide-react";

export default function TechnicianLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/technician/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل تسجيل الدخول");

      localStorage.setItem("technicianToken", data.token);
      localStorage.setItem("technicianId", data.technicianId);
      localStorage.setItem("technicianName", data.name);

      window.location.href = "/technician-app/reports";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #1A0F09 0%, #2C1810 100%)" }}>
<div className="technician-logout-bar fixed top-0 left-0 right-0 z-50 bg-[#1A0F09]/90 backdrop-blur border-b border-[#C9A227]/10 px-4 py-3 flex items-center justify-between">
  <span className="text-[#C9A227] font-bold text-sm">Ayla — Technician App</span>
  <button onClick={() => { logout(); window.location.assign("/auth/login"); }} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-600/30 transition">
    <LogOut className="w-3 h-3" /> Exit
  </button>
</div>
<div className="h-14" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
<div className="technician-logout-bar fixed top-0 left-0 right-0 z-50 bg-[#1A0F09]/90 backdrop-blur border-b border-[#C9A227]/10 px-4 py-3 flex items-center justify-between">
  <span className="text-[#C9A227] font-bold text-sm">Ayla — Technician App</span>
  <button onClick={() => { logout(); window.location.assign("/auth/login"); }} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-600/30 transition">
    <LogOut className="w-3 h-3" /> Exit
  </button>
</div>
<div className="h-14" />
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #C9A227 0%, #D4AF37 100%)" }}>
<div className="technician-logout-bar fixed top-0 left-0 right-0 z-50 bg-[#1A0F09]/90 backdrop-blur border-b border-[#C9A227]/10 px-4 py-3 flex items-center justify-between">
  <span className="text-[#C9A227] font-bold text-sm">Ayla — Technician App</span>
  <button onClick={() => { logout(); window.location.assign("/auth/login"); }} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-600/30 transition">
    <LogOut className="w-3 h-3" /> Exit
  </button>
</div>
<div className="h-14" />
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#C9A227]">تطبيق الفني</h1>
          <p className="text-[#C9A227]/60 mt-2">آيلا للصيانة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
<div className="technician-logout-bar fixed top-0 left-0 right-0 z-50 bg-[#1A0F09]/90 backdrop-blur border-b border-[#C9A227]/10 px-4 py-3 flex items-center justify-between">
  <span className="text-[#C9A227] font-bold text-sm">Ayla — Technician App</span>
  <button onClick={() => { logout(); window.location.assign("/auth/login"); }} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-600/30 transition">
    <LogOut className="w-3 h-3" /> Exit
  </button>
</div>
<div className="h-14" />
            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A227]" />
            <input type="tel" placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full pr-12 pl-4 py-4 rounded-xl bg-white/5 border border-[#C9A227]/20 text-white placeholder-[#C9A227]/40 focus:border-[#C9A227] focus:outline-none transition-all" dir="rtl" />
          </div>

          <div className="relative">
<div className="technician-logout-bar fixed top-0 left-0 right-0 z-50 bg-[#1A0F09]/90 backdrop-blur border-b border-[#C9A227]/10 px-4 py-3 flex items-center justify-between">
  <span className="text-[#C9A227] font-bold text-sm">Ayla — Technician App</span>
  <button onClick={() => { logout(); window.location.assign("/auth/login"); }} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-600/30 transition">
    <LogOut className="w-3 h-3" /> Exit
  </button>
</div>
<div className="h-14" />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C9A227]" />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-12 pl-4 py-4 rounded-xl bg-white/5 border border-[#C9A227]/20 text-white placeholder-[#C9A227]/40 focus:border-[#C9A227] focus:outline-none transition-all" dir="rtl" />
          </div>

          {error && <div className="text-red-400 text-sm text-center">
<div className="technician-logout-bar fixed top-0 left-0 right-0 z-50 bg-[#1A0F09]/90 backdrop-blur border-b border-[#C9A227]/10 px-4 py-3 flex items-center justify-between">
  <span className="text-[#C9A227] font-bold text-sm">Ayla — Technician App</span>
  <button onClick={() => { logout(); window.location.assign("/auth/login"); }} className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-600/30 transition">
    <LogOut className="w-3 h-3" /> Exit
  </button>
</div>
<div className="h-14" />{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-[#1A0F09] transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #D4AF37 100%)" }}>
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
