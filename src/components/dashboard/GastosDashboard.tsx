import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, FileText, BarChart3 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatsCard } from '@/components/StatsCard';
import { GastosPorSolicitante } from './GastosPorSolicitante';
import { GastosPorSetor } from './GastosPorSetor';
import { GastosEvolucao } from './GastosEvolucao';
import { Requisicao } from '@/types';

interface GastosDashboardProps {
  requisicoes: Requisicao[];
}

type PeriodoFilter = '1m' | '3m' | '6m' | '1y' | 'all';

export function GastosDashboard({ requisicoes }: GastosDashboardProps) {
  const [periodo, setPeriodo] = useState<PeriodoFilter>('3m');

  const filteredRequisicoes = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (periodo) {
      case '1m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return requisicoes;
    }

    return requisicoes.filter((req) => new Date(req.created_at) >= startDate);
  }, [requisicoes, periodo]);

  const requisitionsWithValue = useMemo(
    () => filteredRequisicoes.filter((req) => req.valor != null && req.valor > 0),
    [filteredRequisicoes]
  );

  const totalGasto = useMemo(
    () => requisitionsWithValue.reduce((acc, req) => acc + (req.valor || 0), 0),
    [requisitionsWithValue]
  );

  const mediaGasto = useMemo(
    () => (requisitionsWithValue.length > 0 ? totalGasto / requisitionsWithValue.length : 0),
    [totalGasto, requisitionsWithValue]
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Dashboard de Gastos</h2>
        </div>
        <Select value={periodo} onValueChange={(v) => setPeriodo(v as PeriodoFilter)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Último mês</SelectItem>
            <SelectItem value="3m">Últimos 3 meses</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
            <SelectItem value="all">Todo período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Gasto"
          value={formatCurrency(totalGasto)}
          icon={DollarSign}
          variant="primary"
        />
        <StatsCard
          title="Média por Requisição"
          value={formatCurrency(mediaGasto)}
          icon={TrendingUp}
          variant="info"
        />
        <StatsCard
          title="Com Valor Registrado"
          value={`${requisitionsWithValue.length} de ${filteredRequisicoes.length}`}
          icon={FileText}
          variant="success"
        />
      </div>

      {/* Charts */}
      {requisitionsWithValue.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GastosPorSolicitante requisicoes={requisitionsWithValue} />
          <GastosPorSetor requisicoes={requisitionsWithValue} />
          <div className="lg:col-span-2">
            <GastosEvolucao requisicoes={requisitionsWithValue} />
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border p-12 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold">Sem dados para exibir</p>
          <p className="text-muted-foreground text-sm">
            Adicione valores às requisições para visualizar o dashboard
          </p>
        </div>
      )}
    </div>
  );
}
