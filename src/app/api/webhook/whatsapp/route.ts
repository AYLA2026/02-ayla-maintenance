import { NextRequest, NextResponse } from 'next/server';
import { analyzeReport, matchTechnician, DEMO_TECHNICIANS, Report } from '@/lib/auto-dispatch';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'ayla_verify_2026';

/* 🗃️ مخزن مؤقت في الذاكرة (للـ Demo — في الإنتاج استخدم Prisma/Redis) */
declare global {
  var __aylaReports: Report[] | undefined;
  var __aylaNotifications: any[] | undefined;
}
const incomingReports = globalThis.__aylaReports || [];
globalThis.__aylaReports = incomingReports;

const notifications = globalThis.__aylaNotifications || [];
globalThis.__aylaNotifications = notifications;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: 'no_messages' }, { status: 200 });
    }

    const msg = messages[0];
    const from = msg.from;
    const text = msg.text?.body || '';
    const name = msg.contacts?.[0]?.profile?.name || 'غير معروف';

    // 🧠 تصنيف ذكي بالـ AI
    const analysis = await analyzeReport(text);
    const schoolName = extractSchool(text) || 'مدرسة عامة';

    const report: Report = {
      id: `wa-${Date.now()}`,
      source: 'whatsapp',
      from,
      name,
      school: schoolName,
      title: analysis.title,
      description: text,
      category: analysis.category,
      priority: analysis.priority,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    // 🎯 توزيع ذكي أوتوماتيكي
    const matched = matchTechnician(report, DEMO_TECHNICIANS);

    if (matched) {
      report.status = 'ASSIGNED';
      report.technicianId = matched.id;
      report.technicianName = matched.name;

      notifications.unshift({
        id: `notif-${Date.now()}`,
        technicianId: matched.id,
        reportId: report.id,
        title: `بلاغ جديد: ${report.title}`,
        school: report.school,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    incomingReports.unshift(report);

    // 📩 رد تأكيد للمدرسة
    const dispatchMsg = matched
      ? `\n\n✅ تم التوزيع الذكي للفني: ${matched.name} (${matched.specialty})`
      : '\n\n⏳ في قائمة الانتظار — سيوزع يدوياً';

    await sendWhatsAppMessage(
      from,
      `✅ تم استلام بلاغك\n📌 *${analysis.title}*\n📂 التصنيف: ${analysis.category}\n🚨 الأولوية: ${analysis.priority}${dispatchMsg}`
    );

    return NextResponse.json(
      { status: 'ok', autoDispatched: !!matched, report },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}

function extractSchool(text: string): string | null {
  const schools = ['مدرسة النور', 'مدرسة الفجر', 'مدرسة الأمل', 'مدرسة الإيمان', 'مدرسة التوحيد'];
  for (const s of schools) if (text.includes(s)) return s;
  return null;
}

async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) {
    console.log('⚠️ WhatsApp credentials missing — message not sent');
    return;
  }
  try {
    await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    });
  } catch {}
}