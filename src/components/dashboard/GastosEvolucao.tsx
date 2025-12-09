import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Requisicao } from '@/types';

interface GastosEvolucaoProps {
  requisicoes: Requisicao[];
}

export function GastosEvolucao({ requisicoes }: GastosEvolucaoProps) {
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
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <p className="text-sm text-muted-foreground text-center py-12">
          Sem dados de evolução no período
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-medium">Evolução no Período</h4>
          <p className="text-2xl font-semibold mt-1">{formatCurrency(total)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Período</p>
          <p className="text-sm font-medium">
            {data.length > 0 ? `${data[0].mesLabel} - ${data[data.length - 1].mesLabel}` : '-'}
          </p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
              dx={-10}
              width={50}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Valor']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
            <Area
              type="monotone"
              dataKey="valor"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#colorValor)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: 'hsl(var(--primary))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
