import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Requisicao } from '@/types';

interface GastosPorSetorProps {
  requisicoes: Requisicao[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
];

export function GastosPorSetor({ requisicoes }: GastosPorSetorProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const setor = req.solicitante_setor;
      acc[setor] = (acc[setor] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([setor, valor]) => ({ setor, valor }))
      .sort((a, b) => b.valor - a.valor);
  }, [requisicoes]);

  const total = useMemo(() => data.reduce((acc, d) => acc + d.valor, 0), [data]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="font-semibold mb-4">Gastos por Setor</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="valor"
              nameKey="setor"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              label={({ setor, percent }) => `${setor.substring(0, 8)}${setor.length > 8 ? '...' : ''} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Valor']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm text-muted-foreground mt-2">
        Total: {formatCurrency(total)}
      </p>
    </div>
  );
}
