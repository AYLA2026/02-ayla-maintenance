export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    const DEMO_USERS = [
      { id: "1", name: "فني تجريبي", phone: "966501234567", password: "123456" },
      { id: "2", name: "فني سباكة", phone: "966509876543", password: "123456" }
    ];

    const user = DEMO_USERS.find(u => u.phone === phone && u.password === password);
    
    if (!user) {
      return Response.json({ error: "بيانات غير صحيحة" }, { status: 401 });
    }

    return Response.json({
      token: "demo-token-" + user.id,
      technicianId: user.id,
      name: user.name
    });
  } catch (e) {
    return Response.json({ error: "خطأ في الطلب" }, { status: 500 });
  }
}