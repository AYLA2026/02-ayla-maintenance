"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Upload, FileSpreadsheet, Image as ImageIcon, Wand2, Download,
  ArrowRight, CheckCircle, XCircle, Trash2, FileText, AlertTriangle,
} from "lucide-react";

const TYPE_MAP: Record<string, { label: string; theme: string }> = {
  maintenance: { label: "الصيانة", theme: "blue" },
  cleaning:    { label: "النظافة", theme: "green" },
  hvac:        { label: "التكييف", theme: "cyan" },
};

interface ImportedRow {
  id: number;
  location: string;
  date: string;
  status: string;
  notes: string;
}

interface ImageItem {
  id: string;
  src: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  category: "before" | "after";
}

export default function SmartReportPage() {
  const { type } = useParams() as { type: string };
  const router = useRouter();
  const info = TYPE_MAP[type];

  const [excelData, setExcelData] = useState<ImportedRow[] | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [pptxReady, setPptxReady] = useState(false);

  const excelInputRef = useRef<HTMLInputElement>(null);

  if (!info) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">نوع التقرير غير موجود</div>;
  }

  /* ─────────── استيراد Excel ─────────── */
  const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws);

      const mapped: ImportedRow[] = json.map((r, i) => ({
        id: i + 1,
        location: r["الموقع"] || r["Location"] || r["location"] || "—",
        date:     r["التاريخ"] || r["Date"] || r["date"] || "—",
        status:   r["الحالة"]  || r["Status"] || "—",
        notes:    r["ملاحظات"] || r["Notes"] || "",
      }));
      setExcelData(mapped);
    } catch {
      alert("⚠️ تأكد من تثبيت مكتبة xlsx: npm install xlsx");
    }
  };

  /* ─────────── رفع صور ─────────── */
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>, cat: "before" | "after") => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setImages((p) => [...p, {
          id: Math.random().toString(36).slice(2),
          src, name: file.name, status: "pending", category: cat,
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  /* ─────────── فلترة ذكية (محاكاة AI) ─────────── */
  const runSmartFilter = useCallback(async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));

    setImages((prev) => prev.map((img) => {
      const rand = Math.random();
      if (rand < 0.12) return { ...img, status: "rejected", reason: "الفني لا يرتدي معدات السلامة (سيفتي/خوذة)" };
      if (rand < 0.20) return { ...img, status: "rejected", reason: "الصورة غير واضحة أو مظلمة جداً" };
      if (rand < 0.26) return { ...img, status: "rejected", reason: "تحتوي على تعليق/ملاحظة يدوية غير مسموح بها" };
      if (rand < 0.30) return { ...img, status: "rejected", reason: "زاوية التصوير خاطئة — لا تغطي الموقع" };
      return { ...img, status: "approved" };
    }));
    setAnalyzing(false);
  }, []);

  const approved = images.filter((i) => i.status === "approved");
  const rejected = images.filter((i) => i.status === "rejected");

  /* ─────────── تصدير PowerPoint ─────────── */
  const exportPPTX = async () => {
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pres = new PptxGenJS();
      pres.layout = "LAYOUT_16x9";

      // شريحة العنوان
      const s1 = pres.addSlide();
      s1.background = { color: "1A0F09" };
      s1.addText(`تقرير ${info.label}`, {
        x: 1, y: 2, w: "80%", h: 1, fontSize: 40, color: "C9A227", bold: true, align: "center", fontFace: "Arial",
      });
      s1.addText("نظام آيلا للصيانة — إدارة التعليم", {
        x: 1, y: 3.2, w: "80%", fontSize: 18, color: "FFFFFF", align: "center",
      });

      // شريحة البيانات
      if (excelData?.length) {
        const s2 = pres.addSlide();
        s2.addText("البيانات المستوردة من نموذج الإدارة", { x: 0.5, y: 0.3, fontSize: 20, color: "1A0F09", bold: true });
        const rows = excelData.map((r) => [r.location, r.date, r.status, r.notes]);
        s2.addTable([["الموقع", "التاريخ", "الحالة", "ملاحظات"], ...rows], {
          x: 0.5, y: 1, w: 9, fontSize: 12, border: { pt: 1, color: "C9A227" }, color: "1A0F09", fill: { color: "FAF7F2" },
        });
      }

      // صور قبل
      const before = approved.filter((i) => i.category === "before");
      if (before.length) {
        const s3 = pres.addSlide();
        s3.addText("صور قبل العمل", { x: 0.5, y: 0.3, fontSize: 20, color: "1A0F09", bold: true });
        before.slice(0, 4).forEach((img, idx) => {
          const c = idx % 2, r = Math.floor(idx / 2);
          s3.addImage({ data: img.src, x: 0.5 + c * 4.8, y: 1 + r * 3, w: 4.5, h: 2.5 });
        });
      }

      // صور بعد
      const after = approved.filter((i) => i.category === "after");
      if (after.length) {
        const s4 = pres.addSlide();
        s4.addText("صور بعد العمل", { x: 0.5, y: 0.3, fontSize: 20, color: "1A0F09", bold: true });
        after.slice(0, 4).forEach((img, idx) => {
          const c = idx % 2, r = Math.floor(idx / 2);
          s4.addImage({ data: img.src, x: 0.5 + c * 4.8, y: 1 + r * 3, w: 4.5, h: 2.5 });
        });
      }

      // شريحة الخاتمة
      const s5 = pres.addSlide();
      s5.background = { color: "1A0F09" };
      s5.addText("تم إنشاء هذا التقرير آلياً بواسطة نظام آيلا للصيانة", {
        x: 1, y: 2.5, w: "80%", align: "center", color: "C9A227", fontSize: 16,
      });

      await pres.writeFile({ fileName: `تقرير-${info.label}-${new Date().toISOString().slice(0, 10)}.pptx` });
      setPptxReady(true);
    } catch {
      alert("⚠️ تأكد من تثبيت pptxgenjs: npm install pptxgenjs");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button onClick={() => router.push("/reports/scheduled")} className="text-sm text-[#5C3A2A] mb-2 flex items-center gap-1 hover:text-[#C9A227]">
          <ArrowRight className="w-4 h-4" /> الرجوع
        </button>
        <h1 className="text-3xl font-bold text-[#2C1810] mb-1" style={{ fontFamily: "Tajawal" }}>
          تقرير {info.label}
        </h1>
        <p className="text-[#5C3A2A] mb-8">استيراد نموذج إدارة التعليم + فلترة الصور بالـ AI + تصدير PowerPoint</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ─── العمود الأيمن: الأدوات ─── */}
          <div className="lg:col-span-1 space-y-5">
            {/* استيراد Excel */}
            <div className="p-5 rounded-2xl bg-white border border-[#C9A227]/10 shadow-sm">
              <h3 className="font-bold text-[#2C1810] mb-3 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#C9A227]" />
                1. استيراد نموذج Excel
              </h3>
              <input ref={excelInputRef} type="file" accept=".xlsx,.xls" onChange={handleExcel} className="hidden" />
              <button
                onClick={() => excelInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-[#C9A227]/10 text-[#C9A227] font-bold text-sm border border-[#C9A227]/20 hover:bg-[#C9A227]/20 transition"
              >
                <Upload className="w-4 h-4 inline ml-2" />
                اختيار ملف Excel
              </button>
              {excelData && (
                <p className="mt-3 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> تم استيراد {excelData.length} صف
                </p>
              )}
            </div>

            {/* رفع الصور */}
            <div className="