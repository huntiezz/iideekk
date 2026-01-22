import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const adminClient = createAdminClient();
  const { data: referrer } = await adminClient
    .from('users')
    .select('referral_code')
    .eq('referral_code', code)
    .single();

  if (referrer) {
    redirect(`/login?ref=${code}`);
  }

  redirect('/login');
}
