import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  const adminClient = createAdminClient();
  const { data: user } = await adminClient
    .from('users')
    .select('*')
    .eq('twitter_id', session.twitterId)
    .single();

  return NextResponse.json({ user });
}
