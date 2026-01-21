import { useMemo } from 'react';
import { Wallet } from 'lucide-react';
import { Requisicao } from '@/types';
import { cn } from '@/lib/utils';

interface GastosPorCentroCustoProps {
  requisicoes: Requisicao[];
  onDrillDown?: (centroCusto: string) => void;
}

const COLORS = [
  'bg-violet-500',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-primary',
];

export function GastosPorCentroCusto({ requisicoes, onDrillDown }: GastosPorCentroCustoProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const cc = req.centro_custo || 'Não informado';
      if (!acc[cc]) {
        acc[cc] = { valor: 0, count: 0 };
      }
      acc[cc].valor += req.valor || 0;
      acc[cc].count += 1;
      return acc;
    }, {} as Record<string, { valor: number; count: number }>);

    const total = Object.values(grouped).reduce((sum, item) => sum + item.valor, 0);

    return Object.entries(grouped)
      .map(([centroCusto, data]) => ({
        centroCusto,
        valor: data.valor,
        count: data.count,
        percent: total > 0 ? (data.valor / total) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10); // Top 10
  }, [requisicoes]);

  const totalGasto = data.reduce((sum, item) => sum + item.valor, 0);
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.valor)) : 1;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1).replace('.', ',')}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Wallet className="w-4 h-4 text-violet-500" />
          </div>
          <div>
            <h3 className="font-semibold">Gastos por Centro de Custo</h3>
            <p className="text-xs text-muted-foreground">
              Top 10 • Total: {formatCurrency(totalGasto)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.centroCusto}
            className={cn(
              'group p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors',
              onDrillDown && 'cursor-pointer'
            )}
            onClick={() => onDrillDown?.(item.centroCusto)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={cn('w-3 h-3 rounded-full shrink-0', COLORS[index % COLORS.length])} />
                <span className="font-medium text-sm truncate" title={item.centroCusto}>
                  {item.centroCusto}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({item.count} req.)
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {item.percent.toFixed(1)}%
                </span>
                <span className="font-semibold text-sm tabular-nums">
                  {formatCurrency(item.valor)}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', COLORS[index % COLORS.length])}
                style={{ width: `${(item.valor / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-8">
            <Wallet className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum Centro de Custo encontrado
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Os dados aparecerão quando requisições tiverem CC atribuído
            </p>
          </div>
        )}
      </div>
    </div>
  );
}