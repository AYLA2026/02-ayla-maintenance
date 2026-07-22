import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        school: true,
        technician: true,
        supervisor: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: 'البلاغ غير موجود' },
        { status: 404 }
      );
    }

    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تقرير البلاغ #${report.reportNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Tajawal', sans-serif;
      background: #FAF7F2;
      padding: 40px;
      color: #1A0F09;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #C9A227;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #C9A227;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #5C3A2A;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin: 4px;
    }
    .badge-status-closed { background: #DCFCE7; color: #166534; }
    .badge-status-new { background: #DBEAFE; color: #1E40AF; }
    .badge-status-processing { background: #FEF3C7; color: #92400E; }
    .badge-priority-high { background: #FEE2E2; color: #991B1B; }
    .badge-priority-medium { background: #FEF3C7; color: #92400E; }
    .badge-priority-low { background: #DCFCE7; color: #166534; }
    .section { margin-bottom: 24px; }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #C9A227;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #F5E6D3;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .info-item {
      background: #FAF7F2;
      padding: 12px 16px;
      border-radius: 12px;
    }
    .info-label {
      font-size: 12px;
      color: #5C3A2A;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 14px;
      font-weight: 700;
      color: #1A0F09;
    }
    .description {
      background: #FAF7F2;
      padding: 16px;
      border-radius: 12px;
      line-height: 1.8;
    }
    .rating { font-size: 24px; color: #C9A227; }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #F5E6D3;
      color: #5C3A2A;
      font-size: 12px;
    }
    .print-btn {
      display: block;
      width: 200px;
      margin: 32px auto 0;
      padding: 12px 24px;
      background: #C9A227;
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'Tajawal', sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }
    .print-btn:hover { background: #B8921F; }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; padding: 20px; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏗️ آيلا للصيانة</div>
      <div class="subtitle">منصة إدارة الصيانة المدرسية الذكية</div>
      <div style="margin-top: 16px;">
        <span class="badge badge-status-${report.status === 'CLOSED' ? 'closed' : report.status === 'PENDING' ? 'new' : 'processing'}">${report.status === 'CLOSED' ? 'مغلق' : report.status === 'PENDING' ? 'جديد' : 'قيد المعالجة'}</span>
        <span class="badge badge-priority-${report.priority === 'HIGH' || report.priority === 'URGENT' ? 'high' : report.priority === 'MEDIUM' ? 'medium' : 'low'}">${report.priority === 'HIGH' ? 'عالي' : report.priority === 'URGENT' ? 'عاجل' : report.priority === 'MEDIUM' ? 'متوسط' : 'منخفض'}</span>
      </div>
      <div style="margin-top: 12px; font-size: 18px; font-weight: 700;">تقرير البلاغ #${report.reportNo}</div>
    </div>

    <div class="section">
      <div class="section-title">📋 المعلومات الأساسية</div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">المدرسة</div><div class="info-value">${report.school?.name || '—'}</div></div>
        <div class="info-item"><div class="info-label">الفئة</div><div class="info-value">${report.category || '—'}</div></div>
        <div class="info-item"><div class="info-label">المشرف المسؤول</div><div class="info-value">${report.supervisor?.name || '—'}</div></div>
        <div class="info-item"><div class="info-label">الفني المعالج</div><div class="info-value">${report.technician?.name || '—'}</div></div>
        <div class="info-item"><div class="info-label">رقم التواصل</div><div class="info-value">${report.senderPhone || '—'}</div></div>
        <div class="info-item"><div class="info-label">تاريخ الاستلام</div><div class="info-value">${report.receivedAt ? new Date(report.receivedAt).toLocaleDateString('ar-SA') : '—'}</div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📝 تفاصيل البلاغ</div>
      <div class="description">${report.description || 'لا يوجد وصف'}</div>
    </div>

    ${report.status === 'CLOSED' ? `
    <div class="section">
      <div class="section-title">✅ ملاحظات الإغلاق</div>
      <div class="description">${report.feedback || 'لا يوجد ملاحظات'}</div>
      <div style="margin-top: 16px;"><div class="info-label">التقييم</div><div class="rating">${'⭐'.repeat(report.rating || 0)}</div></div>
      <div class="info-item" style="margin-top: 12px;"><div class="info-label">تاريخ الإغلاق</div><div class="info-value">${report.closedAt ? new Date(report.closedAt).toLocaleDateString('ar-SA') : '—'}</div></div>
    </div>
    ` : ''}

    <div class="footer">
      <div>© 2026 Ayla Digital Solutions</div>
      <div>تم إنشاء هذا التقرير تلقائياً من منصة آيلا للصيانة</div>
    </div>

    <button class="print-btn" onclick="window.print()">🖨️ طباعة التقرير</button>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('PDF report error:', error);
    return NextResponse.json(
      { error: 'فشل توليد التقرير' },
      { status: 500 }
    );
  }
}