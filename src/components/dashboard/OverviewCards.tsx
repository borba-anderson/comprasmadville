import { DollarSign, TrendingUp, TrendingDown, Minus, FileText, Percent } from 'lucide-react';

interface OverviewCardsProps {
  totalGasto: number;
  mediaGasto: number;
  percentComValor: number;
  totalRequisicoes: number;
  requisitionsWithValue: number;
  tendencia: number;
}

export function OverviewCards({
  totalGasto,
  mediaGasto,
  percentComValor,
  totalRequisicoes,
  requisitionsWithValue,
  tendencia,
}: OverviewCardsProps) {
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

  const TrendIcon = tendencia > 0 ? TrendingUp : tendencia < 0 ? TrendingDown : Minus;
  const trendColor = tendencia > 0 ? 'text-red-500' : tendencia < 0 ? 'text-emerald-500' : 'text-muted-foreground';
  const trendBg = tendencia > 0 ? 'bg-red-500/10' : tendencia < 0 ? 'bg-emerald-500/10' : 'bg-muted';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Gasto */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Total Gasto</span>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight" title={formatFullCurrency(totalGasto)}>
            {formatCurrency(totalGasto)}
          </p>
          {tendencia !== 0 && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <div className={`p-1 rounded ${trendBg}`}>
                <TrendIcon className="w-3 h-3" />
              </div>
              <span className="text-xs font-medium">
                {tendencia > 0 ? '+' : ''}{tendencia.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Média por Requisição */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Média por Requisição</span>
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight" title={formatFullCurrency(mediaGasto)}>
            {formatCurrency(mediaGasto)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Base: {requisitionsWithValue} requisições
          </p>
        </div>
      </div>

      {/* % Com Valor Registrado */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Com Valor Registrado</span>
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <Percent className="w-5 h-5 text-emerald-500" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight">
            {percentComValor.toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {requisitionsWithValue} de {totalRequisicoes} requisições
          </p>
        </div>
        {/* Mini progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percentComValor}%` }}
          />
        </div>
      </div>

      {/* Total Requisições */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Total Requisições</span>
          <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-violet-500" />
          </div>
        </div>
        <div>
          <p className="text-3xl font-semibold tracking-tight">
            {totalRequisicoes}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            No período selecionado
          </p>
        </div>
      </div>
    </div>
  );
}
