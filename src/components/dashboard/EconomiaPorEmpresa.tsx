import { useMemo } from 'react';
import { Requisicao, EMPRESAS } from '@/types';
import { PiggyBank, TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';

interface EconomiaPorEmpresaProps {
  requisicoes: Requisicao[];
  onDrillDown?: (empresa: string) => void;
}

export function EconomiaPorEmpresa({ requisicoes, onDrillDown }: EconomiaPorEmpresaProps) {
  const { data, totals, hasData } = useMemo(() => {
    const reqComEconomia = requisicoes.filter(
      (r) => r.valor_orcado && r.valor_orcado > 0 && r.valor && r.valor > 0
    );

    if (reqComEconomia.length === 0) {
      return { data: [], totals: { orcado: 0, negociado: 0, economia: 0, percent: 0 }, hasData: false };
    }

    const grouped = reqComEconomia.reduce((acc, req) => {
      const empresa = req.solicitante_empresa || 'Não informado';
      if (!acc[empresa]) {
        acc[empresa] = { orcado: 0, negociado: 0, count: 0 };
      }
      acc[empresa].orcado += req.valor_orcado || 0;
      acc[empresa].negociado += req.valor || 0;
      acc[empresa].count++;
      return acc;
    }, {} as Record<string, { orcado: number; negociado: number; count: number }>);

    const chartData = EMPRESAS.map((empresa) => {
      const valores = grouped[empresa] || { orcado: 0, negociado: 0, count: 0 };
      const economia = valores.orcado - valores.negociado;
      return {
        empresa,
        empresaShort: empresa.replace('GMAD ', ''),
        orcado: valores.orcado,
        negociado: valores.negociado,
        economia,
        percentual: valores.orcado > 0 ? (economia / valores.orcado) * 100 : 0,
        count: valores.count,
      };
    }).filter((d) => d.orcado > 0 || d.negociado > 0);

    const totalOrcado = reqComEconomia.reduce((sum, r) => sum + (r.valor_orcado || 0), 0);
    const totalNegociado = reqComEconomia.reduce((sum, r) => sum + (r.valor || 0), 0);

    return {
      data: chartData,
      totals: {
        orcado: totalOrcado,
        negociado: totalNegociado,
        economia: totalOrcado - totalNegociado,
        percent: totalOrcado > 0 ? ((totalOrcado - totalNegociado) / totalOrcado) * 100 : 0,
      },
      hasData: true,
    };
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value.toFixed(0)}`;
  };

  const formatTooltipCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!hasData) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold">Economia por Empresa</h4>
            <p className="text-sm text-muted-foreground">Comparativo orçado vs negociado</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          <div className="text-center">
            <PiggyBank className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nenhuma requisição com valores comparativos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold">Economia por Empresa</h4>
            <p className="text-sm text-muted-foreground">
              Comparativo orçado vs negociado
            </p>
          </div>
        </div>

        {/* Total Economy Badge */}
        <div className={`px-4 py-2 rounded-xl ${totals.economia >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2">
            {totals.economia >= 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-lg font-bold ${totals.economia >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {formatCurrency(Math.abs(totals.economia))}
            </span>
            <span className={`text-sm ${totals.economia >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ({totals.percent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
            <XAxis
              dataKey="empresaShort"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={55}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatTooltipCurrency(value),
                name === 'orcado' ? 'Orçado' : 'Negociado',
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '12px 16px',
              }}
            />
            <Legend 
              formatter={(value) => (value === 'orcado' ? 'Orçado' : 'Negociado')}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="orcado" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="negociado" radius={[4, 4, 0, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.economia >= 0 ? 'hsl(142, 71%, 45%)' : 'hsl(0, 84%, 60%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Details by company */}
      <div className="grid grid-cols-2 gap-2">
        {data.map((d) => (
          <Button
            key={d.empresa}
            variant="ghost"
            size="sm"
            className="justify-start h-auto py-2 px-3 hover:bg-muted"
            onClick={() => onDrillDown?.(d.empresa)}
          >
            <div className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${d.economia >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{d.empresaShort}</p>
              <p className={`text-xs ${d.economia >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {d.economia >= 0 ? '+' : ''}{formatCurrency(d.economia)} ({d.percentual.toFixed(1)}%)
              </p>
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          </Button>
        ))}
      </div>
    </div>
  );
}
