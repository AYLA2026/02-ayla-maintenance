import { prisma } from '@/lib/db/prisma';

const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

const BASE_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}`;

/**
 * إرسال رسالة نصية عبر واتساب
 */
export async function sendWhatsAppMessage(to: string, text: string) {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { body: text }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('WhatsApp send error:', data);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Send message error:', error);
    return null;
  }
}

/**
 * إرسال صورة عبر واتساب
 */
export async function sendWhatsAppImage(to: string, imageUrl: string, caption?: string) {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'image',
        image: {
          link: imageUrl,
          caption: caption || ''
        }
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Send image error:', error);
    return null;
  }
}

/**
 * إرسال قالب (Template) عبر واتساب
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string = 'ar',
  components?: any[]
) {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: components || []
        }
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Send template error:', error);
    return null;
  }
}

/**
 * إشعار المشرف بإغلاق البلاغ
 */
export async function notifySupervisorReportClosed(report: any, technician: any) {
  const supervisor = await prisma.supervisor.findUnique({
    where: { id: report.supervisorId }
  });

  if (!supervisor) return;

  const message =
    `✅ *تم إغلاق البلاغ*\n\n` +
    `🔢 *رقم البلاغ:* ${report.reportNo}\n` +
    `👨‍🔧 *الفني:* ${technician.name}\n` +
    `📅 *تاريخ الإغلاق:* ${new Date().toLocaleString('ar-SA')}\n\n` +
    `📊 *التقييم:* ${report.rating ? '⭐'.repeat(report.rating) : 'غير متوفر'}\n` +
    `💬 *ملاحظات الفني:* ${report.feedback || 'لا يوجد'}\n\n` +
    `📱 لمشاهدة التفاصيل: ${process.env.APP_URL}/reports/${report.id}`;

  await sendWhatsAppMessage(supervisor.whatsappNo, message);
}