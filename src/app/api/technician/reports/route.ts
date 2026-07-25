import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const technicianId = searchParams.get("technicianId");

  // بيانات تجريبية للبلاغات
  const DEMO_REPORTS = [
    {
      id: "rep-001",
      reportNo: "REP-001",
      title: "عطل مكيف",
      description: "المكيف في غرفة المدير لا يعمل منذ صباح اليوم",
      category: "HVAC",
      priority: "HIGH",
      status: "ASSIGNED",
      school: { name: "مدرسة النور", address: "حي الورود" },
      receivedAt: new Date().toISOString(),
    },
    {
      id: "rep-002",
      reportNo: "REP-002",
      title: "تسرب مياه",
      description: "تسرب في حمام الطابق الأول",
      category: "PLUMBING",
      priority: "URGENT",
      status: "ASSIGNED",
      school: { name: "مدرسة الفجر", address: "حي الصفا" },
      receivedAt: new Date().toISOString(),
    }
  ];

  // 🔥 إشعار واتساب تجريبي للفني (في الإنتاج: ابعت للفني الفعلي)
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://02-ayla-maintenance.vercel.app";
    const techPhone = "966501234567"; // رقم الفني التجريبي
    fetch(`${appUrl}/api/whatsapp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: techPhone,
        message: `🔧 بلاغ جديد موجه لك!\n📍 ${DEMO_REPORTS[0].school.name}\n📝 ${DEMO_REPORTS[0].title}\nافتح التطبيق: ${appUrl}/technician-app/reports`,
      }),
    }).catch(() => {});
  } catch {
    // نتجاهل خطأ الإشعار لو فشل
  }

  return NextResponse.json(DEMO_REPORTS);
}