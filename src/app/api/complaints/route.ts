import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// دالة مساعدة تستدعي Supabase فقط عند الطلب
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase configuration missing');
  }
  
  return createClient(url, key);
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('project_id');

    let query = supabase.from('complaints').select('*, schools(name)');
    if (status) query = query.eq('status', status);
    if (projectId) query = query.eq('project_id', projectId);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();
    const { data, error } = await supabase.from('complaints').insert([body]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}