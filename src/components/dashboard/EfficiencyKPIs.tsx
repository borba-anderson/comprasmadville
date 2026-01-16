import { useMemo } from 'react';
import { Requisicao } from '@/types';
import {
  Target,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Package,
} from 'lucide-react';

interface EfficiencyKPIsProps {
  requisicoes: Requisicao[];
}

export function EfficiencyKPIs({ requisicoes }: EfficiencyKPIsProps) {
  const metrics = useMemo(() => {
    const total = requisicoes.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Completion rate
    const finalizadas = requisicoes.filter(
      (r) => r.status === 'recebido'
    ).length;
    const taxaConclusao = total > 0 ? (finalizadas / total) * 100 : 0;

    // Average response time (created to first status change or approved)
    const comAprovacao = requisicoes.filter((r) => r.aprovado_em && r.created_at);
    const tempoMedioResposta =
      comAprovacao.length > 0
        ? comAprovacao.reduce((sum, r) => {
            const start = new Date(r.created_at);
            const end = new Date(r.aprovado_em!);
            return sum + Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          }, 0) / comAprovacao.length
        : 0;

    // Backlog (open requisitions)
    const backlog = requisicoes.filter(
      (r) => !['recebido', 'rejeitado', 'cancelado'].includes(r.status)
    ).length;

    // Overdue count and value
    const atrasadas = requisicoes.filter((r) => {
      if (!r.previsao_entrega) return false;
      if (['recebido', 'rejeitado', 'cancelado'].includes(r.status)) return false;
      const previsao = new Date(r.previsao_entrega);
      return previsao < today;
    });
    const countAtrasadas = atrasadas.length;
    const valorAtrasadas = atrasadas.reduce((sum, r) => sum + (r.valor || 0), 0);

    // Awaiting supplier
    const aguardandoFornecedor = requisicoes.filter(
      (r) => r.status === 'comprado' || r.status === 'em_entrega'
    ).length;

    // On-time delivery rate
    const finalizadasComPrevisao = requisicoes.filter(
      (r) => r.status === 'recebido' && r.previsao_entrega && r.recebido_em
    );
    const entreguesNoPrazo = finalizadasComPrevisao.filter((r) => {
      const previsao = new Date(r.previsao_entrega!);
      const recebido = new Date(r.recebido_em!);
      return recebido <= previsao;
    }).length;
    const taxaPontualidade =
      finalizadasComPrevisao.length > 0
        ? (entreguesNoPrazo / finalizadasComPrevisao.length) * 100
        : 0;

    return {
      taxaConclusao,
      tempoMedioResposta,
      backlog,
      countAtrasadas,
      valorAtrasadas,
      aguardandoFornecedor,
      taxaPontualidade,
      total,
    };
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value.toFixed(0)}`;
  };

  const kpis = [
    {
      label: 'Taxa de Conclusão',
      value: `${metrics.taxaConclusao.toFixed(0)}%`,
      icon: CheckCircle2,
      color: metrics.taxaConclusao >= 70 ? 'text-emerald-600' : metrics.taxaConclusao >= 40 ? 'text-amber-600' : 'text-red-600',
      bgColor: metrics.taxaConclusao >= 70 ? 'bg-emerald-50' : metrics.taxaConclusao >= 40 ? 'bg-amber-50' : 'bg-red-50',
      description: 'Requisições finalizadas',
    },
    {
      label: 'Tempo Médio',
      value: `${metrics.tempoMedioResposta.toFixed(1)}d`,
      icon: Clock,
      color: metrics.tempoMedioResposta <= 3 ? 'text-emerald-600' : metrics.tempoMedioResposta <= 7 ? 'text-amber-600' : 'text-red-600',
      bgColor: metrics.tempoMedioResposta <= 3 ? 'bg-emerald-50' : metrics.tempoMedioResposta <= 7 ? 'bg-amber-50' : 'bg-red-50',
      description: 'Até aprovação',
    },
    {
      label: 'Backlog',
      value: metrics.backlog.toString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Requisições abertas',
    },
    {
      label: 'Atrasadas',
      value: metrics.countAtrasadas.toString(),
      icon: AlertTriangle,
      color: metrics.countAtrasadas > 0 ? 'text-red-600' : 'text-emerald-600',
      bgColor: metrics.countAtrasadas > 0 ? 'bg-red-50' : 'bg-emerald-50',
      description: metrics.countAtrasadas > 0 ? formatCurrency(metrics.valorAtrasadas) : 'Nenhuma',
    },
    {
      label: 'Aguardando Fornecedor',
      value: metrics.aguardandoFornecedor.toString(),
      icon: TrendingUp,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Compradas ou em entrega',
    },
    {
      label: 'Pontualidade',
      value: `${metrics.taxaPontualidade.toFixed(0)}%`,
      icon: Target,
      color: metrics.taxaPontualidade >= 80 ? 'text-emerald-600' : metrics.taxaPontualidade >= 60 ? 'text-amber-600' : 'text-red-600',
      bgColor: metrics.taxaPontualidade >= 80 ? 'bg-emerald-50' : metrics.taxaPontualidade >= 60 ? 'bg-amber-50' : 'bg-red-50',
      description: 'Entregas no prazo',
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold">Indicadores de Eficiência</h4>
          <p className="text-sm text-muted-foreground">Performance do processo de compras</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`p-4 rounded-xl ${kpi.bgColor} transition-transform hover:scale-105`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${kpi.color}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {kpi.label}
                </span>
              </div>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
