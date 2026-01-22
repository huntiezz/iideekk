import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className }: LogoProps) {
  const sizes = {
    sm: { text: 'text-[10px]', icon: 'w-4 h-4', gap: 'gap-1.5' },
    md: { text: 'text-xs', icon: 'w-5 h-5', gap: 'gap-2' },
    lg: { text: 'text-base', icon: 'w-6 h-6', gap: 'gap-2' },
  };

  return (
    <div className={cn('flex items-center', sizes[size].gap, className)}>
      <img
        src="/cursor.png"
        alt=""
        className={sizes[size].icon}
        style={{ imageRendering: 'pixelated' }}
      />
      <span className={cn("font-['Press_Start_2P']", sizes[size].text)}>
        <span className="text-primary">TAP</span>
        <span className="text-white">.</span>
        <span className="text-white">FUN</span>
      </span>
    </div>
  );
}
