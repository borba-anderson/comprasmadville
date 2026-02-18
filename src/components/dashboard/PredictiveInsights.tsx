import { useMemo } from 'react';
import { Requisicao } from '@/types';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface PredictiveInsightsProps {
  requisicoes: Requisicao[];
}

export function PredictiveInsights({ requisicoes }: PredictiveInsightsProps) {
  const { forecast, anomalies, insights } = useMemo(() => {
    const now = new Date();

    // Build monthly spend data for last 6 months
    const monthlySpend: { month: string; spend: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthReqs = requisicoes.filter((r) => {
        const created = new Date(r.created_at);
        return created >= d && created < nextMonth;
      });
      const spend = monthReqs.reduce((s, r) => s + (r.valor || 0), 0);
      monthlySpend.push({
        month: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        spend,
        count: monthReqs.length,
      });
    }

    // Simple linear regression for forecast
    const n = monthlySpend.length;
    const xSum = monthlySpend.reduce((s, _, i) => s + i, 0);
    const ySum = monthlySpend.reduce((s, d) => s + d.spend, 0);
    const xySum = monthlySpend.reduce((s, d, i) => s + i * d.spend, 0);
    const x2Sum = monthlySpend.reduce((s, _, i) => s + i * i, 0);
    const slope = n > 1 ? (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum) : 0;
    const intercept = n > 0 ? (ySum - slope * xSum) / n : 0;

    // Forecast next 3 months
    const forecastData = [...monthlySpend.map((d) => ({ ...d, forecast: undefined as number | undefined }))];
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const predicted = Math.max(0, intercept + slope * (n - 1 + i));
      forecastData.push({
        month: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        spend: 0,
        count: 0,
        forecast: Math.round(predicted),
      });
    }

    // Anomaly detection (values > 2 std dev from mean)
    const mean = n > 0 ? ySum / n : 0;
    const variance = n > 1
      ? monthlySpend.reduce((s, d) => s + Math.pow(d.spend - mean, 2), 0) / n
      : 0;
    const stdDev = Math.sqrt(variance);
    const anomalyList = monthlySpend
      .filter((d) => Math.abs(d.spend - mean) > stdDev * 1.5 && d.spend > 0)
      .map((d) => ({
        month: d.month,
        spend: d.spend,
        deviation: ((d.spend - mean) / mean) * 100,
      }));

    // Generate insights
    const insightList: { text: string; type: 'positive' | 'negative' | 'neutral' }[] = [];

    if (slope > 0) {
      insightList.push({
        text: `Tendência de aumento de gastos: +${formatCurrency(Math.abs(slope))}/mês`,
        type: 'negative',
      });
    } else if (slope < 0) {
      insightList.push({
        text: `Tendência de redução de gastos: ${formatCurrency(Math.abs(slope))}/mês`,
        type: 'positive',
      });
    }

    // Overdue supplier prediction
    const overdueBySupplier = new Map<string, number>();
    requisicoes.forEach((r) => {
      if (r.fornecedor_nome && r.previsao_entrega && !['recebido', 'rejeitado', 'cancelado'].includes(r.status)) {
        if (new Date(r.previsao_entrega) < now) {
          overdueBySupplier.set(r.fornecedor_nome, (overdueBySupplier.get(r.fornecedor_nome) || 0) + 1);
        }
      }
    });
    const riskSuppliers = Array.from(overdueBySupplier.entries()).filter(([, c]) => c >= 2);
    if (riskSuppliers.length > 0) {
      insightList.push({
        text: `${riskSuppliers.length} fornecedor(es) com padrão de atraso recorrente`,
        type: 'negative',
      });
    }

    // Savings trend
    const withBoth = requisicoes.filter((r) => r.valor_orcado && r.valor && r.valor > 0 && r.valor_orcado > 0);
    const totalBudget = withBoth.reduce((s, r) => s + (r.valor_orcado || 0), 0);
    const totalActual = withBoth.reduce((s, r) => s + (r.valor || 0), 0);
    const savingsPct = totalBudget > 0 ? ((totalBudget - totalActual) / totalBudget) * 100 : 0;

    if (savingsPct > 5) {
      const projectedSavings = (slope < 0 ? Math.abs(slope) * 3 : 0) + (totalBudget - totalActual) * 0.5;
      insightList.push({
        text: `Economia projetada próx. 3 meses: ~${formatCurrency(projectedSavings)}`,
        type: 'positive',
      });
    }

    const pendingCount = requisicoes.filter((r) => r.status === 'pendente').length;
    if (pendingCount > 10) {
      insightList.push({
        text: `${pendingCount} requisições pendentes podem gerar gargalo de aprovação`,
        type: 'negative',
      });
    }

    return { forecast: forecastData, anomalies: anomalyList, insights: insightList };
  }, [requisicoes]);

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h4 className="font-semibold">Predictive Intelligence</h4>
          <p className="text-sm text-muted-foreground">Previsão de gastos e detecção de anomalias</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast chart */}
        <div className="lg:col-span-2">
          <h5 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            Previsão de Gastos — Próximos 3 Meses
          </h5>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip
                  formatter={(v: number, name: string) => [
                    formatCurrency(v),
                    name === 'forecast' ? 'Previsão' : 'Realizado',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  fill="hsl(156,100%,26%)"
                  fillOpacity={0.15}
                  stroke="hsl(156,100%,26%)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  fill="hsl(270,60%,55%)"
                  fillOpacity={0.1}
                  stroke="hsl(270,60%,55%)"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights sidebar */}
        <div className="space-y-3">
          <h5 className="text-xs font-semibold uppercase text-muted-foreground">Insights & Alertas</h5>

          {insights.length === 0 && (
            <p className="text-xs text-muted-foreground">Sem insights suficientes no momento</p>
          )}

          {insights.map((insight, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 p-3 rounded-lg text-xs ${
                insight.type === 'positive'
                  ? 'bg-emerald-50 text-emerald-800'
                  : insight.type === 'negative'
                  ? 'bg-red-50 text-red-800'
                  : 'bg-blue-50 text-blue-800'
              }`}
            >
              {insight.type === 'positive' ? (
                <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              ) : insight.type === 'negative' ? (
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              ) : (
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              )}
              <span>{insight.text}</span>
            </div>
          ))}

          {anomalies.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <h6 className="text-[10px] uppercase font-semibold text-muted-foreground mb-2">Anomalias Detectadas</h6>
              {anomalies.map((a, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <span className="text-muted-foreground">{a.month}</span>
                  <span className={a.deviation > 0 ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                    {a.deviation > 0 ? '+' : ''}{a.deviation.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCurrency(v: number): string {
  if (Math.abs(v) >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
  return `R$ ${v.toFixed(0)}`;
}
