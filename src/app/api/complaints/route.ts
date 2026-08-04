import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where = status ? { status } : {};
    
    const complaints = await prisma.complaints.findMany({
      where,
      orderBy: { id: "desc" },
    });
    
    return NextResponse.json(complaints);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}