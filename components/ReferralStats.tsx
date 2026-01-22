'use client';

import { getReferralLink, formatDate } from '@/lib/utils';
import { useState } from 'react';
import type { ReferralStats as ReferralStatsType } from '@/types';

interface ReferralStatsProps {
  referralCode: string;
  stats: ReferralStatsType | null;
}

export function ReferralStats({ referralCode, stats }: ReferralStatsProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = getReferralLink(referralCode);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <p className="text-white/40 text-sm mb-3">Your Referral Link</p>
        <div className="flex gap-3">
          <div className="flex-1 px-4 py-3 rounded-lg bg-black border border-white/[0.1] font-mono text-sm text-white/70 truncate">
            {referralLink}
          </div>
          <button
            onClick={copyToClipboard}
            className="px-5 py-3 rounded-lg border border-primary/50 text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-primary/[0.03] border border-primary/20 text-center">
          <p className="text-4xl font-bold text-primary mb-1">
            {stats?.total_referrals ?? 0}
          </p>
          <p className="text-white/40 text-sm">Referrals</p>
        </div>

        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
          <p className="text-4xl font-bold text-white mb-1">
            #{stats?.total_referrals ? Math.max(1, 100 - stats.total_referrals) : '—'}
          </p>
          <p className="text-white/40 text-sm">Rank</p>
        </div>
      </div>

      {stats?.recent_referrals && stats.recent_referrals.length > 0 && (
        <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <p className="text-white/40 text-sm mb-4">Recent Referrals</p>
          <div className="space-y-3">
            {stats.recent_referrals.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <span className="text-white">@{referral.twitter_handle}</span>
                <span className="text-white/30 text-sm">{formatDate(referral.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
