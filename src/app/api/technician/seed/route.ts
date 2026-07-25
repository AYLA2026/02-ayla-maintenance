import { NextRequest } from "next/server";
export async function GET() {
  return Response.json({
    message: "فنيين تجريبيين",
    technicians: [
      { name: "فني تجريبي", phone: "966501234567", password: "123456" },
      { name: "فني سباكة", phone: "966509876543", password: "123456" }
    ]
  });
}
