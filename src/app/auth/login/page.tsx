"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError("بيانات الدخول غير صحيحة");
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2C1810 0%, #3D2417 30%, #2C1810 60%, #1A0F09 100%)",
      }}
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(201,162,39,0.4) 0%, transparent 70%)",
            top: "-10%",
            right: "-10%",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* بطاقة تسجيل الدخول */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="relative p-[2px] rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 25%, #C9A227 50%, #B87333 75%, #C9A227 100%)",
          }}
        >
          <div
            className="relative rounded-2xl overflow-hidden p-8"
            style={{
              background: "linear-gradient(145deg, #3D2417 0%, #2C1810 50%, #1A0F09 100%)",
            }}
          >
            {/* خط ذهبي علوي */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #C9A227 20%, #E8D5A3 50%, #C9A227 80%, transparent 100%)",
              }}
            />

            {/* الشعار */}
            <div className="text-center mb-8 pt-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C9A227] via-[#E8D5A3] to-[#C9A227] p-[3px]">
                    <div className="w-full h-full rounded-full bg-[#1A0F09]" />
                  </div>
                  <div className="relative z-10 flex items-center justify-center w-20 h-20">
                    <Sparkles className="w-10 h-10 text-[#C9A227]" strokeWidth={1.5} />
                  </div>
                </div>
              </motion.div>

              <h1
                className="text-2xl font-bold mb-2"
                style={{
                  background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 50%, #C9A227 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                آيلا للصيانة
              </h1>
              <p className="text-[#E8D5A3] text-sm">نظام إدارة الصيانة الذكي المتكامل</p>
            </div>

            {/* خطأ */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-red-800/50 bg-red-950/30 text-red-300 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* النموذج */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* البريد */}
              <div>
                <label className="block text-[#E8D5A3] text-sm mb-2 font-medium">البريد الإلكتروني</label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ayla.com"
                    required
                    className="w-full pr-10 pl-4 py-3 rounded-lg text-[#F5E6D3] placeholder-[#5C3A2A] outline-none"
                    style={{
                      background: "rgba(26, 15, 9, 0.8)",
                      border: "1px solid rgba(201, 162, 39, 0.2)",
                      fontFamily: "Tajawal, sans-serif",
                    }}
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-[#E8D5A3] text-sm mb-2 font-medium">كلمة المرور</label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10 pl-12 py-3 rounded-lg text-[#F5E6D3] placeholder-[#5C3A2A] outline-none"
                    style={{
                      background: "rgba(26, 15, 9, 0.8)",
                      border: "1px solid rgba(201, 162, 39, 0.2)",
                      fontFamily: "Tajawal, sans-serif",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A227] hover:text-[#E8D5A3] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* زر الدخول */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg font-bold text-[#1A0F09] transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #C9A227 0%, #E8D5A3 50%, #C9A227 100%)",
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-[#1A0F09] border-t-transparent rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  "تسجيل الدخول"
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}