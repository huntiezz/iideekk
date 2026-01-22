'use client';

import Link from 'next/link';
import { Logo } from './ui/Logo';
import { Button } from './ui/Button';
import { useUser } from '@/hooks/useUser';

export function Navbar() {
  const { user, signOut, isLoading } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <Logo size="sm" />
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-white/60 hover:text-white transition-colors text-sm">
              Leaderboard
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                      <Button variant="secondary" size="sm">
                        Dashboard
                      </Button>
                    </Link>
                    <button
                      onClick={signOut}
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button size="sm">Join Waitlist</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
