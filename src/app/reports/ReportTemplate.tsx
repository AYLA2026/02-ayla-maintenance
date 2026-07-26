"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, FileSpreadsheet, Image as ImageIcon, Sparkles,
  Download, Printer, Trash2, CheckCircle, AlertTriangle, XCircle,
} from "lucide-react";

interface Props {
  title: string;
  color: "green" | "blue" | "cyan";
}

const colorMap = {
  green: {
    bg: "bg-green-50", text: "text-green-700", border: "border-green-200",
    btn: "bg-green-600 hover:bg-green-700", light: "bg-green-100",
  },
  blue: {
    bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
    btn: "bg-blue-600 hover:bg-blue-700", light: "bg-blue-100",
  },
  cyan: {
    bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200",
    btn: "bg-cyan-600 hover:bg-cyan-700", light: "bg-cyan-100",
  },
};

export default function ReportTemplate({ title, color }: Props) {
  const c = colorMap[color];
  const [excelRows, setExcelRows] = useState<any[]>([]);
  const [images, setImages] = useState<
    { id: string; url: string; name: string; status: "good" | "bad" | "note"; reason: string }[]
  >([]);
  const [filtering, setFiltering] = useState(false);
  const excelRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const handleExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const XLSX = await import("xlsx");
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      setExcelRows(data.slice(1));
    } catch {
      alert("⚠️ تأكد من تثبيت المكتبة: npm install xlsx");
    }
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setImages((prev) => [...prev, {
          id: Math.random().toString(36).slice(2), url, name: file.name,
          status: "good", reason: ""
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const analyzeImage = (url: string): Promise<{
    brightness: number; contrast: number; width: number; height: number;
  }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        const w = (canvas.width = Math.min(img.width, 300));
        const h = (canvas.height = Math.min(img.height, 300));
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let sum = 0, sumSq = 0;
        const pixels = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          sum += avg;
          sumSq += avg * avg;
        }
        const mean = sum / pixels;
        resolve({ brightness: mean, contrast: Math.sqrt(sumSq / pixels - mean * mean), width: img.width, height: img.height });
      };
      img.onerror = () => resolve({ brightness: 0, contrast: 0, width: 0, height: 0 });
      img.src = url;
    });
  };

  const smartFilter = useCallback(async () => {
    setFiltering(true);
    const updated = await Promise.all(
      images.map(async (img) => {
        const r = await analyzeImage(img.url);
        let status: "good" | "bad" | "note" = "good";
        let reason = "";

        if (r.brightness < 35) { status = "bad"; reason = "صورة مظلمة جداً"; }
        else if (r.brightness > 245 && r.contrast < 15) { status = "note"; reason = "ورقة ملاحظة/بيضاء"; }
        else if (r.width < 400 || r.height < 400) { status = "bad"; reason = "دقة منخفضة"; }
        else if (r.contrast < 8) { status = "bad"; reason = "صورة ضبابية"; }
        else if (r.brightness > 240 && r.contrast < 20) { status = "note"; reason = "احتمال ملاحظة"; }

        return { ...img, status, reason };
      })
    );
    setImages(updated);
    setFiltering(false);
  }, [images]);

  const removeImage = (id: string) => setImages((prev) => prev.filter((i) => i.id !== id));

  const exportCSV = () => {
    const headers = ["اسم الصورة", "الحالة", "السبب"];
    const rows = images.map((i) => [i.name, i.status === "good" ? "مقبولة" : i.status === "bad" ? "مستبعدة" : "ملاحظة", i.reason]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s/g, "_")}_تقرير.csv`;
    link.click();
  };

  const printReport = () => window.print();

  const goodImages = images.filter((i) => i.status === "good");
  const badImages = images.filter((i) => i.status === "bad");
  const noteImages = images.filter((i) => i.status === "note");

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 print:p-0 print:bg-white">
      <div className="max-w-6xl mx-auto print:max-w-none">
        <h1 className="text-3xl font-bold text-[#2C1810] mb-8 flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
          <FileSpreadsheet className={`w-8 h-8 ${c.text}`} />
          {title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:hidden">
          <button onClick={() => excelRef.current?.click()} className={`p-4 rounded-2xl border ${c.border} bg-white hover:shadow-md transition flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-lg ${c.light} flex items-center justify-center`}>
              <Upload className={`w-5 h-5 ${c.text}`} />
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">استيراد Excel</p>
              <p className="text-xs text-gray-500">نموذج إدارة التعليم</p>
            </div>
            <input ref={excelRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleExcel} />
          </button>

          <button onClick={() => imgRef.current?.click()} className={`p-4 rounded-2xl border ${c.border} bg-white hover:shadow-md transition flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-lg ${c.light} flex items-center justify-center`}>
              <ImageIcon className={`w-5 h-5 ${c.text}`} />
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">رفع الصور</p>
              <p className="text-xs text-gray-500">قبل / بعد (50+ صورة)</p>
            </div>
            <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </button>

          <button onClick={smartFilter} disabled={images.length === 0 || filtering} className={`p-4 rounded-2xl border ${c.border} bg-white hover:shadow-md transition flex items-center gap-3 disabled:opacity-50`}>
            <div className={`w-10 h-10 rounded-lg ${c.light} flex items-center justify-center`}>
              <Sparkles className={`w-5 h-5 ${c.text} ${filtering ? "animate-spin" : ""}`} />
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">فلترة ذكية</p>
              <p className="text-xs text-gray-500">{filtering ? "جاري التحليل..." : "استبعاد الصور الرديئة"}</p>
            </div>
          </button>
        </div>

        {excelRows.length > 0 && (
          <div className="mb-8 overflow-x-auto">
            <h3 className="font-bold text-[#2C1810] mb-3">بيانات نموذج الإدارة</h3>
            <table className="w-full bg-white rounded-2xl border border-[#C9A227]/10 text-sm">
              <thead className="bg-[#FAF7F2]">
                <tr>{excelRows[0]?.map((_: any, i: number) => (
                  <th key={i} className="px-4 py-3 text-right font-bold text-[#5C3A2A]">عمود {i + 1}</th>
                ))}</tr>
              </thead>
              <tbody>
                {excelRows.slice(0, 20).map((row: any[], i: number) => (
                  <tr key={i} className="border-t border-[#C9A227]/5">
                    {row.map((cell: any, j: number) => (
                      <td key={j} className="px-4 py-2 text-gray-600">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {excelRows.length > 20 && <p className="text-xs text-gray-400 mt-2">+ {excelRows.length - 20} صفوف إضافية</p>}
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-6 print:hidden">
            <div className={`p-3 rounded-xl ${c.bg} border ${c.border} text-center`}>
              <div className="text-2xl font-bold text-[#2C1810]">{images.length}</div>
              <div className="text-xs">إجمالي</div>
            </div>
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-center">
              <div className="text-2xl font-bold text-green-600">{goodImages.length}</div>
              <div className="text-xs text-green-700">مقبولة ✅</div>
            </div>
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
              <div className="text-2xl font-bold text-red-600">{badImages.length}</div>
              <div className="text-xs text-red-700">مستبعدة ❌</div>
            </div>
            <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">{noteImages.length}</div>
              <div className="text-xs text-yellow-700">ملاحظات 📝</div>
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-[#2C1810] mb-3">معاينة الصور</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#C9A227]/10 bg-white">
                  <img src={img.url} alt={img.name} className="w-full aspect-square object-cover" />
                  <div className="absolute top-2 left-2">
                    {img.status === "good" && <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />}
                    {img.status === "bad" && <XCircle className="w-5 h-5 text-red-500 bg-white rounded-full" />}
                    {img.status === "note" && <AlertTriangle className="w-5 h-5 text-yellow-500 bg-white rounded-full" />}
                  </div>
                  <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {img.reason && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 text-center">{img.reason}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="flex gap-3 print:hidden">
            <button onClick={exportCSV} className={`px-6 py-3 rounded-xl ${c.btn} text-white font-bold flex items-center gap-2 transition`}>
              <Download className="w-4 h-4" /> تصدير Excel
            </button>
            <button onClick={printReport} className="px-6 py-3 rounded-xl bg-[#1A0F09] text-[#C9A227] font-bold flex items-center gap-2 hover:bg-[#2C1810] transition">
              <Printer className="w-4 h-4" /> طباعة / PDF
            </button>
          </div>
        )}

        <div className="hidden print:block mt-8">
          <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
          <div className="grid grid-cols-2 gap-4">
            {goodImages.map((img) => (
              <div key={img.id} className="border p-2 rounded">
                <img src={img.url} className="w-full h-64 object-cover rounded" />
                <p className="text-xs mt-1 text-center">{img.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}