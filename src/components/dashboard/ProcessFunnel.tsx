import { useMemo } from 'react';
import { Requisicao, RequisicaoStatus, STATUS_CONFIG } from '@/types';
import { Layers, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessFunnelProps {
  requisicoes: Requisicao[];
  onDrillDown?: (status: RequisicaoStatus) => void;
}

const FUNNEL_STAGES: { status: RequisicaoStatus; label: string }[] = [
  { status: 'pendente', label: 'Pendentes' },
  { status: 'em_analise', label: 'Em Análise' },
  { status: 'aprovado', label: 'Aprovados' },
  { status: 'cotando', label: 'Cotando' },
  { status: 'comprado', label: 'Comprados' },
  { status: 'em_entrega', label: 'Em Entrega' },
  { status: 'recebido', label: 'Recebidos' },
];

const COLORS: Record<RequisicaoStatus, string> = {
  pendente: 'bg-amber-500',
  em_analise: 'bg-blue-500',
  aprovado: 'bg-emerald-500',
  cotando: 'bg-violet-500',
  comprado: 'bg-cyan-500',
  em_entrega: 'bg-blue-400',
  recebido: 'bg-emerald-600',
  rejeitado: 'bg-red-500',
  cancelado: 'bg-gray-500',
};

export function ProcessFunnel({ requisicoes, onDrillDown }: ProcessFunnelProps) {
  const { funnelData, totalActive, atrasadas, valorAtrasadas } = useMemo(() => {
    const counts: Record<RequisicaoStatus, number> = {
      pendente: 0,
      em_analise: 0,
      aprovado: 0,
      cotando: 0,
      comprado: 0,
      em_entrega: 0,
      recebido: 0,
      rejeitado: 0,
      cancelado: 0,
    };

    let atrasadasCount = 0;
    let valorAtrasadasTotal = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    requisicoes.forEach((req) => {
      counts[req.status]++;

      if (
        req.previsao_entrega &&
        !['recebido', 'rejeitado', 'cancelado'].includes(req.status)
      ) {
        const previsao = new Date(req.previsao_entrega);
        if (previsao < today) {
          atrasadasCount++;
          valorAtrasadasTotal += req.valor || 0;
        }
      }
    });

    const total = requisicoes.length;
    const maxCount = Math.max(...Object.values(counts), 1);

    const data = FUNNEL_STAGES.map(({ status, label }) => ({
      status,
      label,
      count: counts[status],
      percent: total > 0 ? (counts[status] / total) * 100 : 0,
      width: (counts[status] / maxCount) * 100,
    }));

    const active = requisicoes.filter(
      (r) => !['recebido', 'rejeitado', 'cancelado'].includes(r.status)
    ).length;

    return {
      funnelData: data,
      totalActive: active,
      atrasadas: atrasadasCount,
      valorAtrasadas: valorAtrasadasTotal,
    };
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value.toFixed(0)}`;
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h4 className="font-semibold">Funil do Processo</h4>
            <p className="text-sm text-muted-foreground">
              {totalActive} requisições ativas
            </p>
          </div>
        </div>

        {/* Atrasadas Alert */}
        {atrasadas > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => onDrillDown?.('pendente')}
          >
            <AlertTriangle className="w-4 h-4" />
            {atrasadas} atrasadas
            <span className="text-xs opacity-80">({formatCurrency(valorAtrasadas)})</span>
          </Button>
        )}
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3">
        {funnelData.map((stage, index) => (
          <div
            key={stage.status}
            className="group cursor-pointer"
            onClick={() => onDrillDown?.(stage.status)}
          >
            <div className="flex items-center gap-3">
              <div className="w-20 text-right">
                <span className="text-xs text-muted-foreground">{stage.label}</span>
              </div>
              <div className="flex-1 relative h-8">
                <div
                  className={`absolute left-0 top-0 h-full rounded-md transition-all duration-300 group-hover:opacity-80 ${COLORS[stage.status]}`}
                  style={{ width: `${Math.max(stage.width, 2)}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-sm font-semibold text-white drop-shadow-sm">
                    {stage.count}
                  </span>
                </div>
              </div>
              <div className="w-12 text-right">
                <span className="text-xs text-muted-foreground">
                  {stage.percent.toFixed(0)}%
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Rejected/Cancelled Summary */}
      <div className="flex gap-4 mt-6 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">
            {requisicoes.filter((r) => r.status === 'rejeitado').length} rejeitadas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-xs text-muted-foreground">
            {requisicoes.filter((r) => r.status === 'cancelado').length} canceladas
          </span>
        </div>
      </div>
    </div>
  );
}
