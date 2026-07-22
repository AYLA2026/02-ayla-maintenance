import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET: توليد تقرير PDF للبلاغ
 * /api/reports/[id]/pdf
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        school: true,
        supervisor: true,
        technician: true,
      }
    });

    if (!report) {
      return NextResponse.json({ error: 'البلاغ غير موجود' }, { status: 404 });
    }

    // بيانات التقرير
    const reportData = {
      reportNo: report.reportNo,
      title: report.title,
      description: report.description,
      category: getCategoryLabel(report.category),
      priority: getPriorityLabel(report.priority),
      status: getStatusLabel(report.status),
      school: report.school?.name || 'غير محدد',
      schoolRef: report.school?.referenceNo || '',
      supervisor: report.supervisor?.name || 'غير محدد',
      technician: report.technician?.name || 'غير محدد',
      senderPhone: report.senderPhone,
      receivedAt: new Date(report.receivedAt).toLocaleString('ar-SA'),
      closedAt: report.closedAt ? new Date(report.closedAt).toLocaleString('ar-SA') : null,
      feedback: report.feedback,
      rating: report.rating,
    };

    // HTML للتقرير (يمكن تحويله لـ PDF بمكتبة مثل puppeteer)
    const html = generateReportHTML(reportData);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    });
  } catch (error) {
    console.error('PDF report error:', error);
    return NextResponse.json({ error: 'فشل توليد التقرير' }, { status: 500 });
  }
}

function generateReportHTML(data: any) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تقرير البلاغ - ${data.reportNo}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Tajawal', sans-serif;
      background: linear-gradient(135deg, #FAF7F2 0%, #F5E6D3 100%);
      padding: 40px;
      color: #2C1810;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(201, 162, 39, 0.15);
      border: 2px solid #C9A227;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #C9A227;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #C9A227;
      font-size: 28px;
      margin-bottom: 10px;
    }
    .header p {
      color: #5C3A2A;
      font-size: 14px;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin: 4px;
    }
    .badge-gold { background: #C9A227; color: #1A0F09; }
    .badge-green { background: #22c55e; color: white; }
    .badge-red { background: #ef4444; color: white; }
    .badge-blue { background: #3b82f6; color: white; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .info-box {
      background: linear-gradient(145deg, #FAF7F2 0%, #F5E6D3 100%);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(201, 162, 39, 0.2);
    }
    .info-box label {
      font-size: 11px;
      color: #C9A227;
      margin-bottom: 4px;
      display: block;
    }
    .info-box value {
      font-size: 14px;
      font-weight: bold;
      color: #2C1810;
    }
    .section {
      margin-bottom: 24px;
    }
    .section h3 {
      color: #C9A227;
      font-size: 16px;
      margin-bottom: 12px;
      border-right: 3px solid #C9A227;
      padding-right: 12px;
    }
    .description {
      background: #FAF7F2;
      padding: 20px;
      border-radius: 12px;
      line-height: 1.8;
      color: #5C3A2A;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid rgba(201, 162, 39, 0.3);
      color: #C9A227;
      font-size: 12px;
    }
    .stars {
      color: #C9A227;
      font-size: 20px;
    }
    @media print {
      body { background: white; }
      .container { box-shadow: none; border: 1px solid #C9A227; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 تقرير البلاغ</h1>
      <p>منصة آيلا للصيانة - Ayla Maintenance</p>
      <div style="margin-top: 15px;">
        <span class="badge badge-gold">#${data.reportNo}</span>
        <span class="badge ${data.status === 'مغلق' ? 'badge-green' : 'badge-blue'}">${data.status}</span>
        <span class="badge badge-red">${data.priority}</span>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <label>المدرسة</label>
        <value>${data.school} ${data.schoolRef ? '(' + data.schoolRef + ')' : ''}</value>
      </div>
      <div class="info-box">
        <label>الفئة</label>
        <value>${data.category}</value>
      </div>
      <div class="info-box">
        <label>المشرف المسؤول</label>
        <value>${data.supervisor}</value>
      </div>
      <div class="info-box">
        <label>الفني المنفذ</label>
        <value>${data.technician}</value>
      </div>
      <div class="info-box">
        <label>رقم المرسل</label>
        <value dir="ltr">${data.senderPhone}</value>
      </div>
      <div class="info-box">
        <label>تاريخ الاستلام</label>
        <value>${data.receivedAt}</value>
      </div>
    </div>

    <div class="section">
      <h3>📝 تفاصيل البلاغ</h3>
      <div class="description">
        <strong>${data.title}</strong><br><br>
        ${data.description}
      </div>
    </div>

    ${data.feedback ? `
    <div class="section">
      <h3>✅ ملاحظات الإغلاق</h3>
      <div class="description">
        ${data.feedback}
        ${data.rating ? `<div class="stars" style="margin-top: 10px;">${'⭐'.repeat(data.rating)}</div>` : ''}
      </div>
    </div>
    ` : ''}

    ${data.closedAt ? `
    <div class="section">
      <h3>📅 تاريخ الإغلاق</h3>
      <div class="description">${data.closedAt}</div>
    </div>
    ` : ''}

    <div class="footer">
      <p>تم إنشاء هذا التقرير تلقائياً من منصة آيلا للصيانة</p>
      <p style="margin-top: 5px;">© 2026 Ayla Digital Solutions</p>
    </div>
  </div>
</body>
</html>
  `;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ELECTRICAL: '⚡ كهرباء',
    PLUMBING: '🔧 سباكة',
    HVAC: '❄️ تكييف',
    CARPENTRY: '🪚 نجارة',
    PAINTING: '🎨 دهان',
    CLEANING: '🧹 نظافة',
    SECURITY: '🔒 أمن',
    IT: '💻 تقنية معلومات',
    FURNITURE: '🪑 أثاث',
    OTHER: '📦 أخرى'
  };
  return labels[category] || category;
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: 'منخفض',
    MEDIUM: 'متوسط',
    HIGH: 'عالي',
    URGENT: 'عاجل'
  };
  return labels[priority] || priority;
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'جديد',
    ASSIGNED: 'موجه',
    IN_PROGRESS: 'قيد المعالجة',
    COMPLETED: 'مكتمل',
    CLOSED: 'مغلق'
  };
  return labels[status] || status;
}