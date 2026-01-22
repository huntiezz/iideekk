create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  twitter_id text unique not null,
  twitter_handle text not null,
  email text,
  wallet_address text,
  referral_code text unique not null,
  referred_by text,
  created_at timestamp with time zone default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer text not null,
  referred text not null,
  created_at timestamp with time zone default now()
);

create index if not exists idx_users_referral_code on public.users(referral_code);
create index if not exists idx_users_twitter_id on public.users(twitter_id);
create index if not exists idx_referrals_referrer on public.referrals(referrer);

alter table public.users enable row level security;
alter table public.referrals enable row level security;

create policy "Users can read own data" on public.users
  for select using (auth.uid()::text = id::text);

create policy "Users can update own data" on public.users
  for update using (auth.uid()::text = id::text);

create policy "Service role can do everything on users" on public.users
  for all using (auth.role() = 'service_role');

create policy "Service role can do everything on referrals" on public.referrals
  for all using (auth.role() = 'service_role');

create policy "Users can read referrals" on public.referrals
  for select using (true);

create or replace function public.get_leaderboard(limit_count int default 100)
returns table (
  twitter_handle text,
  referral_code text,
  referral_count bigint
) as $$
begin
  return query
  select
    u.twitter_handle,
    u.referral_code,
    count(r.id)::bigint as referral_count
  from public.users u
  left join public.referrals r on r.referrer = u.referral_code
  group by u.twitter_handle, u.referral_code
  having count(r.id) > 0
  order by referral_count desc
  limit limit_count;
end;
$$ language plpgsql security definer;

create or replace function public.get_referral_stats(user_referral_code text)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_referrals', (
      select count(*) from public.referrals where referrer = user_referral_code
    ),
    'recent_referrals', (
      select coalesce(json_agg(json_build_object(
        'twitter_handle', u.twitter_handle,
        'created_at', r.created_at
      ) order by r.created_at desc), '[]'::json)
      from public.referrals r
      join public.users u on u.referral_code = r.referred
      where r.referrer = user_referral_code
      limit 10
    )
  ) into result;
  return result;
end;
$$ language plpgsql security definer;
