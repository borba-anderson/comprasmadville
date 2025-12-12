import { cn } from '@/lib/utils';
import { useSLA, getSLAStatus } from './hooks/useSLA';
import { Requisicao } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Clock, AlertTriangle, Timer } from 'lucide-react';

interface SLAIndicatorProps {
  requisicao: Requisicao;
  compact?: boolean;
}

export function SLAIndicator({ requisicao, compact = false }: SLAIndicatorProps) {
  const sla = useSLA(requisicao);
  const status = getSLAStatus(sla);

  // Don't show SLA for certain statuses
  if (['pendente', 'rejeitado', 'cancelado', 'recebido'].includes(requisicao.status)) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const getDisplayText = () => {
    if (sla.isOverdue && sla.overdueBy !== null) {
      return `${sla.overdueBy}d atrasado`;
    }
    if (sla.untilDelivery !== null) {
      return `${sla.untilDelivery}d`;
    }
    if (sla.sinceQuoting !== null) {
      return `${sla.sinceQuoting}d cotando`;
    }
    if (sla.sinceApproval !== null) {
      return `${sla.sinceApproval}d`;
    }
    return '—';
  };

  const getTooltipContent = () => {
    const lines: string[] = [];
    if (sla.sinceApproval !== null) {
      lines.push(`Aprovado há ${sla.sinceApproval} dia(s)`);
    }
    if (sla.sinceQuoting !== null) {
      lines.push(`Em cotação há ${sla.sinceQuoting} dia(s)`);
    }
    if (sla.untilDelivery !== null) {
      lines.push(`${sla.untilDelivery} dia(s) até entrega`);
    }
    if (sla.isOverdue && sla.overdueBy !== null) {
      lines.push(`⚠️ Atrasado há ${sla.overdueBy} dia(s)!`);
    }
    return lines.join('\n');
  };

  const Icon = status === 'critical' ? AlertTriangle : status === 'warning' ? Clock : Timer;

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs',
                status === 'critical' && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
                status === 'warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                status === 'ok' && 'bg-muted text-muted-foreground'
              )}
            >
              <Icon className="w-3 h-3" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="whitespace-pre-line text-xs">
            {getTooltipContent()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
              status === 'critical' && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
              status === 'warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
              status === 'ok' && 'bg-muted text-muted-foreground'
            )}
          >
            <Icon className="w-3 h-3" />
            {getDisplayText()}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="whitespace-pre-line text-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
