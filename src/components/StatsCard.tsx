import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variants = {
  default: 'bg-card border',
  primary: 'bg-primary/10 border-primary/20',
  success: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  danger: 'bg-destructive/10 border-destructive/20',
  info: 'bg-info/10 border-info/20',
};

const textVariants = {
  default: 'text-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
  info: 'text-info',
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border shadow-sm transition-all hover:shadow-md',
        variants[variant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase font-medium text-muted-foreground tracking-wide">
            {title}
          </p>
          <p className={cn('text-2xl font-bold mt-1', textVariants[variant])}>
            {value}
          </p>
        </div>
        {Icon && (
          <div className={cn('p-2 rounded-lg', variants[variant])}>
            <Icon className={cn('w-5 h-5', textVariants[variant])} />
          </div>
        )}
      </div>
    </div>
  );
}
