'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import type { ReferralStats } from '@/types';

export function useReferralStats(referralCode: string | null) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!referralCode) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      const supabase = createClient();

      const { data } = await supabase.rpc('get_referral_stats', {
        user_referral_code: referralCode,
      });

      setStats(data);
      setIsLoading(false);
    };

    fetchStats();
  }, [referralCode]);

  return { stats, isLoading };
}
