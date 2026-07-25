export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const technicianId = searchParams.get("technicianId");

  // بيانات تجريبية
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

  return Response.json(DEMO_REPORTS);
}