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
import { Requisicao, EMPRESAS } from '@/types';
import { Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GastosPorEmpresaProps {
  requisicoes: Requisicao[];
  onDrillDown?: (empresa: string) => void;
}

const COLORS: Record<string, string> = {
  'GMAD Joinville': 'hsl(217, 91%, 60%)',
  'GMAD Curitiba': 'hsl(142, 71%, 45%)',
  'GMAD Soluções': 'hsl(262, 83%, 58%)',
  'GMAD CD': 'hsl(38, 92%, 50%)',
};

export function GastosPorEmpresa({ requisicoes, onDrillDown }: GastosPorEmpresaProps) {
  const data = useMemo(() => {
    const grouped = requisicoes.reduce((acc, req) => {
      const empresa = req.solicitante_empresa || 'Não informado';
      if (!acc[empresa]) {
        acc[empresa] = { valor: 0, count: 0 };
      }
      acc[empresa].valor += req.valor || 0;
      acc[empresa].count++;
      return acc;
    }, {} as Record<string, { valor: number; count: number }>);

    const total = Object.values(grouped).reduce((a, b) => a + b.valor, 0);

    return EMPRESAS.map((empresa) => ({
      empresa,
      empresaShort: empresa.replace('GMAD ', ''),
      valor: grouped[empresa]?.valor || 0,
      count: grouped[empresa]?.count || 0,
      percent: total > 0 ? ((grouped[empresa]?.valor || 0) / total) * 100 : 0,
    })).sort((a, b) => b.valor - a.valor);
  }, [requisicoes]);

  const totalGeral = data.reduce((sum, d) => sum + d.valor, 0);
  const totalReqs = data.reduce((sum, d) => sum + d.count, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value.toFixed(0)}`;
  };

  const formatTooltipCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold">Gastos por Empresa</h4>
            <p className="text-sm text-muted-foreground">
              {totalReqs} requisições • {formatCurrency(totalGeral)} total
            </p>
          </div>
        </div>
      </div>

      {data.every((d) => d.valor === 0) ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Sem dados no período
        </div>
      ) : (
        <>
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
                  formatter={(value: number) => [formatTooltipCurrency(value), 'Valor']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return payload[0].payload.empresa;
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
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.empresa] || 'hsl(var(--primary))'}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => onDrillDown?.(entry.empresa)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clickable legend */}
          <div className="grid grid-cols-2 gap-2">
            {data.map((d) => (
              <Button
                key={d.empresa}
                variant="ghost"
                size="sm"
                className="justify-start h-auto py-2 px-3 hover:bg-muted"
                onClick={() => onDrillDown?.(d.empresa)}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: COLORS[d.empresa] }}
                />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{d.empresaShort}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(d.valor)} • {d.count} req
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
