import { cn } from '@/lib/utils';
import { RequisicaoStatus, STATUS_CONFIG } from '@/types';

interface StatusBadgeProps {
  status: RequisicaoStatus;
  className?: string;
  showIcon?: boolean;
}

const STATUS_STYLES: Record<RequisicaoStatus, string> = {
  pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700',
  em_analise: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700',
  aprovado: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700',
  cotando: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 border-violet-300 dark:border-violet-700',
  comprado: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400 border-cyan-300 dark:border-cyan-700',
  em_entrega: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700',
  recebido: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700',
  rejeitado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700',
  cancelado: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-700',
};

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border',
        STATUS_STYLES[status],
        className
      )}
    >
      {showIcon && <span className="text-sm">{config.icon}</span>}
      {config.label}
    </span>
  );
}
