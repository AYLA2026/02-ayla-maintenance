import { NextRequest, NextResponse } from 'next/server';

declare global {
  var __aylaReports: any[] | undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const technicianId = searchParams.get('technicianId');

  if (!technicianId) {
    return NextResponse.json({ error: 'technicianId مطلوب' }, { status: 400 });
  }

  // جلب البلاغات الموزعة من الذاكرة
  const all = globalThis.__aylaReports || [];

  // فلترة البلاغات الموجهة لهذا الفني + Demo ثابت
  const DEMO = [
    {
      id: 'rep-001',
      reportNo: 'REP-001',
      title: 'عطل مكيف المدير',
      description: 'المكيف لا يعمل منذ الصباح',
      category: 'HVAC',
      priority: 'HIGH',
      status: 'ASSIGNED',
      school: { name: 'مدرسة النور', address: 'حي الورود' },
      receivedAt: new Date().toISOString(),
      technicianId: '1',
    },
  ];

  const mine = [...DEMO, ...all].filter((r: any) => r.technicianId === technicianId);
  return NextResponse.json(mine);
}