import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const complaints = await prisma.complaint.findMany({
      where: { tenantId: session.user.tenantId, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(complaints);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const complaint = await prisma.complaint.create({
      data: { ...body, tenantId: session.user.tenantId },
    });
    return NextResponse.json(complaint);
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
