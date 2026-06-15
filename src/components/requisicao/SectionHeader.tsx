import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader = ({ icon: Icon, title, subtitle, className }: SectionHeaderProps) => {
  return (
    <div className={cn('mb-8 flex items-start gap-4', className)}>
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
        <Icon className="w-5 h-5 text-primary-foreground" strokeWidth={2.25} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold text-foreground tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
