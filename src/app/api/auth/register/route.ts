import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

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

    // Auto-login after register
    const token = await signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "admin",
      tenantId: tenant.id,
      tenantName: tenant.name,
    });

    (await cookies()).set("ayla_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, userId: user.id, tenantId: tenant.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
