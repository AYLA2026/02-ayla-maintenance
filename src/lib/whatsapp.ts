'use client';

// تعريف نوع المشرف لضمان سلامة TypeScript
interface Supervisor {
  whatsapp_number: string;
  name?: string;
}

// Twilio WhatsApp API Integration
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

/**
 * إرسال رسالة WhatsApp
 */
export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: 'whatsapp:' + TWILIO_WHATSAPP_NUMBER,
        To: 'whatsapp:' + to,
        Body: message,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    throw error;
  }
}

/**
 * استقبال رسالة WhatsApp وتحويلها لبلاغ
 */
export async function receiveWhatsAppMessage(from: string, body: string) {
  const complaint = {
    source: 'whatsapp',
    reported_by: from,
    description: body,
    status: 'pending',
    priority: 'medium',
    created_at: new Date().toISOString(),
  };
  return complaint;
}

/**
 * إرسال إشعار للمشرفين
 */
export async function notifySupervisors(complaint: any) {
  const supervisors: Supervisor[] = await getSupervisors();
  
  for (const supervisor of supervisors) {
    const message = `بلاغ جديد: ${complaint.description}\nالمدرسة: ${complaint.school_name}\nالأولوية: ${complaint.priority}`;
    
    // استخدام whatsapp_number بشكل آمن الآن بعد تعريف النوع
    await sendWhatsAppMessage(supervisor.whatsapp_number, message);
  }
}

async function getSupervisors(): Promise<Supervisor[]> {
  // جلب المشرفين من قاعدة البيانات
  // تأكد أن هذه الدالة تعيد مصفوفة من المشرفين
  return [];
}