"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Settings, ArrowRight, Users, AlertTriangle, RotateCcw, Zap,
  MapPin, Wifi, WifiOff, MessageCircle, School,
} from "lucide-react";
import {
  getOfflineComplaints, distributeComplaints, getTeams,
  type OfflineComplaint, type Team,
} from "@/lib/offline-store";

export default function DistributorPage() {
  const { tenant } = useAuth();
  const [isDistributing, setIsDistributing] = useState(false);
  const [logs, setLogs] = useState<OfflineComplaint[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState({
    pending: 0, available: 0, today: 0, whatsapp: 0, education: 0,
  });
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    refresh();
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const refresh = () => {
    const complaints = getOfflineComplaints();
    const allTeams = getTeams();
    setLogs(complaints.filter((c) => c.distributed).slice(0, 20));
    setTeams(allTeams);
    setStats({
      pending: complaints.filter((c) => c.status === "جديد").length,
      available: allTeams.filter((t) => t.status === "متاح").length,
      today: complaints.filter((c) => c.distributed).length,
      whatsapp: complaints.filter((c) => c.source === "whatsapp").length,
      education: complaints.filter((c) => c.source === "education_app").length,
    });
  };

  const handleDistribute = () => {
    setIsDistributing(true);
    setTimeout(() => {
      distributeComplaints();
      refresh();
      setIsDistributing(false);
    }, 1500);
  };

  const getSourceIcon = (source: string) => {
    if (source === "whatsapp")
      return <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />;
    if (source === "education_app")
      return <School className="w-3.5 h-3.5 text-blue-500" />;
    return <Zap className="w-3.5 h-3.5 text-amber-500" />;
  };

  const getSourceLabel = (source: string) => {
    if (source === "whatsapp") return "واتساب";
    if (source === "education_app") return "منصة التعليم";
    if (source === "smart_distributor") return "موزع ذكي";
    return "يدوي";
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A0F09]">
            الموزع الذكي 24/7
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            استقبال وتوزيع تلقائي — يعمل Offline وOnline — {tenant?.nameAr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}
            {isOnline ? "متصل — الاستقبال نشط" : "غير متصل — يعمل Offline"}
          </div>
          <button
            onClick={refresh}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={handleDistribute}
            disabled={isDistributing}
            className="px-6 py-3 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold text-sm hover:bg-[#b89420] transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#C9A227]/20"
          >
            <Settings
              className={`w-5 h-5 ${isDistributing ? "animate-spin" : ""}`}
            />
            {isDistributing ? "جاري التوزيع..." : "توزيع ذكي"}
          </button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-sm text-gray-500">قيد الانتظار</span>
          </div>
          <p className="text-3xl font-black text-[#1A0F09]">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="text-sm text-gray-500">الفرق المتاحة</span>
          </div>
          <p className="text-3xl font-black text-[#1A0F09]">{stats.available}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-700" />
            </div>
            <span className="text-sm text-gray-500">موزعة</span>
          </div>
          <p className="text-3xl font-black text-[#1A0F09]">{stats.today}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">واتساب</span>
          </div>
          <p className="text-3xl font-black text-emerald-600">
            {stats.whatsapp}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <School className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">منصة التعليم</span>
          </div>
          <p className="text-3xl font-black text-blue-600">
            {stats.education}
          </p>
        </div>
      </div>

      {/* سجل التوزيع + الفرق */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* سجل التوزيع */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-[#1A0F09] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#C9A227]" />
            سجل التوزيع
          </h3>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            {logs.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-[#FAF7F2] rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1A0F09] truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.team || "غير موزع"} • {item.school}{" "}
                      {item.schoolRef && (
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded mr-1">
                          {item.schoolRef}
                        </span>
                      )}
                      <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded mr-1">
                        ذكي
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100"
                    title={getSourceLabel(item.source)}
                  >
                    {getSourceIcon(item.source)}
                    <span className="text-[10px] text-gray-500">
                      {getSourceLabel(item.source)}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">
                لا توجد بلاغات موزعة بعد
              </p>
            )}
          </div>
        </div>

        {/* الفرق والمدارس */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-[#1A0F09] mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#C9A227]" />
            حالة الفرق والمدارس
          </h3>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            {teams.map((t) => (
              <div key={t.id} className="p-4 bg-[#FAF7F2] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm text-[#1A0F09]">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t.specialty.join(" + ")} • {t.members} أعضاء
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-500">
                      حمل: {t.currentLoad}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        t.status === "متاح"
                          ? "bg-emerald-100 text-emerald-700"
                          : t.status === "مشغول"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(t.schools || []).map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}