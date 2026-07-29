import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const schools = await prisma.school.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(schools);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const school = await prisma.school.create({ data: body });
    return NextResponse.json(school, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
