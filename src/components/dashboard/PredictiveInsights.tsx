import { useMemo, useState } from "react";
import { Requisicao } from "@/types";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Sparkles,
  ArrowUpRight,
  Target,
  Gauge,
  CalendarClock,
} from "lucide-react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import {
  runForecast,
  aggregateEconomia,
  ForecastHorizon,
  METRIC_TOOLTIPS,
} from "@/lib/procurementMetrics";
import { MetricTooltip } from "./MetricTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PredictiveInsightsProps {
  requisicoes: Requisicao[];
}

type ForecastPoint = {
  month: string;
  fullLabel: string;
  actual: number | null;
  projected: number | null;
  forecast: number | null;
  bandLow: number | null;
  bandHigh: number | null;
  isCurrent: boolean;
  isFuture: boolean;
};

export function PredictiveInsights({ requisicoes }: PredictiveInsightsProps) {
  const [horizon, setHorizon] = useState<ForecastHorizon>(12);

  const {
    forecast,
    anomalies,
    insights,
    riskScore,
    riskBreakdown,
    supplierTrend,
    nextMonthValue,
    monthOverMonth,
    confidence,
    currentMonthProjection,
    currentMonthActual,
    monthProgressPct,
    methodologyLabel,
    trendPerMonth,
  } = useMemo(() => {
    const now = new Date();

    // ============================================================
    // MODELO PREDITIVO — ver src/lib/procurementMetrics.ts
    // Combina: Média Móvel Ponderada + Regressão Linear (OLS) +
    // Sazonalidade (quando horizonte ≥ 12m).
    // ============================================================
    const model = runForecast(requisicoes, horizon, 3);

    const forecastData: ForecastPoint[] = model.series.map((p) => ({
      month: p.date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      fullLabel: p.date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      actual: p.realized,
      projected: p.currentProjection,
      forecast: p.forecast,
      bandLow: p.lowerBand,
      bandHigh: p.upperBand,
      isCurrent: p.isCurrent,
      isFuture: p.isFuture,
    }));

    // Conecta a linha realizada→projeção→previsão (evita "quebra" visual)
    const currentIdx = forecastData.findIndex((f) => f.isCurrent);
    if (currentIdx > 0) {
      forecastData[currentIdx - 1].projected = forecastData[currentIdx - 1].actual;
    }
    if (currentIdx >= 0) {
      forecastData[currentIdx].forecast = forecastData[currentIdx].projected;
    }

    // ---------- Anomalias (Z-score > 1.5 no histórico fechado) ----------
    const closed = model.history.slice(0, -1);
    const mean = closed.reduce((s, p) => s + p.spend, 0) / Math.max(1, closed.length);
    const variance =
      closed.reduce((s, p) => s + (p.spend - mean) ** 2, 0) / Math.max(1, closed.length);
    const stdDev = Math.sqrt(variance);
    const anomalyList = closed
      .filter((p) => stdDev > 0 && Math.abs(p.spend - mean) > stdDev * 1.5 && p.spend > 0)
      .map((p) => ({
        month: p.date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
        spend: p.spend,
        deviation: mean > 0 ? ((p.spend - mean) / mean) * 100 : 0,
      }));

    // ---------- Insights ----------
    const insightList: { text: string; type: "positive" | "negative" | "neutral" }[] = [];
    if (model.trendPerMonth > 0) {
      insightList.push({
        text: `Tendência de alta: +${formatCurrency(Math.abs(model.trendPerMonth))}/mês`,
        type: "negative",
      });
    } else if (model.trendPerMonth < 0) {
      insightList.push({
        text: `Tendência de queda: ${formatCurrency(Math.abs(model.trendPerMonth))}/mês economizados`,
        type: "positive",
      });
    }

    // Supplier risk
    const overdueBySupplier = new Map<string, number>();
    requisicoes.forEach((r) => {
      if (
        r.fornecedor_nome &&
        r.previsao_entrega &&
        !["recebido", "rejeitado", "cancelado"].includes(r.status)
      ) {
        if (new Date(r.previsao_entrega) < now) {
          overdueBySupplier.set(
            r.fornecedor_nome,
            (overdueBySupplier.get(r.fornecedor_nome) || 0) + 1,
          );
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

    const pendingCount = requisicoes.filter((r) => r.status === "pendente").length;
    if (pendingCount > 10) {
      insightList.push({
        text: `${pendingCount} pendências podem virar gargalo de aprovação`,
        type: "negative",
      });
    }

    // Economia via lib central (mesma base do card "Economia")
    const econ = aggregateEconomia(requisicoes);
    if (econ.percentualEconomia > 5) {
      insightList.push({
        text: `Economia consistente: ${econ.percentualEconomia.toFixed(1)}% abaixo do orçado`,
        type: "positive",
      });
    }

    // ---------- Risk score ----------
    const overdueRatio =
      requisicoes.length > 0
        ? requisicoes.filter((r) => {
            if (!r.previsao_entrega || ["recebido", "rejeitado", "cancelado"].includes(r.status))
              return false;
            return new Date(r.previsao_entrega) < now;
          }).length / requisicoes.length
        : 0;
    const pendingRatio = requisicoes.length > 0 ? pendingCount / requisicoes.length : 0;
    const supplierRisk = Math.min(supplierTrendList.length / 3, 1);
    const spendRisk = model.trendPerMonth > 0 ? Math.min(model.trendPerMonth / (mean || 1), 1) : 0;

    const score = Math.round(
      overdueRatio * 40 + pendingRatio * 20 + supplierRisk * 25 + spendRisk * 15,
    );

    const breakdown = [
      { label: "Atrasos", value: Math.round(overdueRatio * 100), weight: 40 },
      { label: "Pendências", value: Math.round(pendingRatio * 100), weight: 20 },
      { label: "Fornecedores", value: Math.round(supplierRisk * 100), weight: 25 },
      { label: "Gastos", value: Math.round(spendRisk * 100), weight: 15 },
    ];

    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthProgress = now.getDate() / daysInCurrentMonth;

    return {
      forecast: forecastData,
      anomalies: anomalyList,
      insights: insightList,
      riskScore: score,
      riskBreakdown: breakdown,
      supplierTrend: supplierTrendList,
      nextMonthValue: Math.round(model.nextMonthForecast),
      monthOverMonth: model.momVariation,
      confidence: model.confidence,
      currentMonthProjection: Math.round(model.currentMonthProjection),
      currentMonthActual: Math.round(model.currentMonthRealized),
      monthProgressPct: Math.round(monthProgress * 100),
      methodologyLabel: model.methodologyLabel,
      trendPerMonth: model.trendPerMonth,
    };
  }, [requisicoes, horizon]);


export function PredictiveInsights({ requisicoes }: PredictiveInsightsProps) {
  const {
    forecast,
    anomalies,
    insights,
    riskScore,
    riskBreakdown,
    supplierTrend,
    nextMonthValue,
    monthOverMonth,
    confidence,
    currentMonthProjection,
    currentMonthActual,
    monthProgressPct,
  } = useMemo(() => {
    const now = new Date();

    // ---------- Monthly spend (últimos 6 meses, incluindo o vigente) ----------
    const monthlySpend: { month: string; fullLabel: string; spend: number; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthReqs = requisicoes.filter((r) => {
        const created = new Date(r.created_at);
        return created >= d && created < nextMonth;
      });
      monthlySpend.push({
        month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
        fullLabel: d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        spend: monthReqs.reduce((s, r) => s + (r.valor || 0), 0),
        count: monthReqs.length,
      });
    }

    // ---------- Regressão linear (para tendência) ----------
    const n = monthlySpend.length;
    const xSum = monthlySpend.reduce((s, _, i) => s + i, 0);
    const ySum = monthlySpend.reduce((s, d) => s + d.spend, 0);
    const xySum = monthlySpend.reduce((s, d, i) => s + i * d.spend, 0);
    const x2Sum = monthlySpend.reduce((s, _, i) => s + i * i, 0);
    const slope = n > 1 ? (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum) : 0;
    const intercept = n > 0 ? (ySum - slope * xSum) / n : 0;

    // Coeficiente de determinação (R²) — confiança do modelo
    const meanY = n > 0 ? ySum / n : 0;
    const ssTot = monthlySpend.reduce((s, d) => s + Math.pow(d.spend - meanY, 2), 0);
    const ssRes = monthlySpend.reduce(
      (s, d, i) => s + Math.pow(d.spend - (intercept + slope * i), 2),
      0,
    );
    const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
    const confidencePct = Math.round(r2 * 100);

    // ---------- Progresso do mês vigente ----------
    const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    const monthProgress = Math.min(1, Math.max(0.05, dayOfMonth / daysInCurrentMonth));
    const currentActual = monthlySpend[n - 1]?.spend ?? 0;
    const trendPredicted = Math.max(0, intercept + slope * (n - 1));
    // Projeção do mês vigente = 60% extrapolação linear × 40% tendência
    const currentProjected = Math.round(
      (currentActual / monthProgress) * 0.6 + trendPredicted * 0.4,
    );

    // ---------- Desvio padrão para banda de confiança ----------
    const residualStd = Math.sqrt(ssRes / Math.max(1, n - 1));

    // ---------- Série do gráfico (realizado + projeção + previsão + banda) ----------
    const forecastData: ForecastPoint[] = monthlySpend.map((d, i) => {
      const isCurrent = i === n - 1;
      return {
        month: d.month,
        fullLabel: d.fullLabel,
        actual: isCurrent ? null : d.spend,
        projected: isCurrent ? currentProjected : null,
        forecast: null,
        bandLow: null,
        bandHigh: null,
        isCurrent,
        isFuture: false,
      };
    });
    // conecta a linha realizada até o mês vigente
    if (n >= 2) forecastData[n - 2].projected = monthlySpend[n - 2].spend;

    // Próximos 3 meses (previsão pura + banda)
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const predicted = Math.max(0, intercept + slope * (n - 1 + i));
      const spread = residualStd * (1 + i * 0.25);
      forecastData.push({
        month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
        fullLabel: d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
        actual: null,
        projected: null,
        forecast: Math.round(predicted),
        bandLow: Math.max(0, Math.round(predicted - spread)),
        bandHigh: Math.round(predicted + spread),
        isCurrent: false,
        isFuture: true,
      });
    }
    // conecta linha de previsão ao ponto projetado do mês vigente
    forecastData[n - 1].forecast = currentProjected;

    const nextMonth = Math.max(0, intercept + slope * n);
    const prevMonthSpend = monthlySpend[n - 2]?.spend ?? 0;
    const momPct =
      prevMonthSpend > 0
        ? ((currentProjected - prevMonthSpend) / prevMonthSpend) * 100
        : 0;

    // ---------- Anomalias ----------
    const stdDev = Math.sqrt(ssTot / Math.max(1, n));
    const anomalyList = monthlySpend
      .slice(0, n - 1) // ignora mês vigente incompleto
      .filter((d) => Math.abs(d.spend - meanY) > stdDev * 1.5 && d.spend > 0)
      .map((d) => ({
        month: d.month,
        spend: d.spend,
        deviation: ((d.spend - meanY) / meanY) * 100,
      }));

    // ---------- Insights ----------
    const insightList: { text: string; type: "positive" | "negative" | "neutral" }[] = [];
    if (slope > 0) {
      insightList.push({
        text: `Tendência de alta: +${formatCurrency(Math.abs(slope))}/mês`,
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
      if (
        r.fornecedor_nome &&
        r.previsao_entrega &&
        !["recebido", "rejeitado", "cancelado"].includes(r.status)
      ) {
        if (new Date(r.previsao_entrega) < now) {
          overdueBySupplier.set(
            r.fornecedor_nome,
            (overdueBySupplier.get(r.fornecedor_nome) || 0) + 1,
          );
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

    const pendingCount = requisicoes.filter((r) => r.status === "pendente").length;
    if (pendingCount > 10) {
      insightList.push({
        text: `${pendingCount} pendências podem virar gargalo de aprovação`,
        type: "negative",
      });
    }

    const withBoth = requisicoes.filter(
      (r) => r.valor_orcado && r.valor && r.valor > 0 && r.valor_orcado > 0,
    );
    const totalBudget = withBoth.reduce((s, r) => s + (r.valor_orcado || 0), 0);
    const totalActual = withBoth.reduce((s, r) => s + (r.valor || 0), 0);
    const savingsPct = totalBudget > 0 ? ((totalBudget - totalActual) / totalBudget) * 100 : 0;
    if (savingsPct > 5) {
      insightList.push({
        text: `Economia consistente: ${savingsPct.toFixed(1)}% abaixo do orçado`,
        type: "positive",
      });
    }

    // ---------- Risk score ----------
    const overdueRatio =
      requisicoes.length > 0
        ? requisicoes.filter((r) => {
            if (!r.previsao_entrega || ["recebido", "rejeitado", "cancelado"].includes(r.status))
              return false;
            return new Date(r.previsao_entrega) < now;
          }).length / requisicoes.length
        : 0;
    const pendingRatio = requisicoes.length > 0 ? pendingCount / requisicoes.length : 0;
    const supplierRisk = Math.min(supplierTrendList.length / 3, 1);
    const spendRisk = slope > 0 ? Math.min(slope / (meanY || 1), 1) : 0;

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
      nextMonthValue: Math.round(nextMonth),
      monthOverMonth: momPct,
      confidence: confidencePct,
      currentMonthProjection: currentProjected,
      currentMonthActual: currentActual,
      monthProgressPct: Math.round(monthProgress * 100),
    };
  }, [requisicoes]);

  const riskLevel = riskScore >= 60 ? "high" : riskScore >= 30 ? "medium" : "low";
  const riskCfg = {
    high: {
      text: "Risco elevado",
      color: "text-red-600",
      bg: "bg-red-50",
      bar: "bg-red-500",
      ring: "ring-red-200",
    },
    medium: {
      text: "Risco moderado",
      color: "text-amber-700",
      bg: "bg-amber-50",
      bar: "bg-amber-500",
      ring: "ring-amber-200",
    },
    low: {
      text: "Risco baixo",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      bar: "bg-emerald-500",
      ring: "ring-emerald-200",
    },
  }[riskLevel];

  const currentMonthLabel = forecast.find((f) => f.isCurrent)?.month ?? "";

  return (
    <div className="space-y-6">
      {/* ============ HEADER ============ */}
      <div className="card-elevated-static p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(220_85%_60%/0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(156_100%_26%/0.05),transparent_60%)] pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 text-[15px]">Inteligência Preditiva</h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  IA · Modelo ativo
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  <Gauge className="w-3 h-3" />
                  Confiança {confidence}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Regressão linear · Banda de confiança · Detecção de anomalias · 6M histórico
              </p>
            </div>
          </div>

          {/* Risk score */}
          <div className={`flex items-center gap-4 ${riskCfg.bg} rounded-xl px-5 py-3 ring-1 ${riskCfg.ring}`}>
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

      {/* ============ KPI CHIPS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <PredictiveKPI
          icon={CalendarClock}
          label="Mês vigente · projeção"
          value={formatCurrency(currentMonthProjection)}
          hint={`Realizado ${formatCurrency(currentMonthActual)} · ${monthProgressPct}% do mês`}
          accent="slate"
        />
        <PredictiveKPI
          icon={Target}
          label="Próximo mês · previsão"
          value={formatCurrency(nextMonthValue)}
          hint={`Modelo IA · confiança ${confidence}%`}
          accent="blue"
        />
        <PredictiveKPI
          icon={monthOverMonth >= 0 ? TrendingUp : TrendingDown}
          label="Variação vs. mês anterior"
          value={`${monthOverMonth >= 0 ? "+" : ""}${monthOverMonth.toFixed(1)}%`}
          hint="Projetado vs. realizado do mês anterior"
          accent={monthOverMonth >= 0 ? "red" : "emerald"}
        />
        <PredictiveKPI
          icon={AlertTriangle}
          label="Anomalias detectadas"
          value={String(anomalies.length)}
          hint={anomalies.length === 0 ? "Nenhum outlier nos últimos 5 meses" : "Meses fora do padrão histórico"}
          accent={anomalies.length > 0 ? "amber" : "emerald"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============ FORECAST CHART ============ */}
        <div className="lg:col-span-2 card-elevated-static p-6">
          <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
            <div>
              <h5 className="text-sm font-semibold text-slate-900">Previsão de Gastos</h5>
              <p className="text-xs text-slate-500 mt-0.5">
                Realizado · Projeção do mês vigente · Previsão IA com banda de confiança
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[hsl(156,100%,26%)]" /> Realizado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" /> Projeção mês
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 opacity-60" /> Previsão IA
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-200" /> Banda ±σ
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecast} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(156,100%,26%)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="hsl(156,100%,26%)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(220,85%,55%)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="hsl(220,85%,55%)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "hsl(var(--text-tertiary))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--text-tertiary))" }}
                  tickFormatter={(v) => formatCurrency(v)}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />

                {/* Marca do mês vigente */}
                {currentMonthLabel && (
                  <ReferenceLine
                    x={currentMonthLabel}
                    stroke="hsl(220,85%,55%)"
                    strokeDasharray="4 3"
                    strokeOpacity={0.55}
                    label={{
                      value: "Hoje",
                      position: "top",
                      fill: "hsl(220,85%,55%)",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                )}

                {/* Banda de confiança (invisível → area entre bandLow e bandHigh) */}
                <Area
                  type="monotone"
                  dataKey="bandHigh"
                  stroke="none"
                  fill="url(#bandFill)"
                  connectNulls
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="bandLow"
                  stroke="none"
                  fill="hsl(var(--card))"
                  fillOpacity={1}
                  connectNulls
                  isAnimationActive={false}
                />

                {/* Realizado */}
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(156,100%,26%)"
                  strokeWidth={2.5}
                  fill="url(#actualFill)"
                  connectNulls
                  dot={{ r: 3, fill: "hsl(156,100%,26%)", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "hsl(156,100%,26%)", stroke: "white", strokeWidth: 2 }}
                />

                {/* Projeção do mês vigente (linha tracejada slate) */}
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="hsl(215,20%,55%)"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={{ r: 3.5, fill: "hsl(215,20%,55%)", strokeWidth: 0 }}
                  connectNulls
                />

                {/* Previsão IA */}
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(220,85%,55%)"
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                  dot={{ r: 3.5, fill: "hsl(220,85%,55%)", strokeWidth: 0 }}
                  connectNulls
                />

                <ReferenceDot
                  x={currentMonthLabel}
                  y={currentMonthProjection}
                  r={5}
                  fill="hsl(215,20%,55%)"
                  stroke="white"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ============ INSIGHTS ============ */}
        <div className="card-elevated-static p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <h5 className="text-sm font-semibold text-slate-900">Insights da IA</h5>
            </div>
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-400">
              {insights.length} sinais
            </span>
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
                  className={`flex items-start gap-2.5 p-3 rounded-lg text-[12px] border transition-all hover:shadow-sm ${
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
                    <span className="text-slate-500 capitalize">{a.month}</span>
                    <span
                      className={`font-semibold num-tabular ${
                        a.deviation > 0 ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {a.deviation > 0 ? "+" : ""}
                      {a.deviation.toFixed(0)}%
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

// ---------- KPI Chip ----------
function PredictiveKPI({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  accent: "slate" | "blue" | "emerald" | "red" | "amber";
}) {
  const cfg = {
    slate: { iconBg: "bg-slate-100", iconText: "text-slate-700", valueText: "text-slate-900" },
    blue: { iconBg: "bg-blue-50", iconText: "text-blue-600", valueText: "text-blue-700" },
    emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", valueText: "text-emerald-700" },
    red: { iconBg: "bg-red-50", iconText: "text-red-600", valueText: "text-red-600" },
    amber: { iconBg: "bg-amber-50", iconText: "text-amber-600", valueText: "text-amber-700" },
  }[accent];

  return (
    <div className="card-elevated-static p-4 flex items-start gap-3 transition-all hover:shadow-md">
      <div className={`w-9 h-9 rounded-lg ${cfg.iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 ${cfg.iconText}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-500 truncate">
          {label}
        </div>
        <div className={`text-lg font-semibold num-tabular mt-0.5 ${cfg.valueText} truncate`}>
          {value}
        </div>
        <div className="text-[10.5px] text-slate-500 mt-0.5 truncate">{hint}</div>
      </div>
    </div>
  );
}

// ---------- Tooltip ----------
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload as ForecastPoint;

  const rows = [
    data.actual != null && { label: "Realizado", value: data.actual, color: "hsl(156,100%,26%)" },
    data.projected != null &&
      data.isCurrent && { label: "Projeção do mês", value: data.projected, color: "hsl(215,20%,55%)" },
    data.forecast != null &&
      data.isFuture && { label: "Previsão IA", value: data.forecast, color: "hsl(220,85%,55%)" },
  ].filter(Boolean) as { label: string; value: number; color: string }[];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-3 min-w-[180px]">
      <div className="text-[11px] font-semibold text-slate-500 capitalize mb-2">
        {data.fullLabel}
        {data.isCurrent && (
          <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            EM CURSO
          </span>
        )}
        {data.isFuture && (
          <span className="ml-2 inline-flex items-center gap-1 text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
            PREVISÃO
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-sm" style={{ background: r.color }} />
              {r.label}
            </span>
            <span className="font-semibold text-slate-900 num-tabular">{formatCurrency(r.value)}</span>
          </div>
        ))}
        {data.isFuture && data.bandLow != null && data.bandHigh != null && (
          <div className="pt-1.5 mt-1.5 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
            <span className="text-slate-500">Intervalo ±σ</span>
            <span className="font-medium text-slate-600 num-tabular">
              {formatCurrency(data.bandLow)} – {formatCurrency(data.bandHigh)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatCurrency(v: number): string {
  if (Math.abs(v) >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
  return `R$ ${v.toFixed(0)}`;
}
