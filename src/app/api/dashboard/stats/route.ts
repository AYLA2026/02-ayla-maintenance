import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [schools, complaints, inventory, teams, vehicles, employees] = await Promise.all([
    prisma.school.count(),
    prisma.complaint.count(),
    prisma.inventoryItem.count(),
    prisma.team.count(),
    prisma.vehicle.count(),
    prisma.employee.count(),
  ]);

  const newComplaints = await prisma.complaint.count({ where: { status: "جديد" } });
  const lowStock = await prisma.inventoryItem.count({ where: { qty: { lt: prisma.inventoryItem.fields.min } } });

  return NextResponse.json({
    schools, complaints, inventory, teams, vehicles, employees,
    newComplaints, lowStock,
  });
}
