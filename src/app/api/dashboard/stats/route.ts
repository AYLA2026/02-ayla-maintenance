import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const t = session.user.tenantId;
    const [schools, complaints, inventory, teams, vehicles, technicians] = await Promise.all([
      prisma.school.count({ where: { tenantId: t } }),
      prisma.complaint.count({ where: { tenantId: t } }),
      prisma.inventoryItem.count({ where: { tenantId: t } }),
      prisma.team.count({ where: { tenantId: t } }),
      prisma.vehicle.count({ where: { tenantId: t } }),
      prisma.technician.count({ where: { tenantId: t } }),
    ]);
    return NextResponse.json({ schools, complaints, inventory, teams, vehicles, technicians });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
