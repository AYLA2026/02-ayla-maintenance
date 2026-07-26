import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json();

    const pres = new PptxGenJS();
    pres.layout = "LAYOUT_16x9";
    pres.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { color: "F5F5F0" },
      objects: [
        {
          rect: {
            x: 0,
            y: 0,
            w: "100%",
            h: 0.8,
            fill: { color: "1A0F09" },
          },
        },
      ],
    });

    // شريحة العنوان
    const slide1 = pres.addSlide({ masterName: "MASTER_SLIDE" });
    slide1.addText("التقرير المصور الذكي", {
      x: 1,
      y: 2,
      w: "80%",
      fontSize: 32,
      color: "C9A227",
      bold: true,
      align: "center",
    });
    slide1.addText(`عدد الصور المعتمدة: ${images.length}`, {
      x: 1,
      y: 3,
      w: "80%",
      fontSize: 18,
      color: "5C3A2A",
      align: "center",
    });

    // شرائح الصور
    for (let i = 0; i < images.length; i += 2) {
      const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
      slide.addText(`الصور ${i + 1} - ${i + 2}`, {
        x: 0.5,
        y: 0.1,
        fontSize: 14,
        color: "C9A227",
      });
      slide.addImage({
        data: images[i].url,
        x: 0.5,
        y: 1,
        w: 4.5,
        h: 3.5,
      });
      if (images[i + 1]) {
        slide.addImage({
          data: images[i + 1].url,
          x: 5.5,
          y: 1,
          w: 4.5,
          h: 3.5,
        });
      }
    }

    const buffer = await pres.write({ type: "nodebuffer" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": 'attachment; filename="Ayla_Smart_Report.pptx"',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "فشل توليد PowerPoint" },
      { status: 500 }
    );
  }
}