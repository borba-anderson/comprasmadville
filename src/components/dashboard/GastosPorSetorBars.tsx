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
import { Building2 } from 'lucide-react';

interface GastosPorSetorBarsProps {
  requisicoes: Requisicao[];
  onSetorClick?: (setor: string) => void;
}

const COLORS = [
  'hsl(217, 91%, 60%)',  // Primary blue
  'hsl(142, 71%, 45%)',  // Green
  'hsl(262, 83%, 58%)',  // Purple
  'hsl(38, 92%, 50%)',   // Amber
  'hsl(199, 89%, 48%)',  // Cyan
  'hsl(0, 84%, 60%)',    // Red
  'hsl(280, 65%, 60%)',  // Pink
  'hsl(173, 80%, 40%)',  // Teal
];

export function GastosPorSetorBars({ requisicoes, onSetorClick }: GastosPorSetorBarsProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const setor = req.solicitante_setor;
      acc[setor] = (acc[setor] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(grouped).reduce((a, b) => a + b, 0);

    return Object.entries(grouped)
      .map(([setor, valor]) => ({
        setor: setor.length > 12 ? setor.slice(0, 12) + '...' : setor,
        setorFull: setor,
        valor,
        percent: total > 0 ? (valor / total) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8);
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value.toFixed(0)}`;
  };

  const formatTooltipCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h4 className="font-semibold">Gastos por Setor</h4>
            <p className="text-sm text-muted-foreground">Distribuição por área</p>
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
          <Building2 className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h4 className="font-semibold">Gastos por Setor</h4>
          <p className="text-sm text-muted-foreground">Top {data.length} setores</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
            <XAxis 
              dataKey="setor" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
              angle={-20}
              textAnchor="end"
              height={50}
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
              formatter={(value: number) => [formatTooltipCurrency(value), 'Valor']}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return payload[0].payload.setorFull;
                }
                return label;
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                padding: '12px 16px',
              }}
              labelStyle={{
                color: 'hsl(var(--foreground))',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '4px',
              }}
              itemStyle={{
                color: 'hsl(var(--muted-foreground))',
              }}
            />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} style={{ cursor: onSetorClick ? 'pointer' : 'default' }}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className={onSetorClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
                  onClick={() => onSetorClick?.(entry.setorFull)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
