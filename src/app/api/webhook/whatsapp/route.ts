import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp/send';
import { classifyReport } from '@/lib/ai/classifier';
import { sendPushNotification } from '@/lib/notifications/push';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

// ============================================================
// GET: التحقق من Webhook (مطلوب من Meta)
// ============================================================
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Verification failed', { status: 403 });
}

// ============================================================
// POST: استقبال الرسائل الواردة (يعمل 24/7 حتى لو المنصة مغلقة!)
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' });
    }

    const entries = body.entry || [];

    for (const entry of entries) {
      for (const change of entry.changes || []) {
        if (change.value?.messages) {
          for (const message of change.value.messages) {
            await processIncomingMessage(message, change.value);
          }
        }
      }
    }

    // ⚡ رد سريع بـ 200 لتجنب إعادة الإرسال من Meta
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }
}

// ============================================================
// معالجة الرسالة الواردة
// ============================================================
async function processIncomingMessage(message: any, value: any) {
  const from = message.from;

  // تجاهل الرسائل المرسلة من البوت نفسه
  if (value?.metadata?.phone_number_id === WHATSAPP_PHONE_NUMBER_ID) {
    return;
  }

  // 1️⃣ التحقق إذا كان رقم مدرسة مسجلة
  const school = await prisma.school.findFirst({
    where: { whatsappNo: from },
    include: { supervisors: { include: { supervisor: true } } }
  });

  // 2️⃣ استخراج محتوى الرسالة
  let content = '';
  let mediaUrls: string[] = [];
  let location = null;

  if (message.type === 'text') {
    content = message.text?.body || '';
  } else if (message.type === 'image') {
    content = '📷 صورة مرفقة';
    const imageUrl = await downloadMedia(message.image?.id);
    if (imageUrl) mediaUrls.push(imageUrl);
  } else if (message.type === 'location') {
    location = {
      lat: message.location?.latitude,
      lng: message.location?.longitude,
      address: message.location?.name || ''
    };
    content = `📍 موقع: ${location.address}`;
  } else if (message.type === 'audio' || message.type === 'voice') {
    content = '🎤 رسالة صوتية';
  }

  // 3️⃣ التصنيف الذكي بالذكاء الاصطناعي
  const classification = await classifyReport(content, mediaUrls);

  // 4️⃣ إنشاء البلاغ
  const report = await prisma.report.create({
    data: {
      title: classification.title || 'بلاغ صيانة جديد',
      description: content,
      category: classification.category,
      priority: classification.priority,
      status: 'PENDING',
      senderPhone: from,
      senderName: school?.name || 'مرسل غير معروف',
      senderType: school ? 'WHATSAPP_SCHOOL' : 'WHATSAPP_DIRECT',
      schoolId: school?.id || null,
      supervisorId: school?.supervisors[0]?.supervisorId || null,
      location: location ? JSON.stringify(location) : null,
      images: mediaUrls.length > 0 ? JSON.stringify(mediaUrls.map(url => ({ url, type: 'before' }))) : null,
      receivedAt: new Date(),
    }
  });

  // 5️⃣ إرسال تأكيد استلام للمرسل
  await sendWhatsAppMessage(from,
    `✅ *تم استلام بلاغك بنجاح!*\n\n` +
    `🔢 *رقم البلاغ:* ${report.reportNo}\n` +
    `📋 *الفئة:* ${getCategoryLabel(report.category)}\n` +
    `⚡ *الأولوية:* ${getPriorityLabel(report.priority)}\n\n` +
    `🔄 سيتم مراجعته وتوجيهه للفني المختص قريباً.\n` +
    `يمكنك متابعة حالة البلاغ بالرد بـ: *حالة ${report.reportNo}*`
  );

  // 6️⃣ إرسال البلاغ للمشرف المسؤول
  if (report.supervisorId) {
    const supervisor = await prisma.supervisor.findUnique({
      where: { id: report.supervisorId }
    });

    if (supervisor) {
      await sendWhatsAppMessage(supervisor.whatsappNo,
        `🚨 *بلاغ صيانة جديد - ${school?.name || 'مدرسة'}*\n\n` +
        `🔢 *رقم البلاغ:* ${report.reportNo}\n` +
        `📋 *الفئة:* ${getCategoryLabel(report.category)}\n` +
        `⚡ *الأولوية:* ${getPriorityLabel(report.priority)}\n` +
        `📝 *الوصف:* ${content.substring(0, 200)}${content.length > 200 ? '...' : ''}\n\n` +
        `📱 *المرسل:* ${from}\n` +
        `⏰ *الوقت:* ${new Date().toLocaleString('ar-SA')}`
      );
    }
  }

  // 7️⃣ إرسال إشعار Push للمشرف
  await sendPushNotification({
    userId: report.supervisorId,
    title: `بلاغ جديد - ${school?.name || 'مدرسة'}`,
    body: `${getCategoryLabel(report.category)} - ${getPriorityLabel(report.priority)}`,
    data: { reportId: report.id, type: 'NEW_REPORT' }
  });

  // 8️⃣ إذا كان البلاغ عالي الأولوية، أرسل للفني مباشرة
  if (report.priority === 'URGENT' || report.priority === 'HIGH') {
    await autoAssignTechnician(report);
  }

  console.log(`✅ Report ${report.reportNo} created and routed`);
}

// ============================================================
// تعيين فني تلقائي للبلاغات العاجلة
// ============================================================
async function autoAssignTechnician(report: any) {
  const availableTechnician = await prisma.technician.findFirst({
    where: { isActive: true, isAvailable: true },
    orderBy: { createdAt: 'asc' }
  });

  if (availableTechnician) {
    await prisma.report.update({
      where: { id: report.id },
      data: {
        technicianId: availableTechnician.id,
        status: 'ASSIGNED',
        assignedAt: new Date()
      }
    });

    await sendWhatsAppMessage(availableTechnician.whatsappNo,
      `🔧 *بلاغ صيانة عاجل - يرجى الاستجابة*\n\n` +
      `🔢 *رقم البلاغ:* ${report.reportNo}\n` +
      `📋 *الفئة:* ${getCategoryLabel(report.category)}\n` +
      `📝 *الوصف:* ${report.description.substring(0, 300)}\n\n` +
      `📍 *الموقع:* ${report.location ? 'تم إرفاق موقع' : 'غير محدد'}\n\n` +
      `✅ للقبول اضغط: ${process.env.APP_URL}/technician-app?action=accept&report=${report.reportNo}\n` +
      `📱 أو افتح تطبيق الفني`
    );

    await sendPushNotification({
      userId: availableTechnician.id,
      title: 'بلاغ صيانة عاجل!',
      body: `${getCategoryLabel(report.category)} - ${report.title}`,
      data: { reportId: report.id, type: 'URGENT_REPORT' }
    });
  }
}

// ============================================================
// تحميل الوسائط من Meta
// ============================================================
async function downloadMedia(mediaId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error('Media download error:', error);
    return null;
  }
}

// ============================================================
// مساعدات التسمية
// ============================================================
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ELECTRICAL: '⚡ كهرباء',
    PLUMBING: '🔧 سباكة',
    HVAC: '❄️ تكييف',
    CARPENTRY: '🪚 نجارة',
    PAINTING: '🎨 دهان',
    CLEANING: '🧹 نظافة',
    SECURITY: '🔒 أمن',
    IT: '💻 تقنية معلومات',
    FURNITURE: '🪑 أثاث',
    OTHER: '📦 أخرى'
  };
  return labels[category] || category;
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: '🟢 عادي',
    MEDIUM: '🟡 متوسط',
    HIGH: '🟠 عالي',
    URGENT: '🔴 عاجل'
  };
  return labels[priority] || priority;
}