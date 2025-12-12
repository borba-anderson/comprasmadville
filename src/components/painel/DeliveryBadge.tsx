import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface DeliveryBadgeProps {
  previsao: string | undefined | null;
  className?: string;
}

export function DeliveryBadge({ previsao, className }: DeliveryBadgeProps) {
  if (!previsao) {
    return (
      <span className="text-xs text-muted-foreground">—</span>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deliveryDate = new Date(previsao);
  deliveryDate.setHours(0, 0, 0, 0);
  const diff = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let status: 'ontime' | 'today' | 'overdue';
  let tooltipText: string;
  let Icon = CheckCircle;

  if (diff < 0) {
    status = 'overdue';
    tooltipText = `Atrasado há ${Math.abs(diff)} dia${Math.abs(diff) > 1 ? 's' : ''}`;
    Icon = AlertTriangle;
  } else if (diff === 0) {
    status = 'today';
    tooltipText = 'Entrega hoje';
    Icon = Clock;
  } else {
    status = 'ontime';
    tooltipText = `${diff} dia${diff > 1 ? 's' : ''} até entrega`;
    Icon = CheckCircle;
  }

  const formattedDate = deliveryDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full cursor-default transition-colors',
              status === 'overdue' && 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
              status === 'today' && 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
              status === 'ontime' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
              className
            )}
          >
            <Icon className="w-3 h-3" />
            {formattedDate}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
