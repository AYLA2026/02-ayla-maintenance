import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const from = formData.get('From') as string;
    const body = formData.get('Body') as string;
    const to = formData.get('To') as string;

    const { data: messageData, error: msgError } = await supabase
      .from('whatsapp_messages')
      .insert([{
        from_number: from.replace('whatsapp:', ''),
        to_number: to.replace('whatsapp:', ''),
        message: body,
        direction: 'incoming',
        status: 'delivered'
      }])
      .select()
      .single();

    if (msgError) throw msgError;

    const complaint = {
      source: 'whatsapp',
      reported_by: from.replace('whatsapp:', ''),
      description: body,
      status: 'pending',
      priority: 'medium',
      category: 'other',
      sub_category: 'بلاغ واتساب',
    };

    const { data: complaintData, error: compError } = await supabase
      .from('complaints')
      .insert([complaint])
      .select()
      .single();

    if (compError) throw compError;

    await supabase
      .from('whatsapp_messages')
      .update({ complaint_id: complaintData.id })
      .eq('id', messageData.id);

    return NextResponse.json({
      success: true,
      message: 'تم استلام البلاغ بنجاح',
      complaint_id: complaintData.id
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
