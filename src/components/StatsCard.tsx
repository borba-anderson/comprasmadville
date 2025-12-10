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
  default: 'bg-card border hover:border-border/80',
  primary: 'bg-primary/5 border-primary/10 hover:border-primary/30',
  success: 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30',
  warning: 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/30',
  danger: 'bg-red-500/5 border-red-500/10 hover:border-red-500/30',
  info: 'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/30',
};

const iconVariants = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
};

const textVariants = {
  default: 'text-foreground',
  primary: 'text-primary',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
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
        'p-4 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider truncate">
            {title}
          </p>
          <p className={cn('text-2xl font-bold mt-1 tabular-nums', textVariants[variant])}>
            {value}
          </p>
          {trend !== undefined && (
            <p className={cn(
              'text-xs font-medium mt-1',
              trend >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2 rounded-lg shrink-0', iconVariants[variant])}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
