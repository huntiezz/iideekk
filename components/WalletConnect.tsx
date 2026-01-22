'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { formatAddress } from '@/lib/utils';

interface WalletConnectProps {
  onWalletConnected: (address: string) => void;
  currentWallet?: string | null;
}

export function WalletConnect({ onWalletConnected, currentWallet }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (isConnected && address && !hasSaved && !currentWallet) {
      onWalletConnected(address);
      setHasSaved(true);
    }
  }, [isConnected, address, onWalletConnected, hasSaved, currentWallet]);

  if (currentWallet) {
    return null;
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center justify-center gap-4">
        <span className="text-white font-mono">{formatAddress(address)}</span>
        <button
          onClick={() => disconnect()}
          className="text-white/40 hover:text-white/60 text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openConnectModal}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-black font-semibold rounded-lg shadow-[0_0_25px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.5)] hover:bg-[#00dd00] transition-all duration-300"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
        />
      </svg>
      Connect Wallet
    </button>
  );
}
