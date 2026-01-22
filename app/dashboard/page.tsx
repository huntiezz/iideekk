'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useReferralStats } from '@/hooks';
import { Logo } from '@/components/ui/Logo';
import { WalletConnect } from '@/components/WalletConnect';
import { ReferralStats } from '@/components/ReferralStats';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const { user, isLoading, refetch, signOut } = useUser();
  const { stats } = useReferralStats(user?.referral_code || null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      const timeout = setTimeout(() => {
        router.replace('/login');
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, user, router]);

  const handleWalletConnected = async (address: string) => {
    const supabase = createClient();

    await supabase
      .from('users')
      .update({ wallet_address: address })
      .eq('twitter_id', user?.twitter_id);

    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Logo size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasWallet = !!user.wallet_address;

  if (!hasWallet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="w-full max-w-sm px-6 text-center">
          <div className="mb-8">
            <div className="w-14 h-14 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center">
              <span className="text-white/80 text-xl font-medium">2</span>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-white mb-3">Connect Wallet</h1>
          <p className="text-white/40 text-sm mb-10">
            Link your wallet to complete your registration.
          </p>

          <WalletConnect
            onWalletConnected={handleWalletConnected}
            currentWallet={user.wallet_address}
          />

          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/leaderboard" className="text-white/60 hover:text-white transition-colors text-sm">
              Leaderboard
            </Link>
            <button
              onClick={signOut}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <main className="pt-24 pb-12 px-4">
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-sm font-medium">On the waitlist</span>
            </div>
            <h1 className="text-3xl font-semibold text-white mb-2">Welcome, @{user.twitter_handle}</h1>
            <p className="text-white/40">Share your referral link to move up the list</p>
          </div>

          <ReferralStats referralCode={user.referral_code} stats={stats} />
        </div>
      </main>
    </div>
  );
}
