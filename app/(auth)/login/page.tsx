import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { XAuthButton } from '@/components/XAuthButton';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; error?: string }>;
}) {
  const session = await getSession();

  if (session) {
    const adminClient = createAdminClient();
    const { data: existingUser } = await adminClient
      .from('users')
      .select('id')
      .eq('twitter_id', session.twitterId)
      .single();

    if (existingUser) {
      redirect('/dashboard');
    }
  }

  const params = await searchParams;
  const referralCode = params.ref;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-full max-w-sm px-6 text-center">
        <div className="mb-8">
          <div className="w-14 h-14 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center">
            <span className="text-white/80 text-xl font-medium">1</span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-3">Connect X Account</h1>
        <p className="text-white/40 text-sm mb-10">
          Link your X (Twitter) account to verify your identity.
        </p>

        <XAuthButton referralCode={referralCode} />

        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
