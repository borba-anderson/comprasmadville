import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Minus,
  CheckCircle,
  Percent,
  PiggyBank,
} from 'lucide-react';

interface HeroKPIsProps {
  totalGasto: number;
  totalRequisicoes: number;
  ticketMedio: number;
  percentConcluidas: number;
  economiaReal: number;
  economiaPercentual: number;
  totalOrcado: number;
  tendenciaGasto: number;
  tendenciaRequisicoes: number;
}

export function HeroKPIs({
  totalGasto,
  totalRequisicoes,
  ticketMedio,
  percentConcluidas,
  economiaReal,
  economiaPercentual,
  totalOrcado,
  tendenciaGasto,
  tendenciaRequisicoes,
}: HeroKPIsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(2).replace('.', ',')}M`;
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace('.', ',')}k`;
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatFullCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderTrend = (value: number, inverted = false) => {
    if (value === 0) return null;
    
    const isPositive = inverted ? value < 0 : value > 0;
    const Icon = value > 0 ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-emerald-600' : 'text-red-500';
    const bgColor = isPositive ? 'bg-emerald-50' : 'bg-red-50';

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${bgColor}`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className={`text-xs font-semibold ${color}`}>
          {value > 0 ? '+' : ''}{value.toFixed(1)}%
        </span>
      </div>
    );
  };

  const kpis = [
    {
      title: 'Total Gasto',
      value: formatCurrency(totalGasto),
      fullValue: formatFullCurrency(totalGasto),
      icon: DollarSign,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      trend: tendenciaGasto,
      trendInverted: true, // Lower spending is good
      description: 'no período selecionado',
    },
    {
      title: 'Total de Requisições',
      value: totalRequisicoes.toString(),
      icon: FileText,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      trend: tendenciaRequisicoes,
      description: 'requisições criadas',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(ticketMedio),
      fullValue: formatFullCurrency(ticketMedio),
      icon: TrendingUp,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'valor médio por requisição',
    },
    {
      title: 'Taxa de Conclusão',
      value: `${percentConcluidas.toFixed(0)}%`,
      icon: CheckCircle,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      description: 'requisições finalizadas',
      showProgress: true,
      progressValue: percentConcluidas,
    },
    {
      title: 'Economia Gerada',
      value: economiaReal !== 0 ? formatCurrency(Math.abs(economiaReal)) : '—',
      fullValue: economiaReal !== 0 ? formatFullCurrency(Math.abs(economiaReal)) : undefined,
      icon: PiggyBank,
      iconBg: economiaReal > 0 ? 'bg-emerald-50' : economiaReal < 0 ? 'bg-red-50' : 'bg-gray-50',
      iconColor: economiaReal > 0 ? 'text-emerald-600' : economiaReal < 0 ? 'text-red-600' : 'text-gray-400',
      description: economiaReal > 0 
        ? `${economiaPercentual.toFixed(1)}% de economia vs orçado`
        : economiaReal < 0 
          ? `${Math.abs(economiaPercentual).toFixed(1)}% de acréscimo vs orçado`
          : 'sem valores comparativos',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={kpi.title}
            className="bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 ${kpi.iconBg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              {kpi.trend !== undefined && renderTrend(kpi.trend, kpi.trendInverted)}
            </div>
            
            <div className="space-y-1">
              <p 
                className="text-3xl font-semibold tracking-tight" 
                title={kpi.fullValue}
              >
                {kpi.value}
              </p>
              <p className="text-sm font-medium text-foreground/80">{kpi.title}</p>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </div>

            {kpi.showProgress && (
              <div className="mt-4">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${kpi.progressValue}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
