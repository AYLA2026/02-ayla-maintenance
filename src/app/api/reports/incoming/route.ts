import { NextResponse } from 'next/server';

export async function GET() {
  const reports = (globalThis as any).__aylaReports || [];
  return NextResponse.json(reports);
}