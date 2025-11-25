import { cn } from '@/lib/utils';
import { RequisicaoStatus, STATUS_CONFIG } from '@/types';

interface StatusBadgeProps {
  status: RequisicaoStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <span className={cn('status-badge', `status-${status}`, className)}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
}
