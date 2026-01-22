'use client';

interface XAuthButtonProps {
  referralCode?: string;
}

export function XAuthButton({ referralCode }: XAuthButtonProps) {
  const handleLogin = () => {
    const url = referralCode ? `/api/auth/x?ref=${referralCode}` : '/api/auth/x';
    window.location.href = url;
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-black font-semibold rounded-lg shadow-[0_0_25px_rgba(0,255,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,0,0.5)] hover:bg-[#00dd00] transition-all duration-300"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Connect with X
    </button>
  );
}
