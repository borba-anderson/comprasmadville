import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  trend?: number;
}

const variants = {
  default: 'bg-card',
  primary: 'bg-card',
  success: 'bg-card',
  warning: 'bg-card',
  danger: 'bg-card',
  info: 'bg-card',
};

const iconVariants = {
  default: 'bg-[hsl(var(--surface-3))] text-muted-foreground',
  primary: 'bg-primary/8 text-primary',
  success: 'bg-emerald-500/8 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/8 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-500/8 text-red-600 dark:text-red-400',
  info: 'bg-blue-500/8 text-blue-600 dark:text-blue-400',
};

const textVariants = {
  default: 'text-foreground',
  primary: 'text-foreground',
  success: 'text-foreground',
  warning: 'text-foreground',
  danger: 'text-foreground',
  info: 'text-foreground',
};

const accentBar = {
  default: 'bg-border',
  primary: 'bg-primary',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  className,
  trend,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden p-5 rounded-xl border border-[hsl(var(--border-subtle))] shadow-[var(--shadow-elegant-sm)] transition-shadow duration-200 hover:shadow-[var(--shadow-elegant)]',
        variants[variant],
        className
      )}
    >
      <span className={cn('absolute left-0 top-0 h-full w-[2px] opacity-70', accentBar[variant])} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="data-label truncate">{title}</p>
          <p className={cn('mt-2.5 text-[26px] font-semibold leading-none tracking-[-0.03em] tabular-nums', textVariants[variant])}>
            {value}
          </p>
          {trend !== undefined && (
            <p className={cn(
              'text-xs font-medium mt-2 tabular-nums',
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2 rounded-lg shrink-0', iconVariants[variant])}>
            <Icon className="w-4 h-4" strokeWidth={1.75} />
          </div>
        )}
      </div>
    </div>
  );
}
