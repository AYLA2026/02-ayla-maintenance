"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Star, Clock, MapPin, Image as ImageIcon, Printer, Eye } from "lucide-react";

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
}

export default function ClosedComplaintsPage() {
  const [reports, setReports] = useState<ClosedReport[]>([]);
  const [selected, setSelected] = useState<ClosedReport | null>(null);

  useEffect(() => {
    // محاكاة: في الإنتاج تجلب من API/Prisma
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
      },
    ];
    setReports(demo);
  }, []);

  const printReport = (r: ClosedReport) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html dir="rtl"><head><title>تقرير ${r.title}</title></head>
      <body style="font-family:Tajawal,sans-serif;padding:40px;">
        <h1 style="color:#C9A227;">${r.title}</h1>
        <p><strong>المدرسة:</strong> ${r.school}</p>
        <p><strong>الفني:</strong> ${r.technicianName}</p>
        <p><strong>تاريخ الإغلاق:</strong> ${r.closedAt}</p>
        <p><strong>التقييم:</strong> ${r.rating}/5</p>
        <p><strong>ملاحظات:</strong> ${r.notes}</p>
        <hr/>
        <h3>الصور:</h3>
        ${r.beforeImages.map((u) => `<img src="${u}" style="width:45%;margin:5px;" />`).join("")}
        ${r.afterImages.map((u) => `<img src="${u}" style="width:45%;margin:5px;" />`).join("")}
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2C1810] mb-8 flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
          <CheckCircle className="w-8 h-8 text-[#C9A227]" />
          تقارير البلاغات المغلقة
        </h1>

        <div className="grid gap-4">
          {reports.map((r) => (
            <div key={r.id} className="p-5 rounded-2xl bg-white border border-[#C9A227]/10 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[#2C1810] text-lg">{r.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{r.school}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{r.closedAt}</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#C9A227] fill-[#C9A227]" />{r.rating}/5</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(r)} className="px-4 py-2 rounded-xl bg-[#C9A227]/10 text-[#C9A227] font-bold text-sm flex items-center gap-2 hover:bg-[#C9A227]/20 transition">
                    <Eye className="w-4 h-4" /> عرض
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
              <p><strong>الفني:</strong> {selected.technicianName}</p>
              <p><strong>تاريخ الإغلاق:</strong> {selected.closedAt}</p>
              <p><strong>التقييم:</strong> {selected.rating}/5 ⭐</p>
              <p><strong>ملاحظات التنفيذ:</strong></p>
              <div className="bg-[#FAF7F2] p-4 rounded-xl text-[#5C3A2A]">{selected.notes}</div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-6 py-2 rounded-xl bg-[#C9A227] text-[#1A0F09] font-bold">إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}