import { useMemo } from 'react';
import { Requisicao } from '@/types';
import { Trophy, TrendingUp, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EconomiaPorCompradorProps {
  requisicoes: Requisicao[];
}

export function EconomiaPorComprador({ requisicoes }: EconomiaPorCompradorProps) {
  const ranking = useMemo(() => {
    const buyerMap = new Map<string, { orcado: number; negociado: number; count: number }>();

    requisicoes.forEach((r) => {
      if (r.comprador_nome && r.valor_orcado && r.valor && r.valor_orcado > r.valor) {
        const current = buyerMap.get(r.comprador_nome) || { orcado: 0, negociado: 0, count: 0 };
        current.orcado += r.valor_orcado;
        current.negociado += r.valor;
        current.count += 1;
        buyerMap.set(r.comprador_nome, current);
      }
    });

    return Array.from(buyerMap.entries())
      .map(([nome, data]) => ({
        nome,
        economia: data.orcado - data.negociado,
        percentual: data.orcado > 0 ? ((data.orcado - data.negociado) / data.orcado) * 100 : 0,
        orcado: data.orcado,
        negociado: data.negociado,
        count: data.count,
      }))
      .sort((a, b) => b.economia - a.economia);
  }, [requisicoes]);

  const maxEconomia = ranking.length > 0 ? ranking[0].economia : 1;

  const formatCurrency = (v: number) => {
    if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
    return `R$ ${v.toFixed(0)}`;
  };

  const getMedalColor = (idx: number) => {
    if (idx === 0) return 'text-amber-500';
    if (idx === 1) return 'text-gray-400';
    if (idx === 2) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  const totalEconomia = ranking.reduce((s, r) => s + r.economia, 0);

  return (
    <div className="bg-card rounded-xl border border-border/50 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
          <Trophy className="w-4.5 h-4.5 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Economia por Comprador</h4>
          <p className="text-[11px] text-muted-foreground">
            Total economizado: {formatCurrency(totalEconomia)}
          </p>
        </div>
      </div>

      {ranking.length > 0 ? (
        <div className="space-y-3">
          {ranking.map((buyer, idx) => (
            <div key={buyer.nome} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                {idx < 3 ? (
                  <Trophy className={`w-3.5 h-3.5 ${getMedalColor(idx)}`} />
                ) : (
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{buyer.nome}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-emerald-600 tabular-nums">
                      {formatCurrency(buyer.economia)}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-medium">
                      ({buyer.percentual.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <Progress
                    value={(buyer.economia / maxEconomia) * 100}
                    className="h-1 flex-1 mr-3"
                  />
                  <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                    {buyer.count} req
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <TrendingUp className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">
            Nenhuma economia registrada ainda
          </p>
        </div>
      )}
    </div>
  );
}
