import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await ((prisma as any).inventoryItem?.findMany({ orderBy: { name: "asc" } }) ?? Promise.resolve([]));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}