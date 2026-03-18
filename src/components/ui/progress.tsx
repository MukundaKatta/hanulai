'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function Progress({ value, max = 100, className, color = 'blue', size = 'md', showLabel = false }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const colorClasses = {
    blue: 'bg-hanul-600',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-sovereign-500',
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('rounded-full transition-all duration-500 ease-out', colorClasses[color], sizeClasses[size])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
