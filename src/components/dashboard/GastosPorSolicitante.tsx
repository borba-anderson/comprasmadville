import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Requisicao } from '@/types';

interface GastosPorSolicitanteProps {
  requisicoes: Requisicao[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function GastosPorSolicitante({ requisicoes }: GastosPorSolicitanteProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const nome = req.solicitante_nome;
      acc[nome] = (acc[nome] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([nome, valor]) => ({ nome: nome.split(' ')[0], valorTotal: valor, nomeCompleto: nome }))
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 10);
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="font-semibold mb-4">Top 10 - Gastos por Solicitante</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="nome" width={60} fontSize={12} />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Valor']}
              labelFormatter={(label, payload) => payload?.[0]?.payload?.nomeCompleto || label}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="valorTotal" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
