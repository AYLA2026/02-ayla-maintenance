"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bot, Zap, CheckCircle, AlertTriangle, RefreshCw,
  ArrowRight, MapPin, Clock, User, Star, MessageSquare,
  Send
} from "lucide-react";

interface AutoReport {
  id: string;
  title: string;
  description: string;
  school: string;
  category: string;
  priority: string;
  status: string;
  technicianName?: string;
  createdAt: string;
  source: string;
  from: string;
}

export default function AutoDispatchPage() {
  const router = useRouter();
  const [reports, setReports] = useState<AutoReport[]>([]);
  const [stats, setStats] = useState({ total: 0, auto: 0, manual: 0 });
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports/incoming");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setReports(list);
      setStats({
        total: list.length,
        auto: list.filter((r: any) => r.technicianId).length,
        manual: list.filter((r: any) => !r.technicianId).length,
      });
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const iv = setInterval(fetchReports, 10000); // تحديث كل 10 ثواني
    return () => clearInterval(iv);
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "URGENT": return "bg-red-100 text-red-600 border-red-200";
      case "HIGH": return "bg-orange-100 text-orange-600 border-orange-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-600 border-yellow-200";
      default: return "bg-green-100 text-green-600 border-green-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-8 h-8 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2C1810] flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
              <Bot className="w-8 h-8 text-[#C9A227]" />
              التوزيع الذكي الأوتوماتيكي
            </h1>
            <p className="text-[#5C3A2A] mt-1">واتساب → AI → فني — بدون تدخل يدوي</p>
          </div>
          <button
            onClick={fetchReports}
            className="p-2 rounded-xl bg-white border border-[#C9A227]/20 text-[#C9A227] active:scale-95 transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white border border-[#C9A227]/15 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#C9A227]">{stats.total}</div>
            <div className="text-sm text-[#5C3A2A]">إجمالي البلاغات</div>
          </div>
          <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" /> {stats.auto}
            </div>
            <div className="text-sm text-green-700">موزع ذكياً</div>
          </div>
          <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100 text-center shadow-sm">
            <div className="text-3xl font-bold text-yellow-600">{stats.manual}</div>
            <div className="text-sm text-yellow-700">في الانتظار</div>
          </div>
        </div>

        {/* Reports */}
        <div className="grid gap-4">
          {reports.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>لا توجد بلاغات واردة بعد</p>
              <p className="text-sm mt-2">أرسل رسالة واتساب تجريبية لاختبار التوزيع الذكي</p>
            </div>
          ) : (
            reports.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-white border border-[#C9A227]/10 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(r.priority)}`}>
                        {r.priority === "URGENT" ? "عاجل" : r.priority === "HIGH" ? "عالي" : r.priority === "MEDIUM" ? "متوسط" : "منخفض"}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                        📱 واتساب
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-gray-50 text-gray-500 text-xs font-bold border border-gray-100">
                        {r.category}
                      </span>
                      {r.technicianName ? (
                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-bold border border-green-100 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> موزع ذكياً
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg bg-yellow-50 text-yellow-600 text-xs font-bold border border-yellow-100">
                          ⏳ يدوي
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#2C1810] mb-1">{r.title}</h3>
                    <p className="text-sm text-[#5C3A2A] mb-3">{r.description}</p>

                    <div className="flex items-center gap-6 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.school}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(r.createdAt).toLocaleString("ar-SA")}</span>
                      <span>📞 {r.from}</span>
                    </div>

                    {r.technicianName && (
                      <div className="mt-3 p-2 rounded-lg bg-green-50 border border-green-100 flex items-center gap-2 w-fit">
                        <User className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-bold">موجه لـ: {r.technicianName}</span>
                        <Star className="w-3 h-3 text-[#C9A227] fill-[#C9A227]" />
                      </div>
                    )}
                  </div>

                  <div className="mr-4 flex flex-col gap-2">
                    {!r.technicianName && (
                      <button
                        onClick={() => router.push(`/reports/dispatch/${r.id}`)}
                        className="px-4 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm flex items-center gap-2 hover:bg-[#D4AF37] transition"
                      >
                        <Send className="w-4 h-4" /> توزيع يدوي
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}