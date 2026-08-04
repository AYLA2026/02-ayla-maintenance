import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await ((prisma as any).team?.findMany() ?? Promise.resolve([]));
    return NextResponse.json(teams);
  } catch {
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}