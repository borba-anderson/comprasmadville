import { useMemo } from 'react';
import { Requisicao } from '@/types';
import { BarChart3, AlertTriangle } from 'lucide-react';
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Line,
  ComposedChart,
} from 'recharts';

interface SpendIntelligenceProps {
  requisicoes: Requisicao[];
}

const PARETO_COLORS = ['hsl(156,100%,26%)', 'hsl(156,80%,35%)', 'hsl(156,60%,45%)', 'hsl(200,60%,50%)', 'hsl(210,50%,55%)', 'hsl(220,40%,60%)', 'hsl(230,30%,65%)', 'hsl(240,20%,70%)'];

export function SpendIntelligence({ requisicoes }: SpendIntelligenceProps) {
  const { paretoData, supplierConcentration, spotVsContract, savingsWaterfall } = useMemo(() => {
    // Pareto by Setor
    const sectorSpend = new Map<string, number>();
    requisicoes.forEach((r) => {
      if (r.valor && r.valor > 0) {
        const key = r.solicitante_setor || 'Outros';
        sectorSpend.set(key, (sectorSpend.get(key) || 0) + r.valor);
      }
    });

    const sorted = Array.from(sectorSpend.entries())
      .sort((a, b) => b[1] - a[1]);
    const totalSpend = sorted.reduce((s, [, v]) => s + v, 0);

    let cumulative = 0;
    const pareto = sorted.map(([name, value]) => {
      cumulative += value;
      return {
        name: name.length > 12 ? name.slice(0, 12) + '…' : name,
        value,
        cumPct: totalSpend > 0 ? (cumulative / totalSpend) * 100 : 0,
      };
    });

    // Supplier concentration
    const supplierSpend = new Map<string, number>();
    requisicoes.forEach((r) => {
      if (r.fornecedor_nome && r.valor && r.valor > 0) {
        const key = r.fornecedor_nome.trim();
        supplierSpend.set(key, (supplierSpend.get(key) || 0) + r.valor);
      }
    });
    const suppSorted = Array.from(supplierSpend.entries()).sort((a, b) => b[1] - a[1]);
    const top3Spend = suppSorted.slice(0, 3).reduce((s, [, v]) => s + v, 0);
    const concentration = totalSpend > 0 ? (top3Spend / totalSpend) * 100 : 0;

    // Spot vs Contract (heuristic: with fornecedor = "contract", without = "spot")
    const withSupplier = requisicoes.filter((r) => r.fornecedor_nome && r.valor && r.valor > 0);
    const withoutSupplier = requisicoes.filter((r) => !r.fornecedor_nome && r.valor && r.valor > 0);
    const spotTotal = withoutSupplier.reduce((s, r) => s + (r.valor || 0), 0);
    const contractTotal = withSupplier.reduce((s, r) => s + (r.valor || 0), 0);

    // Savings waterfall
    const withBoth = requisicoes.filter((r) => r.valor_orcado && r.valor_orcado > 0 && r.valor && r.valor > 0);
    const totalBudget = withBoth.reduce((s, r) => s + (r.valor_orcado || 0), 0);
    const totalActual = withBoth.reduce((s, r) => s + (r.valor || 0), 0);
    const savings = totalBudget - totalActual;

    const waterfall = [
      { name: 'Orçado', value: totalBudget, color: 'hsl(210,50%,55%)' },
      { name: 'Economia', value: savings > 0 ? -savings : 0, color: 'hsl(156,100%,26%)' },
      { name: 'Acréscimo', value: savings < 0 ? Math.abs(savings) : 0, color: 'hsl(0,70%,55%)' },
      { name: 'Real', value: totalActual, color: 'hsl(200,60%,50%)' },
    ].filter((d) => d.value !== 0);

    return {
      paretoData: pareto,
      supplierConcentration: concentration,
      spotVsContract: { spot: spotTotal, contract: contractTotal },
      savingsWaterfall: waterfall,
    };
  }, [requisicoes]);

  const formatCurrency = (v: number) => {
    if (Math.abs(v) >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
    if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
    return `R$ ${v.toFixed(0)}`;
  };

  const totalSpend = paretoData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Financial Spend Intelligence</h3>
          <p className="text-sm text-muted-foreground">Análise de concentração e Pareto</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto Chart */}
        <div className="bg-card rounded-xl border border-border/50 p-5">
          <h4 className="text-sm font-semibold mb-1">Spend por Categoria (Pareto)</h4>
          <p className="text-xs text-muted-foreground mb-4">80/20 analysis — concentração de gastos</p>
          {paretoData.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={paretoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'cumPct') return [`${value.toFixed(1)}%`, 'Acumulado'];
                      return [formatCurrency(value), 'Gasto'];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="value" radius={[4, 4, 0, 0]}>
                    {paretoData.map((_, i) => (
                      <Cell key={i} fill={PARETO_COLORS[i % PARETO_COLORS.length]} />
                    ))}
                  </Bar>
                  <Line yAxisId="right" dataKey="cumPct" type="monotone" stroke="hsl(0,70%,55%)" strokeWidth={2} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">Sem dados de gastos</p>
          )}
        </div>

        {/* Concentration & Insights */}
        <div className="space-y-4">
          {/* Supplier Concentration */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h4 className="text-sm font-semibold mb-3">Concentração de Fornecedores</h4>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Top 3 fornecedores</span>
                  <span className={supplierConcentration > 60 ? 'text-red-600 font-semibold' : ''}>
                    {supplierConcentration.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${supplierConcentration > 60 ? 'bg-red-500' : supplierConcentration > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${supplierConcentration}%` }}
                  />
                </div>
                {supplierConcentration > 60 && (
                  <div className="flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] text-red-600 font-medium">Alta concentração — risco de dependência</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spot vs Contract */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h4 className="text-sm font-semibold mb-3">Spot vs Gerenciado</h4>
            <div className="flex gap-4">
              <div className="flex-1 text-center p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-muted-foreground">Spot (sem fornecedor)</p>
                <p className="text-lg font-bold text-amber-700">{formatCurrency(spotVsContract.spot)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {totalSpend > 0 ? `${((spotVsContract.spot / totalSpend) * 100).toFixed(0)}%` : '0%'}
                </p>
              </div>
              <div className="flex-1 text-center p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-muted-foreground">Gerenciado</p>
                <p className="text-lg font-bold text-emerald-700">{formatCurrency(spotVsContract.contract)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {totalSpend > 0 ? `${((spotVsContract.contract / totalSpend) * 100).toFixed(0)}%` : '0%'}
                </p>
              </div>
            </div>
          </div>

          {/* Savings Waterfall Summary */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h4 className="text-sm font-semibold mb-3">Savings Waterfall</h4>
            <div className="flex gap-2">
              {savingsWaterfall.map((item) => (
                <div key={item.name} className="flex-1 text-center">
                  <div
                    className="mx-auto w-full h-16 rounded-lg flex items-end justify-center pb-1"
                    style={{ backgroundColor: item.color + '20' }}
                  >
                    <div
                      className="w-full rounded-lg"
                      style={{
                        backgroundColor: item.color,
                        height: `${Math.max(15, (Math.abs(item.value) / Math.max(...savingsWaterfall.map((s) => Math.abs(s.value)), 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] font-medium mt-1">{item.name}</p>
                  <p className="text-xs font-bold">{formatCurrency(Math.abs(item.value))}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
