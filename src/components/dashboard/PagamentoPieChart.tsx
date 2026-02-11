import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Requisicao } from '@/types';
import { CreditCard } from 'lucide-react';

interface PagamentoPieChartProps {
  requisicoes: Requisicao[];
}

const COLORS = [
  'hsl(142, 71%, 45%)',  // PIX
  'hsl(217, 91%, 60%)',  // Boleto
  'hsl(262, 83%, 58%)',  // Cartão
  'hsl(38, 92%, 50%)',   // Transferência
  'hsl(0, 72%, 51%)',    // Dinheiro
  'hsl(200, 18%, 46%)',  // Outro/Não informado
];

export function PagamentoPieChart({ requisicoes }: PagamentoPieChartProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      if (!req.valor) return acc;
      const fp = req.forma_pagamento || 'Não informado';
      if (!acc[fp]) acc[fp] = { valor: 0, count: 0 };
      acc[fp].valor += req.valor;
      acc[fp].count++;
      return acc;
    }, {} as Record<string, { valor: number; count: number }>);

    return Object.entries(grouped)
      .map(([name, { valor, count }]) => ({ name, valor, count }))
      .sort((a, b) => b.valor - a.valor);
  }, [requisicoes]);

  const total = data.reduce((sum, d) => sum + d.valor, 0);
  const totalReqs = data.reduce((sum, d) => sum + d.count, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (data.length === 0 || total === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h4 className="font-semibold">Formas de Pagamento</h4>
            <p className="text-sm text-muted-foreground">Sem dados no período</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Sem dados no período
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h4 className="font-semibold">Formas de Pagamento</h4>
          <p className="text-sm text-muted-foreground">
            {totalReqs} requisições • {formatCurrency(total)} total
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={3}
              dataKey="valor"
              nameKey="name"
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
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '12px 16px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string, entry: any) => {
                const item = data.find(d => d.name === value);
                const pct = item ? ((item.valor / total) * 100).toFixed(0) : '0';
                return `${value} (${pct}%)`;
              }}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
