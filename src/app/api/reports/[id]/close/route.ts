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

    const report = await prisma.report.update({
      where: { id },
      data: {
        status: 'CLOSED',
        feedback: data.closeNotes,
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

    // ✅ 2 arguments منفصلين: (to, text)
    if (report.supervisor?.phone) {
      await sendWhatsAppMessage(
        report.supervisor.phone,
        `✅ تم إغلاق البلاغ #${report.reportNo}\n\nالفني: ${report.technician?.name}\nالتقييم: ${'⭐'.repeat(report.rating || 0)}\nملاحظات: ${report.feedback}`
      );
    }

    if (report.school?.phone) {
      await sendWhatsAppMessage(
        report.school.phone,
        `تم إغلاق بلاغكم #${report.reportNo} ✅\nالتقييم: ${'⭐'.repeat(report.rating || 0)}\nشكراً لثقتكم بآيلا للصيانة`
      );
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