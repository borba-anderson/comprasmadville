import { useMemo, useState } from 'react';
import { Requisicao } from '@/types';
import {
  Truck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SupplierPerformanceProps {
  requisicoes: Requisicao[];
}

interface SupplierMetrics {
  nome: string;
  totalReqs: number;
  totalSpend: number;
  onTimeCount: number;
  lateCount: number;
  deliveredCount: number;
  avgLeadTimeDays: number;
  priceVariation: number;
  score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dependencyPct: number;
}

export function SupplierPerformance({ requisicoes }: SupplierPerformanceProps) {
  const [expanded, setExpanded] = useState(false);

  const { suppliers, topRisks, avgScore } = useMemo(() => {
    const supplierMap = new Map<string, Requisicao[]>();

    requisicoes.forEach((r) => {
      if (r.fornecedor_nome && r.fornecedor_nome.trim()) {
        const key = r.fornecedor_nome.trim();
        if (!supplierMap.has(key)) supplierMap.set(key, []);
        supplierMap.get(key)!.push(r);
      }
    });

    const totalSpendAll = requisicoes.reduce((s, r) => s + (r.valor || 0), 0);
    const today = new Date();

    const metrics: SupplierMetrics[] = Array.from(supplierMap.entries()).map(([nome, reqs]) => {
      const totalSpend = reqs.reduce((s, r) => s + (r.valor || 0), 0);

      // OTIF: delivered on time
      const delivered = reqs.filter((r) => r.status === 'recebido' && r.recebido_em);
      const withForecast = delivered.filter((r) => r.previsao_entrega);
      const onTime = withForecast.filter((r) => {
        const prev = new Date(r.previsao_entrega!);
        const recv = new Date(r.recebido_em!);
        return recv <= prev;
      });

      // Late (active, past forecast)
      const lateActive = reqs.filter((r) => {
        if (!r.previsao_entrega || ['recebido', 'rejeitado', 'cancelado'].includes(r.status)) return false;
        return new Date(r.previsao_entrega) < today;
      });

      // Avg lead time (created to recebido)
      const leadTimes = delivered.map((r) => {
        const start = new Date(r.created_at);
        const end = new Date(r.recebido_em!);
        return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      });
      const avgLead = leadTimes.length > 0 ? leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length : 0;

      // Price variation (std dev of values / mean)
      const values = reqs.filter((r) => r.valor && r.valor > 0).map((r) => r.valor!);
      const mean = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      const variance = values.length > 1
        ? values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
        : 0;
      const stdDev = Math.sqrt(variance);
      const priceVar = mean > 0 ? (stdDev / mean) * 100 : 0;

      // Dependency
      const dep = totalSpendAll > 0 ? (totalSpend / totalSpendAll) * 100 : 0;

      // Score (0-100)
      const otifRate = withForecast.length > 0 ? (onTime.length / withForecast.length) * 100 : 50;
      const lateRate = reqs.length > 0 ? (lateActive.length / reqs.length) * 100 : 0;
      const score = Math.round(
        Math.max(0, Math.min(100,
          otifRate * 0.4 +
          Math.max(0, 100 - avgLead * 3) * 0.2 +
          Math.max(0, 100 - priceVar * 2) * 0.2 +
          Math.max(0, 100 - lateRate * 3) * 0.2
        ))
      );

      const riskLevel: SupplierMetrics['riskLevel'] =
        score >= 75 ? 'low' : score >= 50 ? 'medium' : score >= 30 ? 'high' : 'critical';

      return {
        nome,
        totalReqs: reqs.length,
        totalSpend: totalSpend,
        onTimeCount: onTime.length,
        lateCount: lateActive.length,
        deliveredCount: delivered.length,
        avgLeadTimeDays: avgLead,
        priceVariation: priceVar,
        score,
        riskLevel,
        dependencyPct: dep,
      };
    });

    metrics.sort((a, b) => b.totalSpend - a.totalSpend);

    const risks = metrics.filter((m) => m.riskLevel === 'high' || m.riskLevel === 'critical');
    const avg = metrics.length > 0 ? Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length) : 0;

    return { suppliers: metrics, topRisks: risks, avgScore: avg };
  }, [requisicoes]);

  const displaySuppliers = expanded ? suppliers : suppliers.slice(0, 5);

  const riskColors = {
    low: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Baixo' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Médio' },
    high: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Alto' },
    critical: { bg: 'bg-red-50', text: 'text-red-700', label: 'Crítico' },
  };

  const formatCurrency = (v: number) => {
    if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
    return `R$ ${v.toFixed(0)}`;
  };

  const scoreColor = (s: number) =>
    s >= 75 ? 'text-emerald-600' : s >= 50 ? 'text-amber-600' : 'text-red-600';

  if (suppliers.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold">Supplier Performance & Risk</h4>
            <p className="text-sm text-muted-foreground">Nenhum fornecedor atribuído ainda</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold">Supplier Performance & Risk</h4>
            <p className="text-sm text-muted-foreground">
              {suppliers.length} fornecedores • Score médio: <span className={scoreColor(avgScore)}>{avgScore}</span>
            </p>
          </div>
        </div>

        {topRisks.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">{topRisks.length} em risco</span>
          </div>
        )}
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold">{suppliers.length}</p>
          <p className="text-[10px] uppercase font-medium text-muted-foreground">Fornecedores</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className={`text-lg font-bold ${scoreColor(avgScore)}`}>{avgScore}</p>
          <p className="text-[10px] uppercase font-medium text-muted-foreground">Score Médio</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold text-red-600">{topRisks.length}</p>
          <p className="text-[10px] uppercase font-medium text-muted-foreground">Em Risco</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-lg font-bold">
            {suppliers.length > 0 ? `${(suppliers[0].dependencyPct).toFixed(0)}%` : '—'}
          </p>
          <p className="text-[10px] uppercase font-medium text-muted-foreground">Maior Dep.</p>
        </div>
      </div>

      {/* Supplier ranking table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">#</th>
              <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Fornecedor</th>
              <th className="text-center px-3 py-2 text-xs font-medium text-muted-foreground">Score</th>
              <th className="text-center px-3 py-2 text-xs font-medium text-muted-foreground">OTIF</th>
              <th className="text-center px-3 py-2 text-xs font-medium text-muted-foreground">Lead Time</th>
              <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">Spend</th>
              <th className="text-center px-3 py-2 text-xs font-medium text-muted-foreground">Risco</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {displaySuppliers.map((s, idx) => {
              const otifRate = s.deliveredCount > 0
                ? ((s.onTimeCount / s.deliveredCount) * 100).toFixed(0)
                : '—';
              const risk = riskColors[s.riskLevel];

              return (
                <tr key={s.nome} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2.5 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-sm truncate max-w-[200px]">{s.nome}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {s.totalReqs} req • {s.dependencyPct.toFixed(0)}% dep
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${scoreColor(s.score)}`}>{s.score}</span>
                      <Progress value={s.score} className="h-1 w-12" />
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-sm font-medium">
                      {otifRate !== '—' ? `${otifRate}%` : '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{s.avgLeadTimeDays.toFixed(1)}d</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-sm">
                    {formatCurrency(s.totalSpend)}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${risk.bg} ${risk.text}`}>
                      {risk.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {suppliers.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mx-auto mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" /> Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" /> Ver todos ({suppliers.length})
            </>
          )}
        </button>
      )}
    </div>
  );
}
