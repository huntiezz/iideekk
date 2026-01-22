export interface User {
  id: string;
  twitter_id: string;
  twitter_handle: string;
  email: string | null;
  wallet_address: string | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer: string;
  referred: string;
  created_at: string;
}

export interface LeaderboardEntry {
  twitter_handle: string;
  referral_code: string;
  referral_count: number;
}

export interface ReferralStats {
  total_referrals: number;
  recent_referrals: {
    twitter_handle: string;
    created_at: string;
  }[];
}
