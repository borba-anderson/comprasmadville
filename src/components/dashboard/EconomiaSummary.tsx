import { PiggyBank, TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';
import { Requisicao } from '@/types';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import {
  aggregateEconomia,
  hasCompleteFinancialData,
  METRIC_TOOLTIPS,
} from '@/lib/procurementMetrics';
import { MetricTooltip } from './MetricTooltip';

interface EconomiaSummaryProps {
  requisicoes: Requisicao[];
}

export function EconomiaSummary({ requisicoes }: EconomiaSummaryProps) {
  // Fonte única: filtragem por dados financeiros completos (orçado + pago em compras efetivadas)
  const reqComEconomia = requisicoes.filter(hasCompleteFinancialData);
  const registrosIncompletos = requisicoes.length - reqComEconomia.length;

  if (reqComEconomia.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold">Economia Gerada</h3>
            <p className="text-sm text-muted-foreground">Comparativo orçado vs pago</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <PiggyBank className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Nenhuma compra com Valor Orçado e Valor Pago registrados</p>
          <p className="text-xs mt-1">
            {registrosIncompletos > 0
              ? `${registrosIncompletos} requisição(ões) sem dados financeiros completos`
              : 'Registre os valores para visualizar a economia'}
          </p>
        </div>
      </Card>
    );
  }

  // Cálculos oficiais (fonte: procurementMetrics.aggregateEconomia)
  const agg = aggregateEconomia(reqComEconomia);
  const totalOrcado = agg.totalOrcado;
  const totalNegociado = agg.totalPago;
  const economiaTotal = agg.economiaTotal;
  const economiaPercentual = agg.percentualEconomia;
  const comEconomia = agg.comEconomia;
  const comAcrescimo = agg.comAcrescimo;

  // Prepare data for chart by sector
  const economiaBySetor = reqComEconomia.reduce((acc, r) => {
    const setor = r.solicitante_setor;
    if (!acc[setor]) {
      acc[setor] = { orcado: 0, negociado: 0 };
    }
    acc[setor].orcado += r.valor_orcado || 0;
    acc[setor].negociado += r.valor || 0;
    return acc;
  }, {} as Record<string, { orcado: number; negociado: number }>);

  const chartData = Object.entries(economiaBySetor)
    .map(([setor, valores]) => ({
      setor: setor.length > 12 ? setor.substring(0, 12) + '...' : setor,
      setorFull: setor,
      orcado: valores.orcado,
      negociado: valores.negociado,
      economia: valores.orcado - valores.negociado,
      percentual: valores.orcado > 0 ? ((valores.orcado - valores.negociado) / valores.orcado) * 100 : 0,
    }))
    .sort((a, b) => b.economia - a.economia)
    .slice(0, 6);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1).replace('.', ',')}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const chartConfig = {
    orcado: { label: 'Orçado', color: 'hsl(var(--muted-foreground))' },
    negociado: { label: 'Negociado', color: 'hsl(var(--primary))' },
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
          <PiggyBank className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Economia Gerada pelo Setor de Compras</h3>
            <MetricTooltip {...METRIC_TOOLTIPS.economia} />
          </div>
          <p className="text-sm text-muted-foreground">
            {reqComEconomia.length} {reqComEconomia.length === 1 ? 'compra analisada' : 'compras analisadas'}
            {registrosIncompletos > 0 && (
              <span className="ml-2 text-amber-600">
                • {registrosIncompletos} sem dados financeiros completos
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase mb-1">Total Orçado</p>
          <p className="text-lg font-bold">{formatCurrency(totalOrcado)}</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase mb-1">Total Negociado</p>
          <p className="text-lg font-bold">{formatCurrency(totalNegociado)}</p>
        </div>
        <div className={`rounded-xl p-4 ${economiaTotal >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <p className="text-xs text-muted-foreground uppercase mb-1">
            {economiaTotal >= 0 ? '💰 Economia Total' : '⚠️ Acréscimo Total'}
          </p>
          <p className={`text-lg font-bold ${economiaTotal >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {formatCurrency(Math.abs(economiaTotal))}
          </p>
        </div>
        <div className={`rounded-xl p-4 ${economiaPercentual >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <p className="text-xs text-muted-foreground uppercase mb-1">% Economia Média</p>
          <div className="flex items-center gap-2">
            {economiaPercentual >= 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-600" />
            )}
            <p className={`text-lg font-bold ${economiaPercentual >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {Math.abs(economiaPercentual).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span>{comEconomia} com economia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span>{comAcrescimo} com acréscimo</span>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Comparativo por Setor
        </p>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="setor" 
                width={90}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>
                        {name === 'orcado' ? 'Orçado: ' : 'Negociado: '}
                        {formatCurrency(Number(value))}
                      </span>
                    )}
                  />
                }
              />
              <Bar dataKey="orcado" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="negociado" radius={[0, 4, 4, 0]} barSize={12}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.economia >= 0 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
}
