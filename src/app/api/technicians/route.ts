import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET: جلب كل الفنيين
 */
export async function GET() {
  try {
    const technicians = await prisma.technician.findMany({
      include: {
        _count: { select: { reports: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(technicians);
  } catch (error) {
    console.error('GET technicians error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST: إضافة فني جديد
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // تحقق من التكرار - رقم الهاتف أو واتساب
    const existing = await prisma.technician.findFirst({
      where: {
        OR: [
          { phone: data.phone },
          { whatsappNo: data.whatsappNo }
        ]
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'رقم الهاتف أو واتساب مسجل مسبقاً' },
        { status: 400 }
      );
    }

    const technician = await prisma.technician.create({
      data: {
        name: data.name,
        phone: data.phone,
        whatsappNo: data.whatsappNo,
        email: data.email,
        password: data.password,
        specialty: data.specialty,
      }
    });

    return NextResponse.json(technician, { status: 201 });
  } catch (error) {
    console.error('POST technician error:', error);
    return NextResponse.json(
      { error: 'فشل إنشاء الفني' },
      { status: 500 }
    );
  }
}