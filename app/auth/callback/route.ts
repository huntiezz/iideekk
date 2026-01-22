import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { exchangeCodeForToken, getXUser } from '@/lib/x-oauth';
import {
  getOAuthStateCookie,
  deleteOAuthStateCookie,
  createSession,
  setSessionCookie,
} from '@/lib/session';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/login?error=missing_params`);
  }

  const oauthState = await getOAuthStateCookie();
  if (!oauthState) {
    return NextResponse.redirect(`${origin}/login?error=invalid_state`);
  }

  const [savedState, referralCode] = state.includes(':') ? state.split(':') : [state, null];

  if (savedState !== oauthState.state) {
    return NextResponse.redirect(`${origin}/login?error=state_mismatch`);
  }

  await deleteOAuthStateCookie();

  try {
    const clientId = process.env.X_CLIENT_ID!;
    const clientSecret = process.env.X_CLIENT_SECRET!;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUri = `${siteUrl}/auth/callback`;

    const tokens = await exchangeCodeForToken({
      code,
      clientId,
      clientSecret,
      redirectUri,
      codeVerifier: oauthState.codeVerifier,
    });

    const xUser = await getXUser(tokens.access_token);

    const adminClient = createAdminClient();

    const { data: existingUser } = await adminClient
      .from('users')
      .select('id, twitter_handle')
      .eq('twitter_id', xUser.id)
      .single();

    if (!existingUser) {
      const newReferralCode = nanoid(8);

      await adminClient.from('users').insert({
        twitter_id: xUser.id,
        twitter_handle: xUser.username,
        referral_code: newReferralCode,
        referred_by: referralCode || null,
      });

      if (referralCode) {
        const { data: referrer } = await adminClient
          .from('users')
          .select('twitter_id')
          .eq('referral_code', referralCode)
          .single();

        if (referrer) {
          await adminClient.from('referrals').insert({
            referrer_id: referrer.twitter_id,
            referred_id: xUser.id,
          });
        }
      }
    } else if (existingUser.twitter_handle !== xUser.username) {
      await adminClient
        .from('users')
        .update({ twitter_handle: xUser.username })
        .eq('twitter_id', xUser.id);
    }

    const sessionToken = await createSession({
      twitterId: xUser.id,
      twitterHandle: xUser.username,
    });

    await setSessionCookie(sessionToken);

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}
