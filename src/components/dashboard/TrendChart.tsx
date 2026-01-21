import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from 'recharts';
import { Requisicao, STATUS_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  requisicoes: Requisicao[];
}

export function TrendChart({ requisicoes }: TrendChartProps) {
  const { chartData, trend, avgRequisicoes } = useMemo(() => {
    // Group by week for better visualization
    const weekMap = new Map<string, {
      week: string;
      total: number;
      pendente: number;
      aprovado: number;
      comprado: number;
      recebido: number;
      rejeitado: number;
      valor: number;
    }>();

    requisicoes.forEach((req) => {
      const date = new Date(req.created_at);
      // Get start of the week (Monday)
      const dayOfWeek = date.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(date);
      monday.setDate(date.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);
      
      const weekKey = monday.toISOString().split('T')[0];
      const weekLabel = `${monday.getDate().toString().padStart(2, '0')}/${(monday.getMonth() + 1).toString().padStart(2, '0')}`;

      const existing = weekMap.get(weekKey) || {
        week: weekLabel,
        total: 0,
        pendente: 0,
        aprovado: 0,
        comprado: 0,
        recebido: 0,
        rejeitado: 0,
        valor: 0,
      };

      existing.total += 1;
      existing.valor += req.valor || 0;

      // Count by status category
      if (['pendente', 'em_analise'].includes(req.status)) {
        existing.pendente += 1;
      } else if (['aprovado', 'cotando'].includes(req.status)) {
        existing.aprovado += 1;
      } else if (['comprado', 'em_entrega'].includes(req.status)) {
        existing.comprado += 1;
      } else if (req.status === 'recebido') {
        existing.recebido += 1;
      } else if (['rejeitado', 'cancelado'].includes(req.status)) {
        existing.rejeitado += 1;
      }

      weekMap.set(weekKey, existing);
    });

    // Sort by date and take last 12 weeks
    const sortedData = Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([, data]) => data);

    // Calculate trend (compare last 4 weeks vs previous 4 weeks)
    let trendValue = 0;
    if (sortedData.length >= 8) {
      const recent4 = sortedData.slice(-4).reduce((sum, d) => sum + d.total, 0);
      const previous4 = sortedData.slice(-8, -4).reduce((sum, d) => sum + d.total, 0);
      trendValue = previous4 > 0 ? ((recent4 - previous4) / previous4) * 100 : 0;
    } else if (sortedData.length >= 4) {
      const half = Math.floor(sortedData.length / 2);
      const recent = sortedData.slice(half).reduce((sum, d) => sum + d.total, 0);
      const previous = sortedData.slice(0, half).reduce((sum, d) => sum + d.total, 0);
      trendValue = previous > 0 ? ((recent - previous) / previous) * 100 : 0;
    }

    const avg = sortedData.length > 0 
      ? sortedData.reduce((sum, d) => sum + d.total, 0) / sortedData.length 
      : 0;

    return { 
      chartData: sortedData, 
      trend: trendValue,
      avgRequisicoes: avg,
    };
  }, [requisicoes]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' });
  };

  if (chartData.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Tendência Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Dados insuficientes para análise de tendência
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Tendência Semanal de Requisições
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Média/semana</p>
              <p className="text-lg font-semibold">{avgRequisicoes.toFixed(1)}</p>
            </div>
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
              trend > 5 && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
              trend < -5 && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
              trend >= -5 && trend <= 5 && 'bg-muted text-muted-foreground'
            )}>
              {trend > 5 ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend < -5 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
              <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(value: number, name: string) => {
                  if (name === 'Valor Total') return [formatCurrency(value), name];
                  return [value, name];
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '16px' }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="total"
                name="Total Requisições"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorTotal)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="recebido"
                name="Recebidas"
                stroke="hsl(142 76% 36%)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pendente"
                name="Pendentes"
                stroke="hsl(38 92% 50%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="valor"
                name="Valor Total"
                stroke="hsl(262 83% 58%)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown summary */}
        <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Pendentes</div>
            <div className="text-sm font-semibold text-amber-600">
              {chartData.reduce((sum, d) => sum + d.pendente, 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Aprovados</div>
            <div className="text-sm font-semibold text-blue-600">
              {chartData.reduce((sum, d) => sum + d.aprovado, 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Comprados</div>
            <div className="text-sm font-semibold text-purple-600">
              {chartData.reduce((sum, d) => sum + d.comprado, 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Recebidos</div>
            <div className="text-sm font-semibold text-emerald-600">
              {chartData.reduce((sum, d) => sum + d.recebido, 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Rejeitados</div>
            <div className="text-sm font-semibold text-red-600">
              {chartData.reduce((sum, d) => sum + d.rejeitado, 0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
