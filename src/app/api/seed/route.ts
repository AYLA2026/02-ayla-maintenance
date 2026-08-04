import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const tenantId = "default";

    await prisma.school.createMany({
      data: [
        { name: "مدرسة النور الابتدائية", location: "حي النور الرياض", contact: "0551234567", tenantId },
        { name: "مدرسة الفيصل المتوسطة", location: "حي الفيصل الرياض", contact: "0557654321", tenantId },
        { name: "مدرسة الرياض الثانوية", location: "حي الرياض الرياض", contact: "0559988776", tenantId },
      ] as any[],
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, message: "تم التهيئة" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}