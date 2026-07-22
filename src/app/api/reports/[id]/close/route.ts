// src/app/api/reports/[id]/close/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp/send';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    // تحديث البلاغ
    const report = await prisma.report.update({
      where: { id },
      data: {
        status: 'مغلق',
        closeNotes: data.closeNotes,
        rating: data.rating,
        closedAt: new Date(),
        technicianId: data.technicianId,
      },
      include: {
        school: true,
        technician: true,
        supervisor: true,
      },
    });

    // إشعار واتساب للمشرف
    if (report.supervisor?.phone) {
      await sendWhatsAppMessage({
        to: report.supervisor.phone,
        body: `✅ تم إغلاق البلاغ #${report.reportNumber}\n\nالفني: ${report.technician?.name}\nالتقييم: ${'⭐'.repeat(report.rating || 0)}\nملاحظات: ${report.closeNotes}`,
      });
    }

    // إشعار واتساب للمدرسة
    if (report.school?.phone) {
      await sendWhatsAppMessage({
        to: report.school.phone,
        body: `تم إغلاق بلاغكم #${report.reportNumber} ✅\nالتقييم: ${'⭐'.repeat(report.rating || 0)}\nشكراً لثقتكم بآيلا للصيانة`,
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Close report error:', error);
    return NextResponse.json(
      { error: 'فشل إغلاق البلاغ' },
      { status: 500 }
    );
  }
}