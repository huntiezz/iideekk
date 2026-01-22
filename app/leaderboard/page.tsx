import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { Logo } from '@/components/ui/Logo';
import type { LeaderboardEntry } from '@/types';

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const adminClient = createAdminClient();
  const { data } = await adminClient.rpc('get_leaderboard', { limit_count: 100 });
  return data || [];
}

export const revalidate = 60;

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 bg-primary text-black font-semibold text-sm rounded-lg hover:bg-[#00dd00] transition-all"
          >
            Join Waitlist
          </Link>
        </div>
      </header>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <main className="pt-24 pb-12 px-4">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold text-white mb-2">Leaderboard</h1>
            <p className="text-white/40">Top referrers on the waitlist</p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-12 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
              <p className="text-white/40">No referrals yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.referral_code}
                  className={`p-4 rounded-xl flex items-center gap-4 ${
                    index < 3
                      ? 'bg-primary/[0.03] border border-primary/20'
                      : 'bg-white/[0.02] border border-white/[0.06]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm ${
                      index === 0
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : index === 1
                        ? 'bg-gray-400/20 text-gray-300'
                        : index === 2
                        ? 'bg-amber-600/20 text-amber-500'
                        : 'bg-white/5 text-white/40'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <p className="text-white">@{entry.twitter_handle}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">{entry.referral_count}</span>
                    <span className="text-white/30 text-sm ml-1">refs</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
