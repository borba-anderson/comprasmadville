import { cn } from '@/lib/utils';
import { RequisicaoPrioridade, PRIORIDADE_CONFIG } from '@/types';

interface PriorityBadgeProps {
  priority: RequisicaoPrioridade;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const config = PRIORIDADE_CONFIG[priority];
  
  return (
    <span className={cn('priority-badge', `priority-${priority}`, className)}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
}
