import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendWhatsAppMessage, notifySupervisorReportClosed } from '@/lib/whatsapp/send';
import { sendPushNotification } from '@/lib/notifications/push';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { beforeImages, afterImages, feedback, rating } = await req.json();
    const technicianId = req.headers.get('x-technician-id');

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: { technician: true, school: true, supervisor: true }
    });

    if (!report) {
      return NextResponse.json({ error: 'البلاغ غير موجود' }, { status: 404 });
    }

    if (report.technicianId !== technicianId) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const updatedReport = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: 'CLOSED',
        images: JSON.stringify([
          ...(beforeImages || []).map((url: string) => ({ url, type: 'before' })),
          ...(afterImages || []).map((url: string) => ({ url, type: 'after' }))
        ]),
        feedback,
        rating,
        closedAt: new Date()
      },
      include: { technician: true, school: true, supervisor: true }
    });

    if (updatedReport.supervisor) {
      await notifySupervisorReportClosed(updatedReport, updatedReport.technician);
      await sendPushNotification({
        userId: updatedReport.supervisorId,
        title: `✅ تم إغلاق البلاغ ${updatedReport.reportNo}`,
        body: `بواسطة ${updatedReport.technician?.name}`,
        data: { reportId: updatedReport.id, type: 'REPORT_CLOSED' }
      });
    }

    await sendWhatsAppMessage(updatedReport.senderPhone,
      `✅ *تم إنجاز بلاغك!*\n\n` +
      `🔢 *رقم البلاغ:* ${updatedReport.reportNo}\n` +
      `👨‍🔧 *الفني:* ${updatedReport.technician?.name}\n` +
      `📅 *تاريخ الإنجاز:* ${new Date().toLocaleString('ar-SA')}\n\n` +
      `🙏 شكراً لاستخدامكم منصة آيلا للصيانة`
    );

    return NextResponse.json({ success: true, report: updatedReport });
  } catch (error) {
    console.error('Close report error:', error);
    return NextResponse.json({ error: 'فشل إغلاق البلاغ' }, { status: 500 });
  }
}