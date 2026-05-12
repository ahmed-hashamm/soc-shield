import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST to sign out' }, { status: 405 });
}
