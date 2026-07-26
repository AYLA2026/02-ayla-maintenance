"use client";

import { useState, useRef } from "react";
import { Camera, Sparkles, Download, Trash2, Presentation } from "lucide-react";

export default function PPTReportPage() {
  const [images, setImages] = useState<
    { id: string; url: string; name: string; status: "good" | "bad" | "note"; reason: string }[]
  >([]);
  const [generating, setGenerating] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setImages((prev) => [
          ...prev,
          { id: Math.random().toString(36).slice(2), url, name: file.name, status: "good", reason: "" },
        ]);
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
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          sum += avg; sumSq += avg * avg;
        }
        const pixels = data.length / 4;
        const mean = sum / pixels;
        resolve({ brightness: mean, contrast: Math.sqrt(sumSq / pixels - mean * mean), width: img.width, height: img.height });
      };
      img.onerror = () => resolve({ brightness: 0, contrast: 0, width: 0, height: 0 });
      img.src = url;
    });
  };

  const smartFilter = async () => {
    const updated = await Promise.all(
      images.map(async (img) => {
        const r = await analyzeImage(img.url);
        if (r.brightness > 245 && r.contrast < 15) return { ...img, status: "note" as const, reason: "ملاحظة/ورقة" };
        if (r.brightness < 35 || r.width < 400 || r.contrast < 8) return { ...img, status: "bad" as const, reason: "جودة منخفضة" };
        return { ...img, status: "good" as const, reason: "" };
      })
    );
    setImages(updated);
  };

  const generatePPT = async () => {
    setGenerating(true);
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pres = new PptxGenJS();
      pres.layout = "LAYOUT_16x9";
      pres.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "F5F5F0" },
        objects: [{ rect: { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: "1A0F09" } } }],
      });

      const good = images.filter((i) => i.status === "good");

      const slide1 = pres.addSlide({ masterName: "MASTER_SLIDE" });
      slide1.addText("التقرير المصور الذكي", { x: 1, y: 2, w: "80%", fontSize: 32, color: "C9A227", bold: true, align: "center" });
      slide1.addText(`عدد الصور المعتمدة: ${good.length}`, { x: 1, y: 3, w: "80%", fontSize: 18, color: "5C3A2A", align: "center" });

      for (let i = 0; i < good.length; i += 2) {
        const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
        slide.addText(`الصور ${i + 1} - ${i + 2}`, { x: 0.5, y: 0.1, fontSize: 14, color: "C9A227" });
        slide.addImage({ data: good[i].url, x: 0.5, y: 1, w: 4.5, h: 3.5 });
        if (good[i + 1]) slide.addImage({ data: good[i + 1].url, x: 5.5, y: 1, w: 4.5, h: 3.5 });
      }

      pres.writeFile({ fileName: "Ayla_Smart_Report.pptx" });
    } catch {
      alert("⚠️ تأكد من تثبيت المكتبة: npm install pptxgenjs");
    }
    setGenerating(false);
  };

  const removeImage = (id: string) => setImages((prev) => prev.filter((i) => i.id !== id));

  const goodCount = images.filter((i) => i.status === "good").length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2C1810] mb-8 flex items-center gap-3" style={{ fontFamily: "Tajawal, sans-serif" }}>
          <Presentation className="w-8 h-8 text-purple-600" />
          التقرير المصور الذكي — PowerPoint
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button onClick={() => imgRef.current?.click()} className="p-4 rounded-2xl border border-purple-200 bg-white hover:shadow-md flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Camera className="w-5 h-5 text-purple-600" /></div>
            <div className="text-right"><p className="font-bold text-sm">رفع الصور</p><p className="text-xs text-gray-500">قبل / بعد</p></div>
            <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </button>

          <button onClick={smartFilter} disabled={images.length === 0} className="p-4 rounded-2xl border border-purple-200 bg-white hover:shadow-md flex items-center gap-3 disabled:opacity-50">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Sparkles className="w-5 h-5 text-purple-600" /></div>
            <div className="text-right"><p className="font-bold text-sm">فلترة ذكية</p><p className="text-xs text-gray-500">استبعاد الرديئة</p></div>
          </button>

          <button onClick={generatePPT} disabled={goodCount === 0 || generating} className="p-4 rounded-2xl border border-purple-200 bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-3 disabled:opacity-50">
            <Download className="w-5 h-5" />
            <div className="text-right"><p className="font-bold text-sm">{generating ? "جاري التوليد..." : "تصدير PowerPoint"}</p><p className="text-xs text-purple-100">{goodCount} صورة معتمدة</p></div>
          </button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden border border-purple-100 bg-white">
                <img src={img.url} className="w-full aspect-square object-cover" />
                {img.status === "good" && <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-green-500 text-white text-[10px] font-bold">مقبولة</span>}
                {img.status === "bad" && <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">مستبعدة</span>}
                {img.status === "note" && <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-yellow-500 text-white text-[10px] font-bold">ملاحظة</span>}
                {img.reason && <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 text-center">{img.reason}</div>}
                <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}