export async function sendWhatsAppMessage(to: string, body: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    console.error("Missing WhatsApp credentials");
    return { success: false, error: "Missing credentials" };
  }

  const cleanTo = to.replace(/\D/g, "");

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanTo,
          type: "text",
          text: { body },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error("WhatsApp API error:", data);
      return { success: false, error: data.error?.message || "API error" };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error("WhatsApp send error:", err);
    return { success: false, error: err.message };
  }
}