import { useMemo } from 'react';
import { Requisicao } from '@/types';

interface GastosPorSetorProps {
  requisicoes: Requisicao[];
  totalGasto: number;
}

const COLORS = [
  'bg-primary',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
];

export function GastosPorSetor({ requisicoes, totalGasto }: GastosPorSetorProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const setor = req.solicitante_setor;
      acc[setor] = (acc[setor] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([setor, valor]) => ({
        setor,
        valor,
        percent: (valor / totalGasto) * 100,
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [requisicoes, totalGasto]);

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const maxPercent = data.length > 0 ? Math.max(...data.map(d => d.percent)) : 100;

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-medium">Por Setor</h4>
        <span className="text-xs text-muted-foreground">{data.length} setores</span>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.setor} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${COLORS[index % COLORS.length]}`} />
                <span className="font-medium truncate max-w-[140px]" title={item.setor}>
                  {item.setor}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-xs">
                  {item.percent.toFixed(1)}%
                </span>
                <span className="font-semibold tabular-nums w-20 text-right">
                  {formatCurrency(item.valor)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out ${COLORS[index % COLORS.length]}`}
                style={{ width: `${(item.percent / maxPercent) * 100}%` }}
              />
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum dado disponível
          </p>
        )}
      </div>
    </div>
  );
}
