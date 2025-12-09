import { useMemo } from 'react';
import { Requisicao } from '@/types';

interface GastosPorSolicitanteProps {
  requisicoes: Requisicao[];
  totalGasto: number;
}

export function GastosPorSolicitante({ requisicoes, totalGasto }: GastosPorSolicitanteProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const nome = req.solicitante_nome;
      acc[nome] = (acc[nome] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([nome, valor]) => ({
        nome,
        nomeAbreviado: nome.split(' ').slice(0, 2).join(' '),
        valor,
        percent: (valor / totalGasto) * 100,
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 6);
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
        <h4 className="font-medium">Por Solicitante</h4>
        <span className="text-xs text-muted-foreground">Top 6</span>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.nome} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-4">{index + 1}.</span>
                <span className="font-medium truncate max-w-[140px]" title={item.nome}>
                  {item.nomeAbreviado}
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
                className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700 ease-out"
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
