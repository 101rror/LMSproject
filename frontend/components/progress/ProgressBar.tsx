'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, className, showLabel = false, size = 'md' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{pct}%</span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-secondary', heights[size])}>
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
