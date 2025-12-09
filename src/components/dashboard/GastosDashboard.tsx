import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OverviewCards } from './OverviewCards';
import { GastosPorSolicitante } from './GastosPorSolicitante';
import { GastosPorSetor } from './GastosPorSetor';
import { GastosEvolucao } from './GastosEvolucao';
import { StatusRequisicoes } from './StatusRequisicoes';
import { InsightsInteligentes } from './InsightsInteligentes';
import { Requisicao } from '@/types';

interface GastosDashboardProps {
  requisicoes: Requisicao[];
}

type PeriodoFilter = '1m' | '3m' | '6m' | '1y' | 'all';

const PERIODO_LABELS: Record<PeriodoFilter, string> = {
  '1m': 'Último mês',
  '3m': 'Últimos 3 meses',
  '6m': 'Últimos 6 meses',
  '1y': 'Último ano',
  'all': 'Todo período',
};

export function GastosDashboard({ requisicoes }: GastosDashboardProps) {
  const [periodo, setPeriodo] = useState<PeriodoFilter>('3m');

  const { filteredRequisicoes, previousPeriodRequisicoes } = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (periodo) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
        previousEndDate = startDate;
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        previousEndDate = startDate;
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
        previousEndDate = startDate;
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        previousStartDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
        previousEndDate = startDate;
        break;
      default:
        return {
          filteredRequisicoes: requisicoes,
          previousPeriodRequisicoes: [],
        };
    }

    const filtered = requisicoes.filter((req) => new Date(req.created_at) >= startDate);
    const previous = requisicoes.filter(
      (req) => {
        const date = new Date(req.created_at);
        return date >= previousStartDate && date < previousEndDate;
      }
    );

    return { filteredRequisicoes: filtered, previousPeriodRequisicoes: previous };
  }, [requisicoes, periodo]);

  const requisitionsWithValue = useMemo(
    () => filteredRequisicoes.filter((req) => req.valor != null && req.valor > 0),
    [filteredRequisicoes]
  );

  const previousRequisitionsWithValue = useMemo(
    () => previousPeriodRequisicoes.filter((req) => req.valor != null && req.valor > 0),
    [previousPeriodRequisicoes]
  );

  // Cálculos principais
  const totalGasto = useMemo(
    () => requisitionsWithValue.reduce((acc, req) => acc + (req.valor || 0), 0),
    [requisitionsWithValue]
  );

  const previousTotalGasto = useMemo(
    () => previousRequisitionsWithValue.reduce((acc, req) => acc + (req.valor || 0), 0),
    [previousRequisitionsWithValue]
  );

  const mediaGasto = useMemo(
    () => (requisitionsWithValue.length > 0 ? totalGasto / requisitionsWithValue.length : 0),
    [totalGasto, requisitionsWithValue]
  );

  const percentComValor = useMemo(
    () => (filteredRequisicoes.length > 0 
      ? (requisitionsWithValue.length / filteredRequisicoes.length) * 100 
      : 0),
    [filteredRequisicoes.length, requisitionsWithValue.length]
  );

  // Cálculo de tendência
  const tendencia = useMemo(() => {
    if (previousTotalGasto === 0) return 0;
    return ((totalGasto - previousTotalGasto) / previousTotalGasto) * 100;
  }, [totalGasto, previousTotalGasto]);

  const TrendIcon = tendencia > 0 ? TrendingUp : tendencia < 0 ? TrendingDown : Minus;
  const trendColor = tendencia > 0 ? 'text-red-500' : tendencia < 0 ? 'text-emerald-500' : 'text-muted-foreground';

  return (
    <div className="space-y-8">
      {/* Header minimalista */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard de Gastos</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Análise financeira e insights do período
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={periodo} onValueChange={(v) => setPeriodo(v as PeriodoFilter)}>
            <SelectTrigger className="w-44 bg-background border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PERIODO_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Seção 1: Visão Geral */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Visão Geral
        </h3>
        <OverviewCards
          totalGasto={totalGasto}
          mediaGasto={mediaGasto}
          percentComValor={percentComValor}
          totalRequisicoes={filteredRequisicoes.length}
          requisitionsWithValue={requisitionsWithValue.length}
          tendencia={tendencia}
        />
      </section>

      {/* Seção 2: Evolução Mensal */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Evolução Mensal
          </h3>
          {tendencia !== 0 && periodo !== 'all' && (
            <div className={`flex items-center gap-1.5 text-sm ${trendColor}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(tendencia).toFixed(1)}% vs período anterior</span>
            </div>
          )}
        </div>
        <GastosEvolucao requisicoes={requisitionsWithValue} />
      </section>

      {/* Seção 3: Distribuição dos Gastos */}
      {requisitionsWithValue.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Distribuição dos Gastos
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GastosPorSolicitante requisicoes={requisitionsWithValue} totalGasto={totalGasto} />
            <GastosPorSetor requisicoes={requisitionsWithValue} totalGasto={totalGasto} />
          </div>
        </section>
      )}

      {/* Seção 4: Status das Requisições */}
      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Status das Requisições
        </h3>
        <StatusRequisicoes requisicoes={filteredRequisicoes} />
      </section>

      {/* Seção 5: Insights Inteligentes */}
      {requisitionsWithValue.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Insights Inteligentes
          </h3>
          <InsightsInteligentes 
            requisicoes={requisitionsWithValue} 
            totalGasto={totalGasto}
            tendencia={tendencia}
          />
        </section>
      )}

      {/* Estado vazio */}
      {requisitionsWithValue.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-16 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">Sem dados para exibir</p>
          <p className="text-muted-foreground text-sm mt-1">
            Adicione valores às requisições para visualizar o dashboard
          </p>
        </div>
      )}
    </div>
  );
}
