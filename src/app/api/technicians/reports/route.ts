import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const technicianId = searchParams.get("technicianId");

    if (!technicianId) {
      return NextResponse.json(
        { error: "technicianId مطلوب" },
        { status: 400 }
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        technicianId,
        status: { in: ["ASSIGNED", "IN_PROGRESS"] },
      },
      include: {
        school: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" },
        { receivedAt: "desc" },
      ],
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Fetch reports error:", error);
    return NextResponse.json(
      { error: "فشل جلب البلاغات" },
      { status: 500 }
    );
  }
}