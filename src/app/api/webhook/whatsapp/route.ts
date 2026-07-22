import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { ReportCategory, Priority } from '@prisma/client';

function classifyMessage(body: string): { category: ReportCategory; priority: Priority; title: string } {
  const lower = body.toLowerCase();

  let category: ReportCategory = 'OTHER';
  let priority: Priority = 'MEDIUM';
  let title = 'بلاغ صيانة جديد';

  if (lower.includes('كهرباء') || lower.includes('كهربائي') || lower.includes('لمبة') || lower.includes('فيش') || lower.includes('كهرب')) {
    category = 'ELECTRICAL'; title = 'عطل كهربائي';
  } else if (lower.includes('سباكة') || lower.includes('ماء') || lower.includes('تسرب') || lower.includes('صرف')) {
    category = 'PLUMBING'; title = 'مشكلة سباكة';
  } else if (lower.includes('تكييف') || lower.includes('مكيف') || lower.includes('تبريد')) {
    category = 'HVAC'; title = 'عطل تكييف';
  } else if (lower.includes('نجارة') || lower.includes('باب') || lower.includes('شباك') || lower.includes('خشب')) {
    category = 'CARPENTRY'; title = 'مشكلة نجارة';
  } else if (lower.includes('دهان') || lower.includes('طلاء') || lower.includes('صبغ')) {
    category = 'PAINTING'; title = 'طلب دهان';
  } else if (lower.includes('تنظيف') || lower.includes('نظافة')) {
    category = 'CLEANING'; title = 'طلب تنظيف';
  } else if (lower.includes('أمن') || lower.includes('كاميرا') || lower.includes('حماية')) {
    category = 'SECURITY'; title = 'مشكلة أمنية';
  } else if (lower.includes('كمبيوتر') || lower.includes('شبكة') || lower.includes('واي فاي') || lower.includes('wifi')) {
    category = 'IT'; title = 'مشكلة IT';
  } else if (lower.includes('أثاث') || lower.includes('مكتب') || lower.includes('كرسي')) {
    category = 'FURNITURE'; title = 'مشكلة أثاث';
  }

  if (lower.includes('عاجل') || lower.includes('urgent') || lower.includes('طارئ') || lower.includes('خطير')) {
    priority = 'URGENT';
  } else if (lower.includes('عالي') || lower.includes('high') || lower.includes('مهم')) {
    priority = 'HIGH';
  } else if (lower.includes('منخفض') || lower.includes('low') || lower.includes('بسيط')) {
    priority = 'LOW';
  }

  return { category, priority, title };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const from = (formData.get('From') as string)?.replace('whatsapp:', '');
    const body = (formData.get('Body') as string)?.trim();
    const to = (formData.get('To') as string)?.replace('whatsapp:', '');
    const mediaUrl = formData.get('MediaUrl0') as string | null;

    if (!from || !body) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const school = await prisma.school.findFirst({
      where: {
        OR: [
          { phone: from },
          { whatsappNo: from },
        ],
      },
    });

    const classification = classifyMessage(body);

    // ✅ FIX: Handle Json field properly - use Prisma.JsonNull or undefined
    const reportData: any = {
      reportNo: `REP-${Date.now()}`,
      title: classification.title,
      description: body,
      category: classification.category,
      priority: classification.priority,
      status: 'PENDING',
      senderPhone: from,
      senderName: school?.name || 'غير معروف',
      senderType: 'WHATSAPP_SCHOOL',
      schoolId: school?.id || null,
    };

    // Only add images if mediaUrl exists
    if (mediaUrl) {
      reportData.images = [mediaUrl];
    }

    const report = await prisma.report.create({
      data: reportData,
      include: {
        school: true,
      },
    });

    await prisma.message.create({
      data: {
        reportId: report.id,
        from: from,
        to: to || '',
        content: body,
        type: mediaUrl ? 'IMAGE' : 'TEXT',
        mediaUrl: mediaUrl || null,
      },
    });

    if (school) {
      const schoolSupervisor = await prisma.schoolSupervisor.findFirst({
        where: { schoolId: school.id },
        include: { supervisor: true },
      });

      if (schoolSupervisor) {
        await prisma.report.update({
          where: { id: report.id },
          data: {
            supervisorId: schoolSupervisor.supervisorId,
            status: 'ASSIGNED',
            assignedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم استلام البلاغ بنجاح',
      report_id: report.id,
      report_no: report.reportNo,
      category: classification.category,
      priority: classification.priority,
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}