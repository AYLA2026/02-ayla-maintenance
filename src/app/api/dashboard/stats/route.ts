import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [schools, complaints, inventory, teams, vehicles, employees] = await Promise.all([
      prisma.school.count(),
      prisma.complaints.count(),
      prisma.inventoryItem.count(),
      prisma.team.count(),
      prisma.vehicle.count(),
      prisma.employee.count(),
    ]);

    return NextResponse.json({
      schools,
      complaints,
      inventory,
      teams,
      vehicles,
      employees,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}