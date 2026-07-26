"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Star, Clock, MapPin, Image as ImageIcon, Printer, Eye, FileText } from "lucide-react";

interface ClosedReport {
  id: string;
  title: string;
  school: string;
  technicianName: string;
  closedAt: string;
  rating: number;
  beforeImages: string[];
  afterImages: string[];
  notes: string;
  duration?: string;
}

export default function ClosedComplaintsPage() {
  const [reports, setReports] = useState<ClosedReport[]>([]);
  const [selected, setSelected] = useState<ClosedReport | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    const demo: ClosedReport[] = [
      {
        id: "rep-001",
        title: "عطل مكيف المدير",
        school: "مدرسة النور",
        technicianName: "فني أحمد",
        closedAt: new Date().toLocaleString("ar-SA"),
        rating: 5,
        beforeImages: [],
        afterImages: [],
        notes: "تم تبديل الفلتر والفريون",
        duration: "45 دقيقة",
      },
      {
        id: "rep-002",
        title: "تسرب مياه حمام",
        school: "مدرسة الفجر",
        technicianName: "فني خالد",
        closedAt: new Date(Date.now() - 86400000).toLocaleString("ar-SA"),
        rating: 4,
        beforeImages: [],
        afterImages: [],
        notes: "تم تبديل الجلدة",
        duration: "30 دقيقة",
      },
    ];
    setReports(demo);
  }, []);

  const generateReport = async (r: ClosedReport) => {
    setGenerating(r.id);
    try {
      const allImages = [
        ...r.beforeImages.map((u, i) => ({ url: u, name: `before_${i}`, status: "good" })),
        ...r.afterImages.map((u, i) => ({ url: u, name: `after_${i}`, status: "good" })),
      ];
      
      const res = await fetch("/api/reports/ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: allImages.length > 0 ? allImages : [{ url: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", name: "placeholder", status: "good" }],
          title: `بلاغ: ${r.title}`,
          school: r.school,
          technician: r.technicianName,
          date: r.closedAt,
        }),
      });
      
      if (!res.ok) throw new Error("فشل");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `بلاغ_${r.id}.pptx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("⚠️ خطأ في توليد التقرير");
    }
    setGenerating(null);
  };

  const printReport = (r: ClosedReport) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html dir="rtl"><head><title>تقرير ${r.title}</title><style>body{font-family:Tajawal,sans-serif;padding:40px;} h1{color:#C9A227;} table{border-collapse:collapse;width:100%;margin:16px 0;} td,th{border:1px solid #ddd;padding:10px;text-align:right;} th{background:#f5f5f0;}</style></head>
      <body>
        <h1>تقرير إغلاق بلاغ — ${r.title}</h1>
        <table>
          <tr><th>المدرسة</th><td>${r.school}</td></tr>
          <tr><th>الفني المنفذ</th><td>${r.technicianName}</td></tr>
          <tr><th>تاريخ الإغلاق</th><td>${r.closedAt}</td></tr>
          <tr><th>التقييم</th><td>${r.rating}/5 ⭐</td></tr>
          <tr><th>المدة</th><td>${r.duration || "—"}</td></tr>
          <tr><th>ملاحظات التنفيذ</th><td>${r.notes}</td></tr>
        </table>
        ${r.beforeImages.length ? `<h3>صور قبل:</h3><div style="display:flex;gap:10px;flex-wrap:wrap;">${r.beforeImages.map(u => `<img src="${u}" style="max-width:45%;border-radius:8px;" />`).join("")}</div>` : ""}
        ${r.afterImages.length ? `<h3>صور بعد:</h3><div style="display:flex;gap:10px;flex-wrap:wrap;">${r.afterImages.map(u => `<img src="${u}" style="max-width:45%;border-radius:8px;" />`).join("")}</div>` : ""}
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#2C1810] mb-6 flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
          <CheckCircle className="w-8 h-8 text-[#C9A227]" />
          تقارير البلاغات المغلقة
        </h1>

        <div className="grid gap-4">
          {reports.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-white border border-[#C9A227]/10 shadow-sm">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-[#2C1810] text-lg">{r.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{r.school}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{r.closedAt}</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#C9A227] fill-[#C9A227]" />{r.rating}/5</span>
                    {r.duration && <span className="flex items-center gap-1 text-blue-600 font-medium"><Clock className="w-4 h-4" />{r.duration}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setSelected(r)} className="px-4 py-2 rounded-xl bg-[#C9A227]/10 text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#C9A227]/20 transition">
                    <Eye className="w-4 h-4" /> عرض
                  </button>
                  <button onClick={() => generateReport(r)} disabled={generating === r.id} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:bg-purple-700 transition disabled:opacity-50">
                    <FileText className="w-4 h-4" /> {generating === r.id ? "جاري التوليد..." : "تقرير PPT"}
                  </button>
                  <button onClick={() => printReport(r)} className="px-4 py-2 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#2C1810] transition">
                    <Printer className="w-4 h-4" /> طباعة
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#5C3A2A] bg-[#FAF7F2] p-3 rounded-xl">{r.notes}</p>
              {(r.beforeImages.length > 0 || r.afterImages.length > 0) && (
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <ImageIcon className="w-4 h-4" />
                  {r.beforeImages.length} قبل / {r.afterImages.length} بعد
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-[#2C1810] mb-4">{selected.title}</h2>
            <div className="space-y-3 text-sm">
              <p><strong>المدرسة:</strong> {selected.school}</p>
              <p><strong>الفني المنفذ:</strong> {selected.technicianName}</p>
              <p><strong>تاريخ الإغلاق:</strong> {selected.closedAt}</p>
              <p><strong>التقييم:</strong> {selected.rating}/5 ⭐</p>
              {selected.duration && <p><strong>مدة التنفيذ:</strong> {selected.duration}</p>}
              <p><strong>ملاحظات التنفيذ:</strong></p>
              <div className="bg-[#FAF7F2] p-4 rounded-xl text-[#5C3A2A]">{selected.notes}</div>
              
              {selected.beforeImages.length > 0 && (
                <div>
                  <p className="font-bold mb-2">صور قبل:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.beforeImages.map((u, i) => (
                      <img key={i} src={u} className="rounded-lg border w-full h-40 object-cover" alt={`before-${i}`} />
                    ))}
                  </div>
                </div>
              )}
              {selected.afterImages.length > 0 && (
                <div>
                  <p className="font-bold mb-2">صور بعد:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.afterImages.map((u, i) => (
                      <img key={i} src={u} className="rounded-lg border w-full h-40 object-cover" alt={`after-${i}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-6 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold hover:bg-[#b89420] transition">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}