import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Requisicao } from '@/types';
import { TrendingUp } from 'lucide-react';

interface GastosLineChartProps {
  requisicoes: Requisicao[];
}

export function GastosLineChart({ requisicoes }: GastosLineChartProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const date = new Date(req.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([mes, valor]) => {
        const [year, month] = mes.split('-');
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return {
          mes,
          mesLabel: `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`,
          valor,
        };
      })
      .sort((a, b) => a.mes.localeCompare(b.mes));
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  const total = data.reduce((acc, d) => acc + d.valor, 0);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Evolução Mensal</h4>
            <p className="text-sm text-muted-foreground">Gastos por mês</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Sem dados no período
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Evolução Mensal</h4>
            <p className="text-sm text-muted-foreground">Gastos por mês</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{formatCurrency(total)}</p>
          <p className="text-xs text-muted-foreground">Total no período</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis 
              dataKey="mesLabel" 
              fontSize={11} 
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={45}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Valor']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '12px 16px',
              }}
              labelStyle={{
                color: 'hsl(var(--muted-foreground))',
                fontSize: '12px',
                marginBottom: '4px',
              }}
              itemStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2.5}
              dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 0, r: 4 }}
              activeDot={{ 
                r: 6, 
                fill: 'hsl(217, 91%, 60%)',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
