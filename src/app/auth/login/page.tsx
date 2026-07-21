"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <div className="w-full max-w-md">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <LogIn className="w-10 h-10 text-[#1A0F09]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>آيلا للصيانة</h1>
          <p className="text-sm text-[#5C3A2A] mt-1">تسجيل الدخول إلى النظام</p>
        </div>

        {/* النموذج */}
        <div className="rounded-2xl p-8" style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)", border: "1px solid rgba(201, 162, 39, 0.15)", boxShadow: "0 4px 20px rgba(201, 162, 39, 0.08)" }}>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] text-sm"
                placeholder="example@ayla.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C3A2A] mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] text-sm pl-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C3A2A] hover:text-[#2C1810]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-[#1A0F09] font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/register" className="text-sm text-[#5C3A2A] hover:text-[#C9A227] transition-colors">
              ليس لديك حساب؟ سجل الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}