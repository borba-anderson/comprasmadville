import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ValorHistorico } from '@/types';
import { cn } from '@/lib/utils';

interface ValueHistoryListProps {
  history: ValorHistorico[];
  className?: string;
}

export function ValueHistoryList({ history, className }: ValueHistoryListProps) {
  if (history.length === 0) {
    return null;
  }

  const formatCurrency = (value: number | null) => {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <History className="w-4 h-4" />
        Histórico de Valores
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
        {history.map((item) => {
          const diff = item.valor_anterior 
            ? item.valor_novo - item.valor_anterior 
            : item.valor_novo;
          const isIncrease = diff > 0;
          const isDecrease = diff < 0;

          return (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm"
            >
              <div className="flex items-center gap-2">
                {isIncrease ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : isDecrease ? (
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Minus className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{formatCurrency(item.valor_novo)}</p>
                  {item.valor_anterior != null && (
                    <p className="text-xs text-muted-foreground">
                      Anterior: {formatCurrency(item.valor_anterior)}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{item.alterado_por}</p>
                <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
