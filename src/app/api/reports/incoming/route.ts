import { NextResponse } from 'next/server';

declare global {
  var __aylaReports: any[] | undefined;
}

export async function GET() {
  const reports = globalThis.__aylaReports || [];
  return NextResponse.json(reports);
}