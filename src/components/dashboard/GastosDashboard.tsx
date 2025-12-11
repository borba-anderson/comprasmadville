import { useState, useMemo } from 'react';
import { Calendar, Building2, Users, FileText } from 'lucide-react';
import { Requisicao } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeroKPIs } from './HeroKPIs';
import { GastosLineChart } from './GastosLineChart';
import { GastosPorSetorBars } from './GastosPorSetorBars';
import { GastosPorSolicitanteBars } from './GastosPorSolicitanteBars';
import { StatusPainel } from './StatusPainel';
import { AlertasInteligentes } from './AlertasInteligentes';
import { AcoesRapidas } from './AcoesRapidas';

interface GastosDashboardProps {
  requisicoes: Requisicao[];
}

type PeriodoFilter = '7d' | '30d' | 'mes' | '3m' | '6m' | '1y' | 'all';

const PERIODO_LABELS: Record<PeriodoFilter, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  'mes': 'Este mês',
  '3m': 'Últimos 3 meses',
  '6m': 'Últimos 6 meses',
  '1y': 'Último ano',
  'all': 'Todo período',
};

export function GastosDashboard({ requisicoes }: GastosDashboardProps) {
  const [periodo, setPeriodo] = useState<PeriodoFilter>('30d');
  const [setorFilter, setSetorFilter] = useState<string>('all');
  const [solicitanteFilter, setSolicitanteFilter] = useState<string>('all');

  const setores = useMemo(() => {
    return [...new Set(requisicoes.map(r => r.solicitante_setor))].sort();
  }, [requisicoes]);

  const solicitantes = useMemo(() => {
    return [...new Set(requisicoes.map(r => r.solicitante_nome))].sort();
  }, [requisicoes]);

  const { filteredRequisicoes, previousPeriodRequisicoes } = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (periodo) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        previousEndDate = startDate;
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        previousEndDate = startDate;
        break;
      case 'mes':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = startDate;
        break;
      case '3m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        previousEndDate = startDate;
        break;
      case '6m':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        previousEndDate = startDate;
        break;
      case '1y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        previousStartDate = new Date(now.getFullYear() - 2, now.getMonth(), 1);
        previousEndDate = startDate;
        break;
      default:
        startDate = new Date(0);
        previousStartDate = new Date(0);
        previousEndDate = new Date(0);
    }

    let filtered = requisicoes.filter(req => new Date(req.created_at) >= startDate);
    let previous = periodo !== 'all' 
      ? requisicoes.filter(req => {
          const date = new Date(req.created_at);
          return date >= previousStartDate && date < previousEndDate;
        })
      : [];

    if (setorFilter !== 'all') {
      filtered = filtered.filter(r => r.solicitante_setor === setorFilter);
      previous = previous.filter(r => r.solicitante_setor === setorFilter);
    }

    if (solicitanteFilter !== 'all') {
      filtered = filtered.filter(r => r.solicitante_nome === solicitanteFilter);
      previous = previous.filter(r => r.solicitante_nome === solicitanteFilter);
    }

    return { filteredRequisicoes: filtered, previousPeriodRequisicoes: previous };
  }, [requisicoes, periodo, setorFilter, solicitanteFilter]);

  const kpis = useMemo(() => {
    const total = filteredRequisicoes.length;
    const withValue = filteredRequisicoes.filter(r => r.valor && r.valor > 0);
    const totalGasto = withValue.reduce((sum, r) => sum + (r.valor || 0), 0);
    const ticketMedio = withValue.length > 0 ? totalGasto / withValue.length : 0;
    const concluidas = filteredRequisicoes.filter(r => r.status === 'recebido' || r.status === 'comprado').length;
    const percentConcluidas = total > 0 ? (concluidas / total) * 100 : 0;

    const prevWithValue = previousPeriodRequisicoes.filter(r => r.valor && r.valor > 0);
    const prevTotalGasto = prevWithValue.reduce((sum, r) => sum + (r.valor || 0), 0);
    const prevTotal = previousPeriodRequisicoes.length;

    const tendenciaGasto = prevTotalGasto > 0 ? ((totalGasto - prevTotalGasto) / prevTotalGasto) * 100 : 0;
    const tendenciaRequisicoes = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;
    const economia = tendenciaGasto < 0 ? Math.abs(tendenciaGasto) : 0;

    return { totalGasto, totalRequisicoes: total, ticketMedio, percentConcluidas, tendenciaGasto, tendenciaRequisicoes, economia };
  }, [filteredRequisicoes, previousPeriodRequisicoes]);

  if (requisicoes.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Nenhuma requisição encontrada</h3>
          <p className="text-muted-foreground text-sm">As métricas aparecerão quando houver dados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard de Compras</h2>
          <p className="text-muted-foreground text-sm mt-1">Visão geral da operação</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={periodo} onValueChange={(v) => setPeriodo(v as PeriodoFilter)}>
            <SelectTrigger className="w-[180px] h-10 bg-card border-border/60 rounded-xl">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PERIODO_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={setorFilter} onValueChange={setSetorFilter}>
            <SelectTrigger className="w-[160px] h-10 bg-card border-border/60 rounded-xl">
              <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos setores</SelectItem>
              {setores.map(setor => (<SelectItem key={setor} value={setor}>{setor}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={solicitanteFilter} onValueChange={setSolicitanteFilter}>
            <SelectTrigger className="w-[180px] h-10 bg-card border-border/60 rounded-xl">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Solicitante" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {solicitantes.map(sol => (<SelectItem key={sol} value={sol}>{sol.split(' ').slice(0, 2).join(' ')}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AcoesRapidas />
      <HeroKPIs {...kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GastosLineChart requisicoes={filteredRequisicoes} />
        <GastosPorSetorBars requisicoes={filteredRequisicoes} />
      </div>

      <GastosPorSolicitanteBars requisicoes={filteredRequisicoes} />
      <StatusPainel requisicoes={filteredRequisicoes} />
      <AlertasInteligentes requisicoes={filteredRequisicoes} totalGasto={kpis.totalGasto} tendencia={kpis.tendenciaGasto} />
    </div>
  );
}
