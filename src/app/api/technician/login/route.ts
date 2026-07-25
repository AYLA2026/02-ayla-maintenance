import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    const DEMO_USERS = [
      { id: "1", name: "فني تجريبي", phone: "966501234567", password: "123456" },
      { id: "2", name: "فني سباكة", phone: "966509876543", password: "123456" }
    ];

    const user = DEMO_USERS.find((u) => u.phone === phone && u.password === password);

    if (!user) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 401 });
    }

    return NextResponse.json({
      token: "demo-token-" + user.id,
      technicianId: user.id,
      name: user.name,
    });
  } catch (e) {
    return NextResponse.json({ error: "خطأ في الطلب" }, { status: 500 });
  }
}