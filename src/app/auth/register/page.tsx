"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !name.trim() || !email.trim() || !password.trim()) {
      alert("All fields required"); return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Company created! Login now.");
        router.push("/auth/login");
      } else {
        alert(data.error || "Failed");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0F09] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <button onClick={() => router.push("/auth/login")} className="flex items-center gap-2 text-[#C9A227]/60 text-sm mb-6 hover:text-[#C9A227] transition">← Back</button>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C9A227] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C9A227]/20">
            <Building2 className="w-8 h-8 text-[#1A0F09]" />
          </div>
          <h1 className="text-2xl font-bold text-[#C9A227]">سجل شركتك</h1>
          <p className="text-[#C9A227]/50 text-sm mt-1">14 يوم مجانا</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur border border-[#C9A227]/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">Company Name *</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="مثال: شركة النور للصيانة" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" required />
          </div>
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">Admin Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" required />
          </div>
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@company.com" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" required />
          </div>
          <div>
            <label className="text-xs text-[#C9A227]/60 block mb-1.5">Password *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full px-4 py-3 rounded-xl bg-[#2C1810] border border-[#C9A227]/20 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#C9A227]" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm hover:bg-[#b89420] transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="w-5 h-5 border-2 border-[#1A0F09] border-t-transparent rounded-full animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Create Account</>}
          </button>
        </form>
      </div>
    </div>
  );
}
