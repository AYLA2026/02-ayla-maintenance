import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

export async function POST(req: NextRequest) {
  try {
    const { images, rows, title } = await req.json();

    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_16x9";
    pres.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { color: "F5F5F0" },
      objects: [{ rect: { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: "1A0F09" } } }],
    });

    // شريحة العنوان
    const slide1 = pres.addSlide({ masterName: "MASTER_SLIDE" });
    slide1.addText(title || "التقرير المصور الذكي", { x: 1, y: 2, w: "80%", fontSize: 32, color: "C9A227", bold: true, align: "center" });
    slide1.addText(`عدد السجلات: ${rows?.length || 0} | الصور المعتمدة: ${images?.length || 0}`, { x: 1, y: 3, w: "80%", fontSize: 18, color: "5C3A2A", align: "center" });

    // شرائح البيانات المربوطة
    if (rows && rows.length > 0) {
      for (const item of rows) {
        const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
        
        // عنوان الشريحة = أول عمود (غالباً المدرسة/الموقع)
        const headerText = item.data?.[0] || "سجل عمل";
        slide.addText(headerText, { x: 0.5, y: 0.2, w: "90%", fontSize: 20, color: "C9A227", bold: true, align: "center" });

        // بيانات النصية
        let yPos = 1;
        if (item.headers && item.data) {
          for (let i = 0; i < Math.min(item.headers.length, item.data.length); i++) {
            if (i > 5) break; // نكتفي بـ 6 حقول عشان ما يتكدس
            slide.addText(`${item.headers[i]}: ${item.data[i]}`, { x: 0.5, y: yPos, w: "90%", fontSize: 12, color: "5C3A2A" });
            yPos += 0.4;
          }
        }

        // الصور
        if (item.before?.url) {
          slide.addText("قبل:", { x: 0.5, y: 3.5, fontSize: 12, color: "C9A227", bold: true });
          slide.addImage({ data: item.before.url, x: 0.5, y: 3.8, w: 4, h: 2.5 });
        }
        if (item.after?.url) {
          slide.addText("بعد:", { x: 5.5, y: 3.5, fontSize: 12, color: "C9A227", bold: true });
          slide.addImage({ data: item.after.url, x: 5.5, y: 3.8, w: 4, h: 2.5 });
        }
      }
    } else if (images && images.length > 0) {
      // fallback: صور فقط بدون بيانات
      for (let i = 0; i < images.length; i += 2) {
        const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
        slide.addText(`الصور ${i + 1} - ${i + 2}`, { x: 0.5, y: 0.1, fontSize: 14, color: "C9A227" });
        if (images[i]?.url) slide.addImage({ data: images[i].url, x: 0.5, y: 1, w: 4.5, h: 3.5 });
        if (images[i + 1]?.url) slide.addImage({ data: images[i + 1].url, x: 5.5, y: 1, w: 4.5, h: 3.5 });
      }
    }

    const buffer = await pres.write({ outputType: "arraybuffer" }) as ArrayBuffer;

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${(title || "Ayla_Report").replace(/\s/g, "_")}.pptx"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "فشل توليد PowerPoint" }, { status: 500 });
  }
}