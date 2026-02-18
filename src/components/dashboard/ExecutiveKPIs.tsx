import { useMemo } from 'react';
import { Requisicao } from '@/types';
import {
  DollarSign,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Gauge,
  Target,
  Wallet,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ExecutiveKPIsProps {
  requisicoes: Requisicao[];
  previousPeriod: Requisicao[];
}

type TrafficLight = 'green' | 'yellow' | 'red';

interface KPIData {
  title: string;
  value: string;
  fullValue?: string;
  target?: string;
  targetLabel?: string;
  trend?: number;
  trendInverted?: boolean;
  status: TrafficLight;
  icon: React.ElementType;
  description: string;
}

const STATUS_COLORS: Record<TrafficLight, { dot: string; bg: string; text: string; ring: string }> = {
  green: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  yellow: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  red: { dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

export function ExecutiveKPIs({ requisicoes, previousPeriod }: ExecutiveKPIsProps) {
  const kpis = useMemo<KPIData[]>(() => {
    const total = requisicoes.length;
    const withValue = requisicoes.filter((r) => r.valor && r.valor > 0);
    const totalSpend = withValue.reduce((sum, r) => sum + (r.valor || 0), 0);

    // Previous period spend
    const prevWithValue = previousPeriod.filter((r) => r.valor && r.valor > 0);
    const prevTotalSpend = prevWithValue.reduce((sum, r) => sum + (r.valor || 0), 0);
    const spendTrend = prevTotalSpend > 0 ? ((totalSpend - prevTotalSpend) / prevTotalSpend) * 100 : 0;

    // Savings realized
    const withBoth = requisicoes.filter((r) => r.valor_orcado && r.valor_orcado > 0 && r.valor && r.valor > 0);
    const totalBudgeted = withBoth.reduce((sum, r) => sum + (r.valor_orcado || 0), 0);
    const totalNegotiated = withBoth.reduce((sum, r) => sum + (r.valor || 0), 0);
    const savingsRealized = totalBudgeted - totalNegotiated;
    const savingsPct = totalBudgeted > 0 ? (savingsRealized / totalBudgeted) * 100 : 0;

    // Cost avoidance (rejected + cancelled that had budgeted value)
    const avoided = requisicoes.filter((r) =>
      ['rejeitado', 'cancelado'].includes(r.status) && r.valor_orcado && r.valor_orcado > 0
    );
    const costAvoidance = avoided.reduce((sum, r) => sum + (r.valor_orcado || 0), 0);

    // Spend under management (% with fornecedor assigned)
    const managed = withValue.filter((r) => r.fornecedor_nome && r.fornecedor_nome.trim() !== '');
    const spendUnderMgmt = withValue.length > 0 ? (managed.length / withValue.length) * 100 : 0;

    // Maverick spend (requisitions without approval that are comprado+)
    const maverickStatuses = ['comprado', 'em_entrega', 'recebido'];
    const maverickReqs = requisicoes.filter(
      (r) => maverickStatuses.includes(r.status) && !r.aprovado_em
    );
    const maverickSpend = maverickReqs.reduce((sum, r) => sum + (r.valor || 0), 0);
    const maverickPct = totalSpend > 0 ? (maverickSpend / totalSpend) * 100 : 0;

    // Procurement ROI
    const procROI = savingsRealized > 0 ? savingsRealized / Math.max(totalSpend * 0.03, 1) : 0; // assume 3% proc cost

    // Performance Index (composite score 0-100)
    const completionRate = total > 0 ? (requisicoes.filter((r) => r.status === 'recebido').length / total) * 100 : 0;
    const today = new Date();
    const overdueCount = requisicoes.filter((r) => {
      if (!r.previsao_entrega || ['recebido', 'rejeitado', 'cancelado'].includes(r.status)) return false;
      return new Date(r.previsao_entrega) < today;
    }).length;
    const overdueRate = total > 0 ? (1 - overdueCount / total) * 100 : 100;
    const perfIndex = Math.round((completionRate * 0.3 + Math.min(savingsPct * 2, 30) + spendUnderMgmt * 0.2 + overdueRate * 0.2));

    return [
      {
        title: 'Total Spend YTD',
        value: formatCompact(totalSpend),
        fullValue: formatFull(totalSpend),
        target: formatCompact(totalBudgeted),
        targetLabel: 'vs Orçamento',
        trend: spendTrend,
        trendInverted: true,
        status: spendTrend > 10 ? 'red' : spendTrend > 0 ? 'yellow' : 'green',
        icon: DollarSign,
        description: 'Gasto total no período',
      },
      {
        title: 'Savings Realized',
        value: savingsRealized > 0 ? formatCompact(savingsRealized) : '—',
        fullValue: savingsRealized > 0 ? formatFull(savingsRealized) : undefined,
        target: `${savingsPct.toFixed(1)}%`,
        targetLabel: 'do orçado',
        status: savingsPct >= 10 ? 'green' : savingsPct >= 5 ? 'yellow' : 'red',
        icon: PiggyBank,
        description: 'Economia negociada vs orçado',
      },
      {
        title: 'Cost Avoidance',
        value: costAvoidance > 0 ? formatCompact(costAvoidance) : '—',
        fullValue: costAvoidance > 0 ? formatFull(costAvoidance) : undefined,
        target: `${avoided.length} itens`,
        targetLabel: 'evitados',
        status: costAvoidance > 0 ? 'green' : 'yellow',
        icon: ShieldCheck,
        description: 'Custo evitado (rejeitados/cancelados)',
      },
      {
        title: 'Spend Under Mgmt',
        value: `${spendUnderMgmt.toFixed(0)}%`,
        target: '100%',
        targetLabel: 'meta',
        status: spendUnderMgmt >= 80 ? 'green' : spendUnderMgmt >= 50 ? 'yellow' : 'red',
        icon: Target,
        description: 'Compras com fornecedor atribuído',
      },
      {
        title: 'Maverick Spend',
        value: `${maverickPct.toFixed(1)}%`,
        fullValue: maverickSpend > 0 ? formatFull(maverickSpend) : undefined,
        target: '< 5%',
        targetLabel: 'meta',
        status: maverickPct <= 5 ? 'green' : maverickPct <= 15 ? 'yellow' : 'red',
        icon: Wallet,
        description: 'Compras sem aprovação formal',
      },
      {
        title: 'Procurement ROI',
        value: `${procROI.toFixed(1)}x`,
        target: '> 3x',
        targetLabel: 'meta',
        status: procROI >= 3 ? 'green' : procROI >= 1.5 ? 'yellow' : 'red',
        icon: TrendingUp,
        description: 'Retorno sobre custo de procurement',
      },
      {
        title: 'Working Capital',
        value: formatCompact(totalSpend - totalNegotiated),
        target: formatCompact(totalBudgeted - totalSpend),
        targetLabel: 'disponível',
        status: totalSpend <= totalBudgeted * 0.9 ? 'green' : totalSpend <= totalBudgeted ? 'yellow' : 'red',
        icon: DollarSign,
        description: 'Impacto no capital de giro',
      },
      {
        title: 'Performance Index',
        value: `${perfIndex}`,
        target: '> 70',
        targetLabel: 'meta',
        status: perfIndex >= 70 ? 'green' : perfIndex >= 50 ? 'yellow' : 'red',
        icon: Gauge,
        description: 'Score composto de performance',
      },
    ];
  }, [requisicoes, previousPeriod]);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Gauge className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Executive Procurement Overview</h3>
            <p className="text-sm text-muted-foreground">KPIs estratégicos com metas e semáforo</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const colors = STATUS_COLORS[kpi.status];

            return (
              <Tooltip key={kpi.title}>
                <TooltipTrigger asChild>
                  <div className={`relative bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-all duration-200 cursor-default overflow-hidden`}>
                    {/* Status indicator bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${colors.dot}`} />

                    <div className="flex items-start justify-between mb-3 mt-1">
                      <div className={`w-9 h-9 ${colors.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} ring-2 ${colors.ring} animate-pulse`} />
                    </div>

                    <p className="text-2xl font-bold tracking-tight" title={kpi.fullValue}>
                      {kpi.value}
                    </p>
                    <p className="text-xs font-medium text-foreground/80 mt-0.5">{kpi.title}</p>

                    {/* Target comparison */}
                    {kpi.target && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-muted-foreground">{kpi.targetLabel}:</span>
                        <span className="text-[10px] font-semibold text-muted-foreground">{kpi.target}</span>
                      </div>
                    )}

                    {/* Trend */}
                    {kpi.trend !== undefined && kpi.trend !== 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {kpi.trend > 0 ? (
                          <TrendingUp className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className={`text-[10px] font-semibold ${
                          kpi.trendInverted
                            ? (kpi.trend < 0 ? 'text-emerald-600' : 'text-red-500')
                            : (kpi.trend > 0 ? 'text-emerald-600' : 'text-red-500')
                        }`}>
                          {kpi.trend > 0 ? '+' : ''}{kpi.trend.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{kpi.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

function formatCompact(value: number): string {
  if (Math.abs(value) >= 1000000) return `R$ ${(value / 1000000).toFixed(2).replace('.', ',')}M`;
  if (Math.abs(value) >= 1000) return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatFull(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
