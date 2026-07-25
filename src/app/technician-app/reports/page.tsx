"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ClipboardList, MapPin, Clock, LogOut, Bell, RefreshCw } from "lucide-react";

interface Report {
  id: string;
  reportNo: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  school: { name: string; address: string | null } | null;
  receivedAt: string;
}

export default function TechnicianReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [techName, setTechName] = useState("");
  const router = useRouter();

  // 🔊 صوت ding
  const playDing = useCallback(() => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1200;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("technicianToken");
    const technicianId = localStorage.getItem("technicianId");
    const name = localStorage.getItem("technicianName");

    if (!token || !technicianId) {
      router.push("/technician-app");
      return;
    }

    setTechName(name || "فني");

    const fetchReports = async () => {
      try {
        const res = await fetch(`/api/technician/reports?technicianId=${technicianId}`);
        if (res.status === 401) {
          localStorage.removeItem("technicianToken");
          localStorage.removeItem("technicianId");
          localStorage.removeItem("technicianName");
          router.push("/technician-app");
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setReports(list);

        // صوت إذا في بلاغات جديدة
        const newReports = list.filter((r: Report) => r.status === "ASSIGNED");
        if (newReports.length > 0) playDing();
      } catch (error) {
        console.error("Error:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [router, playDing]);

  const handleLogout = () => {
    if (confirm("تأكيد تسجيل الخروج؟")) {
      localStorage.removeItem("technicianToken");
      localStorage.removeItem("technicianId");
      localStorage.removeItem("technicianName");
      window.location.href = "/technician-app";
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "URGENT": return "bg-red-500";
      case "HIGH": return "bg-orange-500";
      case "MEDIUM": return "bg-yellow-500";
      default: return "bg-green-500";
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
    <div className="min-h-screen pb-20 bg-[#FAF7F2]">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b border-[#C9A227]/15 flex items-center justify-between bg-white shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#2C1810]">البلاغات الموجهة لي</h1>
          <p className="text-xs text-[#5C3A2A]">{techName}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={playDing} className="p-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227] active:scale-95 transition" title="تجربة الصوت">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => window.location.reload()} className="p-2 rounded-lg bg-[#C9A227]/10 text-[#C9A227] active:scale-95 transition" title="تحديث">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-lg bg-red-50 text-red-500 active:scale-95 transition" title="خروج">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-3 gap-3 mb-2">
        <div className="p-3 rounded-xl bg-white border border-[#C9A227]/15 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#C9A227]">{reports.length}</div>
          <div className="text-[10px] text-[#5C3A2A]">الكل</div>
        </div>
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-center shadow-sm">
          <div className="text-2xl font-bold text-red-500">
            {reports.filter((r) => r.priority === "URGENT" || r.priority === "HIGH").length}
          </div>
          <div className="text-[10px] text-red-400">عاجل</div>
        </div>
        <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {reports.filter((r) => r.status === "ASSIGNED").length}
          </div>
          <div className="text-[10px] text-green-500">جديد</div>
        </div>
      </div>

      {/* Reports List */}
      <div className="p-4 space-y-3">
        {reports.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>لا توجد بلاغات موجهة لك حالياً</p>
          </div>
        ) : (
          reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => router.push(`/technician-app/reports/${report.id}`)}
              className="p-4 rounded-xl border border-[#C9A227]/10 cursor-pointer active:scale-95 transition-all bg-white shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[#2C1810] mb-1">{report.title}</h3>
                  <p className="text-sm text-[#5C3A2A] line-clamp-2">{report.description}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(report.priority)}`} />
              </div>
              <div className="flex items-center gap-4 text-xs text-[#5C3A2A]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {report.school?.name || "—"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(report.receivedAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs bg-[#C9A227]/10 text-[#C9A227]">
                  {report.category}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    report.status === "ASSIGNED"
                      ? "bg-blue-50 text-blue-500"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {report.status === "ASSIGNED" ? "موجه" : "قيد العمل"}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}