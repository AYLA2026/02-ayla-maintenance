import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const tenant = await prisma.tenant.upsert({
      where: { id: "ayla-main" },
      update: {},
      create: { id: "ayla-main", name: "آيلا للصيانة", color: "#C9A227" },
    });

    const tenantId = tenant.id;

    await prisma.school.createMany({
      data: [
        { name: "مدرسة النور الابتدائية", type: "ابتدائية", location: "حي النور الرياض", contact: "0551234567", tenantId },
        { name: "مدرسة الفيصل المتوسطة", type: "متوسطة", location: "حي الفيصل الرياض", contact: "0557654321", tenantId },
        { name: "مدرسة الرياض الثانوية", type: "ثانوية", location: "حي الرياض الرياض", contact: "0559988776", tenantId },
      ],
      skipDuplicates: true,
    });

    const schools = await prisma.school.findMany({ where: { tenantId } });

    await prisma.complaint.createMany({
      data: [
        { schoolId: schools[0].id, type: "سباكة", title: "تسريب مياه في دورة المياه", status: "جديد", priority: "عالي", supervisorPhone: "966501234567", tenantId },
        { schoolId: schools[1].id, type: "كهرباء", title: "انقطاع كهرباء الملعب", status: "قيد العمل", priority: "متوسط", supervisorPhone: "966501234567", tenantId },
        { schoolId: schools[0].id, type: "تكييف", title: "عطل مكيف المكتبة", status: "مغلق", priority: "منخفض", supervisorPhone: "966501234567", tenantId },
        { schoolId: schools[2].id, type: "دهان", title: "تقشير دهانات الممر الرئيسي", status: "جديد", priority: "متوسط", supervisorPhone: "966508765432", tenantId },
        { schoolId: schools[1].id, type: "نجارة", title: "كسر باب الفصل ٢-ب", status: "قيد العمل", priority: "عالي", supervisorPhone: "966508765432", tenantId },
      ],
      skipDuplicates: true,
    });

    await prisma.inventoryItem.createMany({
      data: [
        { name: "غاز فريون R22", unit: "أسطوانة", qty: 2, min: 5, warehouse: "المستودع الرئيسي", tenantId },
        { name: "مسامير تجاري 6 مم", unit: "كجم", qty: 8, min: 10, warehouse: "المستودع الرئيسي", tenantId },
        { name: "سلك كهرباء 2.5 مم", unit: "بكرة", qty: 15, min: 5, warehouse: "مستودع الكهرباء", tenantId },
        { name: "صنبور ماء نحاس", unit: "قطعة", qty: 3, min: 5, warehouse: "مستودع السباكة", tenantId },
        { name: "دهان جدران أبيض", unit: "علبة", qty: 20, min: 10, warehouse: "المستودع الرئيسي", tenantId },
        { name: "لمبات LED 18 واط", unit: "قطعة", qty: 4, min: 10, warehouse: "مستودع الكهرباء", tenantId },
        { name: "شريط لاصق عازل", unit: "رول", qty: 12, min: 5, warehouse: "مستودع الكهرباء", tenantId },
        { name: "مفك كهربائي", unit: "قطعة", qty: 6, min: 3, warehouse: "ورشة الفنيين", tenantId },
        { name: "مفتاح ربط ١٤ مم", unit: "قطعة", qty: 2, min: 4, warehouse: "ورشة الفنيين", tenantId },
        { name: "خراطيم مياه PVC", unit: "متر", qty: 30, min: 15, warehouse: "مستودع السباكة", tenantId },
      ],
      skipDuplicates: true,
    });

    await prisma.team.createMany({
      data: [
        { name: "فريق السباكة", leader: "فهد العتيبي", members: "سعد الدوسري, ماجد الشمري", specialty: "سباكة", tenantId },
        { name: "فريق الكهرباء", leader: "خالد السبيعي", members: "ناصر القحطاني", specialty: "كهرباء", tenantId },
        { name: "فريق التكييف", leader: "عبدالله المطيري", members: "بندر الغامدي", specialty: "تكييف", tenantId },
      ],
      skipDuplicates: true,
    });

    await prisma.vehicle.createMany({
      data: [
        { name: "سيارة صيانة 1", plate: "أ ب ي 1234", status: "متاح", tenantId },
        { name: "سيارة صيانة 2", plate: "أ ب ي 5678", status: "مشغول", tenantId },
        { name: "ونيت نقل", plate: "أ ب ي 9999", status: "متاح", tenantId },
      ],
      skipDuplicates: true,
    });

    await prisma.employee.createMany({
      data: [
        { name: "فهد العتيبي", role: "فني", phone: "0551111111", tenantId },
        { name: "خالد السبيعي", role: "فني", phone: "0552222222", tenantId },
        { name: "عبدالله المطيري", role: "فني", phone: "0553333333", tenantId },
        { name: "أحمد الزهراني", role: "مشرف", phone: "0554444444", tenantId },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({ success: true, message: "Demo data seeded!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
