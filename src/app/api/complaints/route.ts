import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where = status ? { status } : {};
  const complaints = await prisma.complaint.findMany({
    where,
    include: { school: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(complaints);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const complaint = await prisma.complaint.create({ data: body });
    return NextResponse.json(complaint, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const updated = await prisma.complaint.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
