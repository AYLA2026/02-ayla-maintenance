import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const schools = await prisma.school.count();
    const complaints = await prisma.complaints.count();

    const inventory = await ((prisma as any).inventoryItem?.count?.() ?? Promise.resolve(0));
    const teams = await ((prisma as any).team?.count?.() ?? Promise.resolve(0));
    const vehicles = await ((prisma as any).vehicle?.count?.() ?? Promise.resolve(0));
    const employees = await ((prisma as any).employee?.count?.() ?? Promise.resolve(0));

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