/**
 * أدوات معالجة التقارير الذكية
 * - تحليل الصور محلياً (وضوح، إضاءة، تصنيف قبل/بعد)
 * - قراءة/كتابة Excel
 * - توليد PowerPoint
 */

import * as XLSX from "xlsx";
import PptxGenJS from "pptxgenjs";

export interface ImageAnalysis {
  id: string;
  file: File;
  preview: string;
  sharpness: number; // 0-100
  brightness: number; // 0-255
  category: "before" | "after" | "unknown";
  isGood: boolean;
  rejectReason?: string;
}

export interface ReportData {
  schoolName: string;
  date: string;
  inspector: string;
  notes: string;
  beforeImages: ImageAnalysis[];
  afterImages: ImageAnalysis[];
  excelData: any[];
}

/**
 * 🧠 تحليل الصورة محلياً باستخدام Canvas
 */
export async function analyzeImage(file: File): Promise<ImageAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    img.onload = () => {
      // تصغير الصورة للتحليل السريع
      const maxDim = 400;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) return reject("Canvas error");

      const data = imageData.data;
      let brightness = 0;
      let sharpness = 0;
      const pixels = data.length / 4;

      // حساب الإضاءة المتوسطة
      for (let i = 0; i < data.length; i += 4) {
        brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      brightness = brightness / pixels;

      // حساب الوضوح (Laplacian variance مبسط)
      const w = canvas.width;
      const h = canvas.height;
      let diffSum = 0;
      let count = 0;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const idx = (y * w + x) * 4;
          const left = (y * w + (x - 1)) * 4;
          const right = (y * w + (x + 1)) * 4;
          const top = ((y - 1) * w + x) * 4;
          const bottom = ((y + 1) * w + x) * 4;

          const gx =
            Math.abs(data[idx] - data[left]) +
            Math.abs(data[idx + 1] - data[left + 1]) +
            Math.abs(data[idx + 2] - data[left + 2]);
          const gy =
            Math.abs(data[idx] - data[top]) +
            Math.abs(data[idx + 1] - data[top + 1]) +
            Math.abs(data[idx + 2] - data[top + 2]);

          diffSum += gx + gy;
          count++;
        }
      }
      sharpness = Math.min(100, (diffSum / count / 255) * 10);

      // تصنيف قبل/بعد من اسم الملف
      const lowerName = file.name.toLowerCase();
      let category: "before" | "after" | "unknown" = "unknown";
      if (
        /before|قبل|bf|قبل|1|first|قبل/i.test(lowerName)
      )
        category = "before";
      else if (
        /after|بعد|af|بعد|2|second|بعد/i.test(lowerName)
      )
        category = "after";

      // فلترة الجودة
      const isGood = sharpness > 8 && brightness > 30 && brightness < 250;
      const rejectReason = !isGood
        ? sharpness <= 8
          ? "صورة غير واضحة (ضبابية)"
          : brightness <= 30
          ? "صورة مظلمة جداً"
          : "صورة مضيئة جداً (فاقدة تفاصيل)"
        : undefined;

      resolve({
        id: Math.random().toString(36).slice(2),
        file,
        preview: URL.createObjectURL(file),
        sharpness: Math.round(sharpness),
        brightness: Math.round(brightness),
        category,
        isGood,
        rejectReason,
      });
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 📊 قراءة ملف Excel
 */
export function readExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 📊 تصدير Excel مكتمل
 */
export function exportExcel(
  data: any[][],
  sheetName: string,
  filename: string
) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * 🎯 توليد PowerPoint ذكي
 */
export function generatePowerPoint(
  title: string,
  school: string,
  date: string,
  beforeImages: ImageAnalysis[],
  afterImages: ImageAnalysis[],
  notes: string
) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: "FAF7F2" },
    objects: [
      {
        rect: { x: 0, y: 0, w: "100%", h: 0.75, fill: { color: "1A0F09" } },
      },
      {
        text: {
          text: "آيلا للصيانة",
          options: {
            x: 0.5,
            y: 0.15,
            w: 3,
            h: 0.5,
            fontSize: 18,
            color: "C9A227",
            fontFace: "Arial",
          },
        },
      },
    ],
  });

  // شريحة العنوان
  const slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
  slide1.addText(title, {
    x: 1,
    y: 2,
    w: "80%",
    h: 1,
    fontSize: 36,
    bold: true,
    color: "1A0F09",
    align: "center",
  });
  slide1.addText(`المدرسة: ${school} | التاريخ: ${date}`, {
    x: 1,
    y: 3.2,
    w: "80%",
    h: 0.5,
    fontSize: 18,
    color: "5C3A2A",
    align: "center",
  });

  // شرائح الصور (قبل/بعد) - زوجية
  const maxPairs = Math.min(beforeImages.length, afterImages.length, 8);
  for (let i = 0; i < maxPairs; i++) {
    const slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide.addText(`صور الموقع - زوج ${i + 1}`, {
      x: 0.5,
      y: 0.9,
      w: "90%",
      h: 0.5,
      fontSize: 20,
      bold: true,
      color: "1A0F09",
    });

    slide.addImage({
      path: beforeImages[i].preview,
      x: 0.5,
      y: 1.6,
      w: 4.2,
      h: 3.5,
    });
    slide.addText("قبل", {
      x: 0.5,
      y: 5.2,
      w: 4.2,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: "C9A227",
      align: "center",
    });

    slide.addImage({
      path: afterImages[i].preview,
      x: 5.3,
      y: 1.6,
      w: 4.2,
      h: 3.5,
    });
    slide.addText("بعد", {
      x: 5.3,
      y: 5.2,
      w: 4.2,
      h: 0.4,
      fontSize: 14,
      bold: true,
      color: "2E7D32",
      align: "center",
    });
  }

  // شريحة الملاحظات
  const lastSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
  lastSlide.addText("الملاحظات والتوصيات", {
    x: 0.5,
    y: 0.9,
    w: "90%",
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: "1A0F09",
  });
  lastSlide.addText(notes || "لا توجد ملاحظات", {
    x: 0.5,
    y: 1.8,
    w: "90%",
    h: 3,
    fontSize: 16,
    color: "5C3A2A",
    rtl: true,
  });

  pptx.writeFile({ fileName: `${title.replace(/\s+/g, "_")}.pptx` });
}

/**
 * 🧠 فلترة ذكية: اختيار أفضل الصور
 */
export function filterBestImages(
  images: ImageAnalysis[],
  maxCount: number = 12
): ImageAnalysis[] {
  // فلترة الصور الجيدة فقط
  const good = images.filter((img) => img.isGood);
  // ترتيب حسب الوضوح (الأفضل أولاً)
  const sorted = good.sort((a, b) => b.sharpness - a.sharpness);
  return sorted.slice(0, maxCount);
}