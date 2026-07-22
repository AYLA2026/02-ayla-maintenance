"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import StatCard from "@/components/layout/StatCard";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  MapPin,
  Phone,
  Wrench,
  Star,
  X,
  Printer,
} from "lucide-react";

interface Report {
  id: string;
  reportNo: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  senderPhone: string;
  senderName: string;
  school: { name: string; referenceNo: string } | null;
  supervisor: { name: string } | null;
  technician: { name: string; phone: string } | null;
  images: any;
  receivedAt: string;
  feedback: string | null;
  rating: number | null;
}

export default function ComplaintsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const demoReports: Report[] = [
    {
      id: "1",
      reportNo: "REP-001",
      title: "عطل في المكيف",
      description: "المكيف الرئيسي في الفصل A لا يعمل منذ الصباح",
      category: "HVAC",
      priority: "HIGH",
      status: "PENDING",
      senderPhone: "966501234567",
      senderName: "مدرسة النور",
      school: { name: "مدرسة النور", referenceNo: "SCH-001" },
      supervisor: { name: "أحمد محمد" },
      technician: null,
      images: null,
      receivedAt: "2026-07-22T08:30:00Z",
      feedback: null,
      rating: null,
    },
    {
      id: "2",
      reportNo: "REP-002",
      title: "تسرب مياه",
      description: "تسرب مياه في دورة المياه الطابق الأول",
      category: "PLUMBING",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      senderPhone: "966509876543",
      senderName: "مدرسة الفجر",
      school: { name: "مدرسة الفجر", referenceNo: "SCH-002" },
      supervisor: { name: "خالد عبدالله" },
      technician: { name: "محمد الفني", phone: "966501112223" },
      images: null,
      receivedAt: "2026-07-21T14:20:00Z",
      feedback: null,
      rating: null,
    },
    {
      id: "3",
      reportNo: "REP-003",
      title: "إنارة خارجة",
      description: "لمبات الفصل B تحتاج تغيير",
      category: "ELECTRICAL",
      priority: "LOW",
      status: "CLOSED",
      senderPhone: "966503334444",
      senderName: "مدرسة الروضة",
      school: { name: "مدرسة الروضة", referenceNo: "SCH-003" },
      supervisor: { name: "سعد علي" },
      technician: { name: "يوسف الفني", phone: "966505556666" },
      images: JSON.stringify([
        { url: "/demo-before.jpg", type: "before" },
        { url: "/demo-after.jpg", type: "after" },
      ]),
      receivedAt: "2026-07-20T09:00:00Z",
      feedback: "تم تغيير اللمبات بنجاح",
      rating: 5,
    },
    {
      id: "4",
      reportNo: "REP-004",
      title: "صرف مغلق",
      description: "انسداد في مواسير الصرف الرئيسية",
      category: "PLUMBING",
      priority: "URGENT",
      status: "ASSIGNED",
      senderPhone: "966507778888",
      senderName: "مدرسة الأمل",
      school: { name: "مدرسة الأمل", referenceNo: "SCH-004" },
      supervisor: { name: "فهد سالم" },
      technician: { name: "عبدالرحمن الفني", phone: "966509999000" },
      images: null,
      receivedAt: "2026-07-22T10:15:00Z",
      feedback: null,
      rating: null,
    },
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setReports(demoReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchFilter = filter === "ALL" || r.status === filter;
    const matchSearch =
      r.reportNo.includes(search) ||
      r.title.includes(search) ||
      r.school?.name.includes(search) ||
      r.senderPhone.includes(search);
    return matchFilter && matchSearch;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "جديد";
      case "ASSIGNED": return "موجه";
      case "IN_PROGRESS": return "قيد المعالجة";
      case "COMPLETED": return "مكتمل";
      case "CLOSED": return "مغلق";
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-blue-100 text-blue-800";
      case "ASSIGNED": return "bg-purple-100 text-purple-800";
      case "IN_PROGRESS": return "bg-amber-100 text-amber-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "CLOSED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "URGENT": return "عاجل";
      case "HIGH": return "عالي";
      case "MEDIUM": return "متوسط";
      case "LOW": return "منخفض";
      default: return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800 border-red-300";
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-300";
      case "MEDIUM": return "bg-amber-100 text-amber-800 border-amber-300";
      case "LOW": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ELECTRICAL": return "⚡";
      case "PLUMBING": return "🔧";
      case "HVAC": return "❄️";
      case "CARPENTRY": return "🪚";
      case "PAINTING": return "🎨";
      case "CLEANING": return "🧹";
      case "SECURITY": return "🔒";
      case "IT": return "💻";
      default: return "📦";
    }
  };

  const stats = {
    total: reports.length,
    new: reports.filter((r) => r.status === "PENDING").length,
    inProgress: reports.filter((r) => r.status === "IN_PROGRESS" || r.status === "ASSIGNED").length,
    completed: reports.filter((r) => r.status === "CLOSED" || r.status === "COMPLETED").length,
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader title="البلاغات الذكية" subtitle="استقبال وتوجيه البلاغات تلقائياً من واتساب والمنصات" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي البلاغات" value={stats.total.toString()} icon={MessageSquare} delay={0} />
        <StatCard title="جديدة" value={stats.new.toString()} icon={AlertTriangle} delay={0.1} />
        <StatCard title="قيد المعالجة" value={stats.inProgress.toString()} icon={Clock} delay={0.2} />
        <StatCard title="مكتملة" value={stats.completed.toString()} icon={CheckCircle} delay={0.3} />
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A227]/60" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث برقم البلاغ، المدرسة، أو الرقم..." className="w-full bg-[#FAF7F2] border border-[#C9A227]/20 rounded-xl pr-10 pl-4 py-2.5 text-[#2C1810] placeholder-[#C9A227]/40 focus:outline-none focus:border-[#C9A227] text-sm" style={{ fontFamily: "Tajawal, sans-serif" }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ key: "ALL", label: "الكل" }, { key: "PENDING", label: "جديد" }, { key: "ASSIGNED", label: "موجه" }, { key: "IN_PROGRESS", label: "قيد المعالجة" }, { key: "CLOSED", label: "مغلق" }].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? "bg-[#C9A227] text-[#1A0F09]" : "bg-[#FAF7F2] text-[#5C3A2A] border border-[#C9A227]/20 hover:border-[#C9A227]/50"}`} style={{ fontFamily: "Tajawal, sans-serif" }}>{f.label}</button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>قائمة البلاغات</h2>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227] hover:bg-[#C9A227]/20 transition text-sm">
            <RefreshCw className="w-4 h-4" />تحديث
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#C9A227]">جاري التحميل...</div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredReports.map((report) => (
                <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onClick={() => setSelectedReport(report)} className="p-4 rounded-xl border border-[#C9A227]/15 hover:border-[#C9A227]/40 transition-all cursor-pointer" style={{ background: "linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-[#C9A227] font-bold text-sm">#{report.reportNo}</span>
                        <h3 className="font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{getCategoryIcon(report.category)} {report.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(report.priority)}`}>{getPriorityLabel(report.priority)}</span>
                      </div>
                      <p className="text-sm text-[#5C3A2A] mb-2 line-clamp-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[#C9A227]/70 flex-wrap">
                        {report.school && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.school.name} ({report.school.referenceNo})</span>}
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{report.senderPhone}</span>
                        {report.technician && <span className="flex items-center gap-1 text-[#C9A227]"><Wrench className="w-3 h-3" />{report.technician.name}</span>}
                        <span>{new Date(report.receivedAt).toLocaleString("ar-SA")}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>{getStatusLabel(report.status)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredReports.length === 0 && <div className="text-center py-12 text-[#C9A227]/60">لا توجد بلاغات مطابقة للبحث</div>}
          </div>
        )}
      </Card>

      <AnimatePresence>
        {selectedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedReport(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-[#FAF7F2] border border-[#C9A227]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" style={{ fontFamily: "Tajawal, sans-serif" }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[#C9A227] font-bold">#{selectedReport.reportNo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getPriorityColor(selectedReport.priority)}`}>{getPriorityLabel(selectedReport.priority)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{getCategoryIcon(selectedReport.category)} {selectedReport.title}</h2>
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#5C3A2A]"><X className="w-5 h-5" /></button>
              </div>

              {selectedReport.images && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-[#5C3A2A] mb-3">📸 صور البلاغ</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {JSON.parse(selectedReport.images).map((img: any, i: number) => (
                      <div key={i} className="relative">
                        <div className="w-full h-32 rounded-xl flex items-center justify-center text-4xl" style={{ background: "linear-gradient(145deg, #F5E6D3 0%, #FAF7F2 100%)" }}>{img.type === "before" ? "📷 قبل" : "✅ بعد"}</div>
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs text-white ${img.type === "before" ? "bg-red-500" : "bg-green-500"}`}>{img.type === "before" ? "قبل" : "بعد"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl" style={{ background: "linear-gradient(145deg, #F5E6D3 0%, #FAF7F2 100%)" }}>
                    <div className="text-xs text-[#C9A227]/60 mb-1">الحالة</div>
                    <div className={`text-sm font-bold ${selectedReport.status === "CLOSED" ? "text-green-600" : "text-[#C9A227]"}`}>{getStatusLabel(selectedReport.status)}</div>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "linear-gradient(145deg, #F5E6D3 0%, #FAF7F2 100%)" }}>
                    <div className="text-xs text-[#C9A227]/60 mb-1">الفئة</div>
                    <div className="text-sm font-bold text-[#2C1810]">{getCategoryIcon(selectedReport.category)} {selectedReport.category}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ background: "linear-gradient(145deg, #F5E6D3 0%, #FAF7F2 100%)" }}>
                  <div className="text-xs text-[#C9A227]/60 mb-2">الوصف</div>
                  <p className="text-sm text-[#2C1810]">{selectedReport.description}</p>
                </div>

                {selectedReport.technician && (
                  <div className="p-4 rounded-xl" style={{ background: "linear-gradient(145deg, #F5E6D3 0%, #FAF7F2 100%)" }}>
                    <div className="text-xs text-[#C9A227]/60 mb-2">👨‍🔧 الفني المسؤول</div>
                    <div className="text-sm font-bold text-[#2C1810]">{selectedReport.technician.name}</div>
                    <div className="text-xs text-[#5C3A2A]">{selectedReport.technician.phone}</div>
                  </div>
                )}

                {selectedReport.feedback && (
                  <div className="p-4 rounded-xl" style={{ background: "linear-gradient(145deg, #F5E6D3 0%, #FAF7F2 100%)" }}>
                    <div className="text-xs text-[#C9A227]/60 mb-2">📝 ملاحظات الفني</div>
                    <p className="text-sm text-[#2C1810]">{selectedReport.feedback}</p>
                    {selectedReport.rating && <div className="mt-2 text-[#C9A227]"><Star className="w-4 h-4 inline" />{"⭐".repeat(selectedReport.rating)}</div>}
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات - مع زر التقرير الجديد */}
              <div className="flex gap-3 mt-6 flex-wrap">
                <button className="flex-1 min-w-[120px] bg-[#C9A227] text-[#1A0F09] py-3 rounded-xl font-bold hover:bg-[#C9A227]/90 transition text-sm">
                  <MessageSquare className="w-4 h-4 inline ml-2" />مراسلة الفني
                </button>

                {/* زر توليد التقرير PDF */}
                <button 
                  onClick={() => window.open(`/api/reports/${selectedReport.id}/pdf`, '_blank')}
                  className="flex-1 min-w-[120px] bg-[#2C1810] text-[#FAF7F2] py-3 rounded-xl font-bold hover:bg-[#1A0F09] transition text-sm border border-[#C9A227]/30"
                >
                  <Printer className="w-4 h-4 inline ml-2" />طباعة التقرير
                </button>

                {selectedReport.status !== "CLOSED" && (
                  <button className="flex-1 min-w-[120px] bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition text-sm">
                    <CheckCircle className="w-4 h-4 inline ml-2" />إغلاق البلاغ
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}