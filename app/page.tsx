'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => setShowContent(true), 100);
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Logo size="lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div
          className={`text-center transition-all duration-700 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-transparent hover:bg-primary/5 transition-all mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-primary text-sm">Join Waitlist</span>
          </Link>

          <div className="mb-6">
            <Logo size="lg" className="justify-center" />
          </div>

          <h1 className="text-[32px] font-light leading-tight text-white mb-6">
            The future of{' '}
            <span className="text-primary">
              social trading
            </span>
            <br />
            is coming
          </h1>

        </div>
      </main>

      <footer className="py-6">
        <div className="flex items-center justify-center gap-6 text-white/40 text-sm">
          <Link href="/leaderboard" className="hover:text-white/60 transition-colors">
            Leaderboard
          </Link>
          <span className="text-white/20">•</span>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            Follow us
          </a>
        </div>
      </footer>
    </div>
  );
}
