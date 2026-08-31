"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Building2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await login(email, password); }
    catch { setError("بيانات الدخول غير صحيحة"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#C9A227]/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#C9A227]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-[#C9A227]" />
          </div>
          <h1 className="text-2xl font-black text-[#1A0F09]">آيلا للصيانة</h1>
          <p className="text-gray-500 text-sm mt-2">تسجيل الدخول للنظام</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1A0F09] mb-2">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:outline-none text-sm"
              placeholder="admin@ayla.sa" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1A0F09] mb-2">كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A227] focus:outline-none text-sm"
              placeholder="••••••••" required />
          </div>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center font-bold">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm hover:bg-[#b89420] transition disabled:opacity-50">
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>نظام آيلا للصيانة — الإصدار 2.0</p>
        </div>
      </div>
    </div>
  );
}
