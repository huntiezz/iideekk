import { NextResponse } from 'next/server';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  getAuthorizationUrl,
} from '@/lib/x-oauth';
import { setOAuthStateCookie } from '@/lib/session';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  const clientId = process.env.X_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'X_CLIENT_ID not configured' }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const redirectUri = `${siteUrl}/auth/callback`;

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  await setOAuthStateCookie(state, codeVerifier);

  const authUrl = getAuthorizationUrl({
    clientId,
    redirectUri,
    state,
    codeChallenge,
    referralCode: ref || undefined,
  });

  return NextResponse.redirect(authUrl);
}
