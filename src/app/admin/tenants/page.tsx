"use client";

import { useState } from "react";
import { Plus, X, Building2, Trash2, Palette } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Tenant } from "@/lib/permissions";

export default function TenantsPage() {
  const { tenants, user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", color: "#C9A227" });

  if (user?.role !== "super_admin") {
    return (
      <div className="min-h-screen bg-[#FAF7F2] p-12 text-center">
        <p className="text-red-600 font-bold">⛔ ليس لديك صلاحية الوصول لهذه الصفحة</p>
      </div>
    );
  }

  const addTenant = () => {
    if (!form.name.trim()) return;
    const newTenant: Tenant = {
      id: `tnt-${Date.now()}`,
      name: form.name,
      color: form.color,
    };
    const updated = [...tenants, newTenant];
    localStorage.setItem("ayla_tenants", JSON.stringify(updated));
    window.location.reload();
  };

  const removeTenant = (id: string) => {
    if (!confirm("تأكيد حذف الشركة؟")) return;
    const updated = tenants.filter((t) => t.id !== id);
    localStorage.setItem("ayla_tenants", JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2C1810] flex items-center gap-3">
            <Building2 className="w-7 h-7 text-[#C9A227]" /> إدارة الشركات
          </h1>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> شركة جديدة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenants.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-[#C9A227]/10 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: t.color || "#C9A227" }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#2C1810]">{t.name}</h3>
                  <p className="text-[10px] text-gray-400 font-mono">{t.id}</p>
                </div>
              </div>
              <button onClick={() => removeTenant(t.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#2C1810]">إضافة شركة</h2>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              <div className="space-y-3">
                <input placeholder="اسم الشركة *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-[#C9A227]/20 text-sm focus:outline-none focus:border-[#C9A227]" />
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#C9A227]" />
                  <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border-0 cursor-pointer" />
                  <span className="text-xs text-gray-500">{form.color}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm">إلغاء</button>
                <button onClick={addTenant} className="px-5 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold text-sm">حفظ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}