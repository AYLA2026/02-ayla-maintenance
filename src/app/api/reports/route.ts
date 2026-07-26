import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

export async function POST(req: NextRequest) {
  try {
    const { images, title, school, technician, date } = await req.json();

    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_16x9";
    pres.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { color: "F5F5F0" },
      objects: [
        {
          rect: { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: "1A0F09" } },
        },
      ],
    });

    // شريحة العنوان
    const slide1 = pres.addSlide({ masterName: "MASTER_SLIDE" });
    slide1.addText(title || "التقرير المصور الذكي", {
      x: 1, y: 1.5, w: "80%", fontSize: 32, color: "C9A227", bold: true, align: "center",
    });
    if (school) {
      slide1.addText(`المدرسة: ${school}`, { x: 1, y: 2.5, w: "80%", fontSize: 18, color: "5C3A2A", align: "center" });
    }
    if (technician) {
      slide1.addText(`الفني: ${technician}`, { x: 1, y: 3, w: "80%", fontSize: 16, color: "5C3A2A", align: "center" });
    }
    if (date) {
      slide1.addText(`التاريخ: ${date}`, { x: 1, y: 3.5, w: "80%", fontSize: 16, color: "5C3A2A", align: "center" });
    }
    slide1.addText(`عدد الصور المعتمدة: ${images?.length || 0}`, {
      x: 1, y: 4.2, w: "80%", fontSize: 18, color: "5C3A2A", align: "center",
    });

    // شرائح الصور
    const good = images || [];
    for (let i = 0; i < good.length; i += 2) {
      const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
      slide.addText(`الصور ${i + 1} - ${i + 2}`, { x: 0.5, y: 0.1, fontSize: 14, color: "C9A227" });
      if (good[i]?.url) slide.addImage({ data: good[i].url, x: 0.5, y: 1, w: 4.5, h: 3.5 });
      if (good[i + 1]?.url) slide.addImage({ data: good[i + 1].url, x: 5.5, y: 1, w: 4.5, h: 3.5 });
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