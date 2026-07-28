import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const { to, body } = await req.json();
    if (!to || !body) {
      return NextResponse.json({ error: "Missing to or body" }, { status: 400 });
    }
    const result = await sendWhatsAppMessage(to, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}