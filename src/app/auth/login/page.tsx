"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Wrench, Shield } from "lucide-react";

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
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #1A0F09 0%, #2C1810 50%, #1A0F09 100%)" }}>
      {/* الجانب الأيسر - الشعار والمعلومات */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        {/* دوائر زخرفية */}
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-[#C9A227]/5 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#C9A227]/10 blur-3xl" />
        
        <div className="relative z-10 text-center">
          {/* الشعار الدائري */}
          <div className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center relative"
            style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
            <div className="w-28 h-28 rounded-full bg-[#1A0F09] flex items-center justify-center">
              <Wrench className="w-14 h-14 text-[#C9A227]" />
            </div>
            {/* حلقة خارجية متحركة */}
            <div className="absolute inset-0 rounded-full border-2 border-[#C9A227]/30 animate-pulse" />
          </div>
          
          <h1 className="text-4xl font-bold text-[#C9A227] mb-4" style={{ fontFamily: "var(--font-tajawal), sans-serif" }}>
            Ayla Maintenance
          </h1>
          <p className="text-xl text-[#FAF7F2]/80 mb-2">آيلا للصيانة</p>
          <p className="text-sm text-[#FAF7F2]/50">نظام إدارة الصيانة المدرسية المتكامل</p>
          
          {/* مميزات */}
          <div className="mt-12 space-y-4 text-right">
            {[
              { icon: Shield, text: "إدارة آمنة وموثوقة" },
              { icon: Wrench, text: "تتبع الصيانة الدورية" },
              { icon: LogIn, text: "تقارير فورية ومفصلة" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-[#FAF7F2]/70">
                <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-[#C9A227]" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الجانب الأيمن - نموذج الدخول */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* الشعار للجوال */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}>
              <Wrench className="w-10 h-10 text-[#1A0F09]" />
            </div>
            <h1 className="text-2xl font-bold text-[#C9A227]">Ayla Maintenance</h1>
            <p className="text-sm text-[#FAF7F2]/60 mt-1">آيلا للصيانة</p>
          </div>

          {/* البطاقة */}
          <div className="rounded-2xl p-8 relative overflow-hidden"
            style={{ 
              background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)",
              border: "1px solid rgba(201, 162, 39, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            }}>
            {/* زخرفة علوية */}
            <div className="absolute top-0 left-0 right-0 h-1" 
              style={{ background: "linear-gradient(90deg, #C9A227 0%, #E8D5A3 50%, #C9A227 100%)" }} />
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: "var(--font-tajawal), sans-serif" }}>
                تسجيل الدخول
              </h2>
              <p className="text-sm text-[#5C3A2A] mt-1">أدخل بياناتك للوصول إلى النظام</p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-100 text-red-800 text-sm text-center border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#5C3A2A] mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 text-sm transition-all"
                    placeholder="example@ayla.com"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A227]/40">
                    <LogIn className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C3A2A] mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-12 rounded-xl border border-[#C9A227]/20 bg-white text-[#2C1810] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 text-sm transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C3A2A] hover:text-[#C9A227] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-[#1A0F09] font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-[#C9A227]/30 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#1A0F09]/30 border-t-[#1A0F09] rounded-full animate-spin" />
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  "تسجيل الدخول"
                )}
              </button>
            </form>

            {/* التوقيع */}
            <div className="mt-8 pt-4 border-t border-[#C9A227]/20 text-center">
              <p className="text-xs text-[#5C3A2A]/60">
                مسؤول النظام<br/>
                <span className="text-[#C9A227] font-medium">م. محمد عبد الرحمن</span>
              </p>
            </div>
          </div>

          {/* حقوق */}
          <p className="text-center text-xs text-[#FAF7F2]/30 mt-6">
            © 2026 Ayla Maintenance. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}