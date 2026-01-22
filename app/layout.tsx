import type { Metadata } from 'next';
import { WagmiProvider } from '@/providers/WagmiProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'TAP.FUN - The Future of Social Trading',
  description: 'Join the waitlist for TAP.FUN and be the first to experience the future of social trading.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'TAP.FUN - The Future of Social Trading',
    description: 'Join the waitlist for TAP.FUN and be the first to experience the future of social trading.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAP.FUN - The Future of Social Trading',
    description: 'Join the waitlist for TAP.FUN and be the first to experience the future of social trading.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  );
}
