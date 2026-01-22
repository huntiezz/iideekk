import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            index < currentStep
              ? 'bg-primary'
              : index === currentStep
              ? 'bg-primary animate-pulse'
              : 'bg-white/20'
          )}
        />
      ))}
    </div>
  );
}
