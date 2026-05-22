import { useMemo } from "react";
import { Requisicao } from "@/types";
import { Brain, TrendingUp, AlertTriangle, Activity, Sparkles, ArrowUpRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface PredictiveInsightsProps {
  requisicoes: Requisicao[];
}

export function PredictiveInsights({ requisicoes }: PredictiveInsightsProps) {
  const { forecast, anomalies, insights, riskScore, riskBreakdown, supplierTrend } = useMemo(() => {
    const now = new Date();

    // Monthly spend (last 6 months)
    const monthlySpend: { month: string; spend: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthReqs = requisicoes.filter((r) => {
        const created = new Date(r.created_at);
        return created >= d && created < nextMonth;
      });
      monthlySpend.push({
        month: d.toLocaleDateString("pt-BR", { month: "short" }),
        spend: monthReqs.reduce((s, r) => s + (r.valor || 0), 0),
        count: monthReqs.length,
      });
    }

    // Linear regression for forecast
    const n = monthlySpend.length;
    const xSum = monthlySpend.reduce((s, _, i) => s + i, 0);
    const ySum = monthlySpend.reduce((s, d) => s + d.spend, 0);
    const xySum = monthlySpend.reduce((s, d, i) => s + i * d.spend, 0);
    const x2Sum = monthlySpend.reduce((s, _, i) => s + i * i, 0);
    const slope = n > 1 ? (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum) : 0;
    const intercept = n > 0 ? (ySum - slope * xSum) / n : 0;

    const forecastData = [...monthlySpend.map((d) => ({ ...d, forecast: undefined as number | undefined }))];
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const predicted = Math.max(0, intercept + slope * (n - 1 + i));
      forecastData.push({
        month: d.toLocaleDateString("pt-BR", { month: "short" }),
        spend: 0,
        count: 0,
        forecast: Math.round(predicted),
      });
    }

    // Anomalies
    const mean = n > 0 ? ySum / n : 0;
    const variance = n > 1 ? monthlySpend.reduce((s, d) => s + Math.pow(d.spend - mean, 2), 0) / n : 0;
    const stdDev = Math.sqrt(variance);
    const anomalyList = monthlySpend
      .filter((d) => Math.abs(d.spend - mean) > stdDev * 1.5 && d.spend > 0)
      .map((d) => ({
        month: d.month,
        spend: d.spend,
        deviation: ((d.spend - mean) / mean) * 100,
      }));

    // Insights
    const insightList: { text: string; type: "positive" | "negative" | "neutral" }[] = [];
    if (slope > 0) {
      insightList.push({
        text: `Tendência de alta nos gastos: +${formatCurrency(Math.abs(slope))}/mês`,
        type: "negative",
      });
    } else if (slope < 0) {
      insightList.push({
        text: `Tendência de queda: ${formatCurrency(Math.abs(slope))}/mês economizados`,
        type: "positive",
      });
    }

    // Supplier risk
    const overdueBySupplier = new Map<string, number>();
    requisicoes.forEach((r) => {
      if (r.fornecedor_nome && r.previsao_entrega && !["recebido", "rejeitado", "cancelado"].includes(r.status)) {
        if (new Date(r.previsao_entrega) < now) {
          overdueBySupplier.set(r.fornecedor_nome, (overdueBySupplier.get(r.fornecedor_nome) || 0) + 1);
        }
      }
    });
    const supplierTrendList = Array.from(overdueBySupplier.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    if (supplierTrendList.length > 0) {
      insightList.push({
        text: `${supplierTrendList.length} fornecedor(es) com atrasos recorrentes`,
        type: "negative",
      });
    }

    // Pending bottleneck
    const pendingCount = requisicoes.filter((r) => r.status === "pendente").length;
    if (pendingCount > 10) {
      insightList.push({
        text: `${pendingCount} pendências podem virar gargalo de aprovação`,
        type: "negative",
      });
    }

    // Savings
    const withBoth = requisicoes.filter((r) => r.valor_orcado && r.valor && r.valor > 0 && r.valor_orcado > 0);
    const totalBudget = withBoth.reduce((s, r) => s + (r.valor_orcado || 0), 0);
    const totalActual = withBoth.reduce((s, r) => s + (r.valor || 0), 0);
    const savingsPct = totalBudget > 0 ? ((totalBudget - totalActual) / totalBudget) * 100 : 0;
    if (savingsPct > 5) {
      insightList.push({
        text: `Economia consistente: ${savingsPct.toFixed(1)}% abaixo do orçado`,
        type: "positive",
      });
    }

    // Risk score 0-100
    const overdueRatio =
      requisicoes.length > 0
        ? requisicoes.filter((r) => {
            if (!r.previsao_entrega || ["recebido", "rejeitado", "cancelado"].includes(r.status)) return false;
            return new Date(r.previsao_entrega) < now;
          }).length / requisicoes.length
        : 0;
    const pendingRatio = requisicoes.length > 0 ? pendingCount / requisicoes.length : 0;
    const supplierRisk = Math.min(supplierTrendList.length / 3, 1);
    const spendRisk = slope > 0 ? Math.min(slope / (mean || 1), 1) : 0;

    const score = Math.round(
      overdueRatio * 40 + pendingRatio * 20 + supplierRisk * 25 + spendRisk * 15,
    );

    const breakdown = [
      { label: "Atrasos", value: Math.round(overdueRatio * 100), weight: 40 },
      { label: "Pendências", value: Math.round(pendingRatio * 100), weight: 20 },
      { label: "Fornecedores", value: Math.round(supplierRisk * 100), weight: 25 },
      { label: "Gastos", value: Math.round(spendRisk * 100), weight: 15 },
    ];

    return {
      forecast: forecastData,
      anomalies: anomalyList,
      insights: insightList,
      riskScore: score,
      riskBreakdown: breakdown,
      supplierTrend: supplierTrendList,
    };
  }, [requisicoes]);

  const riskLevel = riskScore >= 60 ? "high" : riskScore >= 30 ? "medium" : "low";
  const riskCfg = {
    high: { text: "Risco elevado", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" },
    medium: { text: "Risco moderado", color: "text-amber-700", bg: "bg-amber-50", bar: "bg-amber-500" },
    low: { text: "Risco baixo", color: "text-emerald-700", bg: "bg-emerald-50", bar: "bg-emerald-500" },
  }[riskLevel];

  return (
    <div className="space-y-6">
      {/* Header com pulso "IA analisando" */}
      <div className="card-elevated-static p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(220_85%_60%/0.06),transparent_70%)] pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 text-[15px]">Inteligência Preditiva</h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  IA · Análise ativa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Previsão de gastos · Risco operacional · Detecção de anomalias
              </p>
            </div>
          </div>

          {/* Risk score */}
          <div className={`flex items-center gap-4 ${riskCfg.bg} rounded-xl px-5 py-3`}>
            <div>
              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-500">
                Score de Risco
              </div>
              <div className={`text-3xl font-semibold num-tabular leading-none mt-1 ${riskCfg.color}`}>
                {riskScore}
                <span className="text-sm text-slate-400 ml-1">/100</span>
              </div>
              <div className={`text-xs font-medium mt-1 ${riskCfg.color}`}>{riskCfg.text}</div>
            </div>
            <div className="h-14 w-px bg-slate-200" />
            <div className="space-y-1.5 min-w-[140px]">
              {riskBreakdown.map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-[11px]">
                  <span className="w-16 text-slate-500">{b.label}</span>
                  <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${riskCfg.bar}`} style={{ width: `${Math.min(b.value, 100)}%` }} />
                  </div>
                  <span className="w-8 text-right font-semibold text-slate-700 num-tabular">{b.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast */}
        <div className="lg:col-span-2 card-elevated-static p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h5 className="text-sm font-semibold text-slate-900">Previsão de Gastos</h5>
              <p className="text-xs text-slate-500 mt-0.5">Realizado · Projeção próximos 3 meses</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-success" /> Realizado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-blue-500 opacity-60" /> Previsão IA
              </span>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 5, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--text-tertiary))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--text-tertiary))" }} tickFormatter={(v) => formatCurrency(v)} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number, name: string) => [formatCurrency(v), name === "forecast" ? "Previsão" : "Realizado"]}
                  contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="spend" fill="hsl(156,100%,26%)" fillOpacity={0.12} stroke="hsl(156,100%,26%)" strokeWidth={2} />
                <Area type="monotone" dataKey="forecast" fill="hsl(220,85%,55%)" fillOpacity={0.08} stroke="hsl(220,85%,55%)" strokeWidth={2} strokeDasharray="5 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="card-elevated-static p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-700" />
            <h5 className="text-sm font-semibold text-slate-900">Insights da IA</h5>
          </div>

          {insights.length === 0 && (
            <p className="text-xs text-slate-400">Sem sinais relevantes no momento.</p>
          )}

          <div className="space-y-2">
            {insights.map((insight, idx) => {
              const isPos = insight.type === "positive";
              const isNeg = insight.type === "negative";
              const Icon = isPos ? TrendingUp : isNeg ? AlertTriangle : Activity;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 p-3 rounded-lg text-[12px] border ${
                    isPos
                      ? "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                      : isNeg
                        ? "bg-red-50/50 border-red-100 text-red-900"
                        : "bg-blue-50/50 border-blue-100 text-blue-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
                  <span className="leading-snug">{insight.text}</span>
                </div>
              );
            })}
          </div>

          {supplierTrend.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[10px] uppercase font-semibold tracking-[0.1em] text-slate-400 mb-2">
                Fornecedores em risco
              </div>
              <div className="space-y-1.5">
                {supplierTrend.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 truncate pr-2">{s.name}</span>
                    <span className="font-semibold text-red-600 num-tabular">{s.count} atrasos</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {anomalies.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <div className="text-[10px] uppercase font-semibold tracking-[0.1em] text-slate-400 mb-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Anomalias detectadas
              </div>
              <div className="space-y-1">
                {anomalies.map((a, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{a.month}</span>
                    <span className={`font-semibold num-tabular ${a.deviation > 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {a.deviation > 0 ? "+" : ""}{a.deviation.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
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
