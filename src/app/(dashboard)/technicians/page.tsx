"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/layout/Card";
import {
  Wrench,
  Phone,
  Mail,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  X,
  CheckCircle2
} from "lucide-react";

interface Technician {
  id: string;
  name: string;
  phone: string;
  whatsappNo: string;
  email: string | null;
  specialty: string | null;
  isActive: boolean;
  isAvailable: boolean;
  _count: { reports: number };
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newTechnician, setNewTechnician] = useState({
    name: "",
    phone: "",
    whatsappNo: "",
    email: "",
    password: "",
    specialty: "",
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/technicians");

      if (!res.ok) {
        throw new Error("فشل تحميل الفنيين");
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("استجابة غير صالحة من الخادم");
      }

      const data = await res.json();
      setTechnicians(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "فشل تحميل الفنيين");
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  };

  const addTechnician = async () => {
    try {
      setError("");
      setSuccess("");

      // تحقق من البيانات
      if (!newTechnician.name || !newTechnician.phone || !newTechnician.whatsappNo || !newTechnician.password) {
        setError("الرجاء ملء جميع الحقول المطلوبة");
        return;
      }

      const res = await fetch("/api/technicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTechnician),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "فشل إنشاء الفني");
        return;
      }

      setSuccess("✅ تم إضافة الفني بنجاح!");
      setShowAddModal(false);
      setNewTechnician({ name: "", phone: "", whatsappNo: "", email: "", password: "", specialty: "" });

      setTimeout(() => {
        fetchTechnicians();
        setSuccess("");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "فشل إنشاء الفني");
    }
  };

  const getSpecialtyLabel = (specialty: string | null) => {
    const labels: Record<string, string> = {
      ELECTRICAL: "⚡ كهرباء",
      PLUMBING: "🔧 سباكة",
      HVAC: "❄️ تكييف",
      CARPENTRY: "🪚 نجارة",
      PAINTING: "🎨 دهان",
      CLEANING: "🧹 نظافة",
      SECURITY: "🔒 أمن",
      IT: "💻 تقنية معلومات",
      GENERAL: "🔧 عام",
    };
    return labels[specialty || ""] || specialty || "عام";
  };

  return (
    <div className="p-8 min-h-screen" style={{ background: "linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%)" }}>
      <PageHeader title="👨‍🔧 إدارة الفنيين" subtitle="إدارة فريق الصيانة وتتبع أدائهم" />

      {/* رسائل الخطأ والنجاح */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError("")} className="mr-auto"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end mb-6">
        <button onClick={() => { setShowAddModal(true); setError(""); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold hover:bg-[#C9A227]/90 transition">
          <Plus className="w-4 h-4" />إضافة فني
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#C9A227]">جاري التحميل...</div>
      ) : technicians.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-[#C9A227]/60">
            <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا يوجد فنيين مسجلين</p>
            <p className="text-sm mt-2">اضغط "إضافة فني" لإضافة أول فني</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <motion.div key={tech.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }}
              className="bg-white border border-[#C9A227]/20 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C9A227]/10 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2C1810]" style={{ fontFamily: "Tajawal, sans-serif" }}>{tech.name}</h3>
                    <span className="text-xs text-[#C9A227]">{getSpecialtyLabel(tech.specialty)}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-[#C9A227] transition"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-gray-400 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#5C3A2A]">
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{tech.phone}</span>
                </div>
                {tech.email && (
                  <div className="flex items-center gap-2 text-[#5C3A2A]">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{tech.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#5C3A2A]">
                  <span className="text-green-600 text-xs">واتساب:</span>
                  <span dir="ltr">{tech.whatsappNo}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#C9A227]/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${tech.isAvailable ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs text-[#5C3A2A]">{tech.isAvailable ? "متاح" : "مشغول"}</span>
                </div>
                <span className="text-xs text-[#C9A227] bg-[#C9A227]/10 px-2 py-1 rounded-full">
                  {tech._count?.reports || 0} بلاغ
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF7F2] border border-[#C9A227]/30 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
              style={{ fontFamily: "Tajawal, sans-serif" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2C1810]">إضافة فني جديد</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-[#C9A227]/10">
                  <X className="w-5 h-5 text-[#5C3A2A]" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: "name", label: "اسم الفني *", placeholder: "مثال: أحمد محمد", type: "text" },
                  { key: "phone", label: "رقم الهاتف *", placeholder: "05xxxxxxxx", type: "tel" },
                  { key: "whatsappNo", label: "رقم واتساب *", placeholder: "9665xxxxxxxx", type: "tel" },
                  { key: "email", label: "البريد الإلكتروني", placeholder: "email@example.com", type: "email" },
                  { key: "password", label: "كلمة المرور *", placeholder: "********", type: "password" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm text-[#5C3A2A] mb-1">{field.label}</label>
                    <input type={field.type}
                      value={newTechnician[field.key as keyof typeof newTechnician]}
                      onChange={(e) => setNewTechnician((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full bg-white border border-[#C9A227]/30 rounded-xl px-4 py-2.5 text-[#2C1810] placeholder-[#C9A227]/40 focus:outline-none focus:border-[#C9A227]" />
                  </div>
                ))}

                <div>
                  <label className="block text-sm text-[#5C3A2A] mb-1">التخصص</label>
                  <select value={newTechnician.specialty}
                    onChange={(e) => setNewTechnician((prev) => ({ ...prev, specialty: e.target.value }))}
                    className="w-full bg-white border border-[#C9A227]/30 rounded-xl px-4 py-2.5 text-[#2C1810] focus:outline-none focus:border-[#C9A227]">
                    <option value="">عام</option>
                    <option value="ELECTRICAL">⚡ كهرباء</option>
                    <option value="PLUMBING">🔧 سباكة</option>
                    <option value="HVAC">❄️ تكييف</option>
                    <option value="CARPENTRY">🪚 نجارة</option>
                    <option value="PAINTING">🎨 دهان</option>
                    <option value="CLEANING">🧹 نظافة</option>
                    <option value="SECURITY">🔒 أمن</option>
                    <option value="IT">💻 تقنية معلومات</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-[#C9A227]/30 rounded-xl text-[#5C3A2A] hover:bg-[#C9A227]/10 transition">إلغاء</button>
                <button onClick={addTechnician}
                  className="flex-1 py-3 bg-[#C9A227] text-[#1A0F09] rounded-xl font-bold hover:bg-[#C9A227]/90 transition">حفظ</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}