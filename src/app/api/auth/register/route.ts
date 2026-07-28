export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { company, name, email, password } = await req.json();
    if (!company || !name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }
    const hashed = await hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    const tenant = await prisma.tenant.create({
      data: { name: company, color: "#C9A227" },
    });
    await prisma.tenantMember.create({
      data: { userId: user.id, tenantId: tenant.id, role: "admin" },
    });
    return NextResponse.json({ success: true, userId: user.id, tenantId: tenant.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
