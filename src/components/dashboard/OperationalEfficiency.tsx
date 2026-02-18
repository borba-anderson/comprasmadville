import { useMemo } from 'react';
import { Requisicao } from '@/types';
import {
  Settings,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OperationalEfficiencyProps {
  requisicoes: Requisicao[];
}

export function OperationalEfficiency({ requisicoes }: OperationalEfficiencyProps) {
  const metrics = useMemo(() => {
    const total = requisicoes.length;

    // Time per stage (average days)
    const stageTimings = {
      pendente_to_approved: [] as number[],
      approved_to_quoted: [] as number[],
      quoted_to_purchased: [] as number[],
      purchased_to_delivered: [] as number[],
    };

    requisicoes.forEach((r) => {
      if (r.aprovado_em && r.created_at) {
        const days = (new Date(r.aprovado_em).getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24);
        if (days >= 0 && days < 365) stageTimings.pendente_to_approved.push(days);
      }
      if (r.comprado_em && r.aprovado_em) {
        const days = (new Date(r.comprado_em).getTime() - new Date(r.aprovado_em).getTime()) / (1000 * 60 * 60 * 24);
        if (days >= 0 && days < 365) stageTimings.approved_to_quoted.push(days);
      }
      if (r.recebido_em && r.comprado_em) {
        const days = (new Date(r.recebido_em).getTime() - new Date(r.comprado_em).getTime()) / (1000 * 60 * 60 * 24);
        if (days >= 0 && days < 365) stageTimings.purchased_to_delivered.push(days);
      }
    });

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    // Cost per requisition
    const totalSpend = requisicoes.reduce((s, r) => s + (r.valor || 0), 0);
    const costPerReq = total > 0 ? totalSpend / total : 0;

    // Emergency requisitions (alta prioridade)
    const emergencias = requisicoes.filter((r) => r.prioridade === 'ALTA').length;
    const emergencyPct = total > 0 ? (emergencias / total) * 100 : 0;

    // Buyer productivity
    const buyerMap = new Map<string, number>();
    requisicoes.forEach((r) => {
      if (r.comprador_nome) {
        buyerMap.set(r.comprador_nome, (buyerMap.get(r.comprador_nome) || 0) + 1);
      }
    });
    const buyers = Array.from(buyerMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        spend: requisicoes.filter((r) => r.comprador_nome === name).reduce((s, r) => s + (r.valor || 0), 0),
      }))
      .sort((a, b) => b.count - a.count);

    // Process compliance (has all required fields filled)
    const compliant = requisicoes.filter(
      (r) => r.justificativa && r.solicitante_setor && r.solicitante_nome
    ).length;
    const compliancePct = total > 0 ? (compliant / total) * 100 : 0;

    // Bottleneck detection
    const statusCounts = new Map<string, number>();
    requisicoes.forEach((r) => {
      if (!['recebido', 'rejeitado', 'cancelado'].includes(r.status)) {
        statusCounts.set(r.status, (statusCounts.get(r.status) || 0) + 1);
      }
    });
    const bottleneck = Array.from(statusCounts.entries()).sort((a, b) => b[1] - a[1])[0];

    return {
      stageAvg: {
        approval: avg(stageTimings.pendente_to_approved),
        quoting: avg(stageTimings.approved_to_quoted),
        delivery: avg(stageTimings.purchased_to_delivered),
      },
      costPerReq,
      emergencyPct,
      buyers,
      compliancePct,
      bottleneck: bottleneck ? { status: bottleneck[0], count: bottleneck[1] } : null,
      total,
    };
  }, [requisicoes]);

  const stages = [
    { label: 'Pendente → Aprovação', days: metrics.stageAvg.approval, target: 2, icon: Clock },
    { label: 'Aprovação → Compra', days: metrics.stageAvg.quoting, target: 5, icon: BarChart3 },
    { label: 'Compra → Recebimento', days: metrics.stageAvg.delivery, target: 10, icon: CheckCircle },
  ];

  const formatCurrency = (v: number) => {
    if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
    return `R$ ${v.toFixed(0)}`;
  };

  const STATUS_LABELS: Record<string, string> = {
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    aprovado: 'Aprovado',
    cotando: 'Cotando',
    comprado: 'Comprado',
    em_entrega: 'Em Entrega',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Operational Process Efficiency</h3>
          <p className="text-sm text-muted-foreground">Tempo por etapa, produtividade e gargalos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage timings */}
        <div className="bg-card rounded-xl border border-border/50 p-5">
          <h4 className="text-sm font-semibold mb-4">Tempo por Etapa (dias)</h4>
          <div className="space-y-4">
            {stages.map((stage) => {
              const Icon = stage.icon;
              const ratio = stage.target > 0 ? (stage.days / stage.target) : 0;
              const isOk = ratio <= 1;
              const isWarning = ratio > 1 && ratio <= 1.5;

              return (
                <div key={stage.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">{stage.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isOk ? 'text-emerald-600' : isWarning ? 'text-amber-600' : 'text-red-600'}`}>
                        {stage.days.toFixed(1)}d
                      </span>
                      <span className="text-[10px] text-muted-foreground">/ {stage.target}d</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isOk ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottleneck */}
          {metrics.bottleneck && (
            <div className="mt-5 pt-4 border-t">
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">Gargalo detectado</p>
                  <p className="text-[10px] text-amber-700">
                    {metrics.bottleneck.count} requisições em "{STATUS_LABELS[metrics.bottleneck.status] || metrics.bottleneck.status}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buyer productivity */}
        <div className="bg-card rounded-xl border border-border/50 p-5">
          <h4 className="text-sm font-semibold mb-4">Produtividade por Comprador</h4>
          {metrics.buyers.length > 0 ? (
            <div className="space-y-3">
              {metrics.buyers.slice(0, 5).map((buyer, idx) => (
                <div key={buyer.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate">{buyer.name}</span>
                      <span className="text-xs font-bold tabular-nums">{buyer.count} req</span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <Progress value={(buyer.count / Math.max(metrics.buyers[0].count, 1)) * 100} className="h-1 flex-1 mr-3" />
                      <span className="text-[10px] text-muted-foreground tabular-nums">{formatCurrency(buyer.spend)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhum comprador atribuído</p>
          )}
        </div>

        {/* Process KPIs */}
        <div className="bg-card rounded-xl border border-border/50 p-5">
          <h4 className="text-sm font-semibold mb-4">KPIs do Processo</h4>
          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Custo por Requisição</span>
                <span className="text-sm font-bold">{formatCurrency(metrics.costPerReq)}</span>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Emergenciais (Alta)</span>
                <span className={`text-sm font-bold ${metrics.emergencyPct > 30 ? 'text-red-600' : 'text-foreground'}`}>
                  {metrics.emergencyPct.toFixed(0)}%
                </span>
              </div>
              <Progress value={metrics.emergencyPct} className="h-1" />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Compliance</span>
                <span className={`text-sm font-bold ${metrics.compliancePct >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {metrics.compliancePct.toFixed(0)}%
                </span>
              </div>
              <Progress value={metrics.compliancePct} className="h-1" />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Requisições</span>
                <span className="text-sm font-bold">{metrics.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
