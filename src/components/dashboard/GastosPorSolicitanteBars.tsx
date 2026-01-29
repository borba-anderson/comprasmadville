import { useMemo } from 'react';
import { Requisicao } from '@/types';
import { Users } from 'lucide-react';

interface GastosPorSolicitanteBarsProps {
  requisicoes: Requisicao[];
  onSolicitanteClick?: (solicitanteNome: string) => void;
}

const COLORS = [
  'bg-primary',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-rose-500',
  'bg-blue-500',
  'bg-orange-500',
];

export function GastosPorSolicitanteBars({ requisicoes, onSolicitanteClick }: GastosPorSolicitanteBarsProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const nome = req.solicitante_nome;
      acc[nome] = (acc[nome] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);

    return Object.entries(grouped)
      .map(([nome, valor]) => ({
        nome,
        nomeAbreviado: nome.split(' ').slice(0, 2).join(' '),
        valor,
        percent: total > 0 ? (valor / total) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8);
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalGasto = data.reduce((acc, d) => acc + d.valor, 0);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold">Gastos por Solicitante</h4>
            <p className="text-sm text-muted-foreground">Top solicitantes</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhum dado disponível
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold">Gastos por Solicitante</h4>
            <p className="text-sm text-muted-foreground">Top {data.length} solicitantes</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold">{formatCurrency(totalGasto)}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div 
            key={item.nome} 
            className={`space-y-2 ${onSolicitanteClick ? 'cursor-pointer hover:bg-muted/40 -mx-2 px-2 py-1 rounded-lg transition-colors' : ''}`}
            onClick={() => onSolicitanteClick?.(item.nome)}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${COLORS[index % COLORS.length]} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                  {index + 1}
                </div>
                <span className="font-medium truncate max-w-[180px]" title={item.nome}>
                  {item.nomeAbreviado}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground text-xs font-medium">
                  {item.percent.toFixed(1)}%
                </span>
                <span className="font-semibold tabular-nums w-24 text-right">
                  {formatCurrency(item.valor)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
              <div 
                className={`h-full ${COLORS[index % COLORS.length]} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
