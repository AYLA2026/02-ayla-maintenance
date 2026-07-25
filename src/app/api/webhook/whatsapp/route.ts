import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "ayla_verify_2026";

// ✅ GET — للتحقق من Meta
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

// ✅ POST — استقبال الرسائل
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📩 WhatsApp Webhook:", JSON.stringify(body, null, 2));

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: "no_messages" }, { status: 200 });
    }

    const msg = messages[0];
    const from = msg.from;
    const text = msg.text?.body || "";
    const name = msg.contacts?.[0]?.profile?.name || "غير معروف";

    // 🔥 كشف البلاغ تلقائياً
    const keywords = ["عطل", "مكيف", "تسرب", "كهرباء", "سباكة", "إنارة", "باب", "شباك", "مكسور", "لا يعمل"];
    const isReport = keywords.some((k) => text.includes(k));

    if (isReport) {
      // حفظ البلاغ (مؤقتاً في localStorage أو يمكن ربطه بـ Prisma لاحقاً)
      const reports = JSON.parse(localStorage.getItem("whatsapp_reports") || "[]");
      reports.unshift({
        id: `wa-${Date.now()}`,
        from,
        name,
        text,
        createdAt: new Date().toISOString(),
        status: "NEW",
      });
      localStorage.setItem("whatsapp_reports", JSON.stringify(reports));

      // إرسال تأكيد للمدرسة
      await sendWhatsAppMessage(from, `✅ تم استلام بلاغك: "${text}"\nسيتم توجيه فني في أقرب وقت.`);
    } else {
      // رد تلقائي إرشادي
      await sendWhatsAppMessage(from, `👋 مرحباً ${name}!\nارسل وصف العطل (مثال: عطل مكيف في غرفة 101)`);
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}

// دالة مساعدة لإرسال رسائل واتساب
async function sendWhatsAppMessage(to: string, message: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.log("⚠️ WhatsApp credentials missing — message not sent");
    return;
  }

  try {
    await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: message },
      }),
    });
  } catch (e) {
    console.error("Failed to send WhatsApp message:", e);
  }
}