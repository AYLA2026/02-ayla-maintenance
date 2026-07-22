import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        school: { select: { name: true, referenceNo: true } },
        supervisor: { select: { name: true } },
        technician: { select: { name: true, phone: true } }
      },
      orderBy: { receivedAt: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('GET reports error:', error);
    return NextResponse.json([], { status: 200 });
  }
}