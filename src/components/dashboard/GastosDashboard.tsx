import { useState, useMemo, useEffect } from 'react';
import { FileText, X, ArrowLeft } from 'lucide-react';
import { Requisicao, RequisicaoStatus, STATUS_CONFIG } from '@/types';
import { ExecutiveKPIs } from './ExecutiveKPIs';
import { SpendIntelligence } from './SpendIntelligence';
import { SupplierPerformance } from './SupplierPerformance';
import { OperationalEfficiency } from './OperationalEfficiency';
import { PredictiveInsights } from './PredictiveInsights';
import { SmartActionCenter } from './SmartActionCenter';
import { GastosLineChart } from './GastosLineChart';
import { GastosPorSetorBars } from './GastosPorSetorBars';
import { GastosPorSolicitanteBars } from './GastosPorSolicitanteBars';
import { StatusPainel } from './StatusPainel';
import { AlertasInteligentes } from './AlertasInteligentes';
import { EconomiaSummary } from './EconomiaSummary';
import { DashboardFilters, DashboardFiltersState, SavedDashboardFilter, DEFAULT_DASHBOARD_FILTERS } from './DashboardFilters';
import { GastosPorEmpresa } from './GastosPorEmpresa';
import { LeadTimeAnalysis } from './LeadTimeAnalysis';
import { ProcessFunnel } from './ProcessFunnel';
import { EfficiencyKPIs } from './EfficiencyKPIs';
import { EconomiaPorEmpresa } from './EconomiaPorEmpresa';
import { GastosPorCentroCusto } from './GastosPorCentroCusto';
import { TrendChart } from './TrendChart';
import { PagamentoPieChart } from './PagamentoPieChart';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gauge,
  BarChart3,
  Truck,
  Settings,
  Brain,
} from 'lucide-react';

// Reusable drill-down table component
function DrillDownTable({ 
  requests, 
  formatCurrency, 
  formatDate 
}: { 
  requests: Requisicao[]; 
  formatCurrency: (v: number | null | undefined) => string;
  formatDate: (d: string) => string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Protocolo</th>
            <th className="text-left px-4 py-3 font-medium">Item</th>
            <th className="text-center px-4 py-3 font-medium">Status</th>
            <th className="text-center px-4 py-3 font-medium">Prioridade</th>
            <th className="text-right px-4 py-3 font-medium">Valor</th>
            <th className="text-center px-4 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">{req.protocolo}</td>
              <td className="px-4 py-3">
                <p className="font-medium line-clamp-1">{req.item_nome}</p>
                <p className="text-xs text-muted-foreground">{req.solicitante_setor}</p>
              </td>
              <td className="px-4 py-3 text-center">
                <StatusBadge status={req.status} showIcon={false} />
              </td>
              <td className="px-4 py-3 text-center">
                <PriorityBadge priority={req.prioridade} />
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">
                {formatCurrency(req.valor)}
              </td>
              <td className="px-4 py-3 text-center text-muted-foreground">
                {formatDate(req.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface GastosDashboardProps {
  requisicoes: Requisicao[];
  onDrillDown?: (filters: { empresa?: string; status?: RequisicaoStatus }) => void;
}

const STORAGE_KEY = 'madville_dashboard_filters';

export function GastosDashboard({ requisicoes, onDrillDown }: GastosDashboardProps) {
  const [filters, setFilters] = useState<DashboardFiltersState>(DEFAULT_DASHBOARD_FILTERS);
  const [savedFilters, setSavedFilters] = useState<SavedDashboardFilter[]>([]);
  const [selectedSolicitante, setSelectedSolicitante] = useState<string | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [selectedCentroCusto, setSelectedCentroCusto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('executive');

  // Load saved filters
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved filters:', e);
      }
    }
  }, []);

  const saveFilter = (name: string) => {
    const newFilter: SavedDashboardFilter = {
      id: Date.now().toString(),
      name,
      filters: { ...filters },
    };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const loadFilter = (id: string) => {
    const filter = savedFilters.find((f) => f.id === id);
    if (filter) setFilters(filter.filters);
  };

  const deleteFilter = (id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const resetFilters = () => setFilters(DEFAULT_DASHBOARD_FILTERS);

  const { filteredRequisicoes, previousPeriodRequisicoes } = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let previousEndDate: Date;

    switch (filters.periodo) {
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

    let filtered = requisicoes.filter((req) => new Date(req.created_at) >= startDate);
    let previous = filters.periodo !== 'all'
      ? requisicoes.filter((req) => {
          const date = new Date(req.created_at);
          return date >= previousStartDate && date < previousEndDate;
        })
      : [];

    if (filters.empresas.length > 0) {
      filtered = filtered.filter((r) => r.solicitante_empresa && filters.empresas.includes(r.solicitante_empresa));
      previous = previous.filter((r) => r.solicitante_empresa && filters.empresas.includes(r.solicitante_empresa));
    }
    if (filters.setores.length > 0) {
      filtered = filtered.filter((r) => filters.setores.includes(r.solicitante_setor));
      previous = previous.filter((r) => filters.setores.includes(r.solicitante_setor));
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter((r) => filters.status.includes(r.status));
      previous = previous.filter((r) => filters.status.includes(r.status));
    }
    if (filters.centrosCusto.length > 0) {
      filtered = filtered.filter((r) => r.centro_custo && filters.centrosCusto.includes(r.centro_custo));
      previous = previous.filter((r) => r.centro_custo && filters.centrosCusto.includes(r.centro_custo));
    }
    if (filters.compradores.length > 0) {
      filtered = filtered.filter((r) => r.comprador_nome && filters.compradores.includes(r.comprador_nome));
      previous = previous.filter((r) => r.comprador_nome && filters.compradores.includes(r.comprador_nome));
    }

    return { filteredRequisicoes: filtered, previousPeriodRequisicoes: previous };
  }, [requisicoes, filters]);

  const handleDrillDownStatus = (status: RequisicaoStatus) => {
    onDrillDown?.({ status });
  };

  const handleFilterByStatuses = (statuses: string[]) => {
    setFilters({ ...filters, status: statuses });
  };

  const handleSolicitanteClick = (solicitanteNome: string) => setSelectedSolicitante(solicitanteNome);
  const handleSetorClick = (setor: string) => setSelectedSetor(setor);
  const handleEmpresaClick = (empresa: string) => setSelectedEmpresa(empresa);
  const handleCentroCustoClick = (centroCusto: string) => setSelectedCentroCusto(centroCusto);

  const solicitanteRequests = useMemo(() => {
    if (!selectedSolicitante) return [];
    return filteredRequisicoes.filter((r) => r.solicitante_nome === selectedSolicitante);
  }, [filteredRequisicoes, selectedSolicitante]);

  const setorRequests = useMemo(() => {
    if (!selectedSetor) return [];
    return filteredRequisicoes.filter((r) => r.solicitante_setor === selectedSetor);
  }, [filteredRequisicoes, selectedSetor]);

  const empresaRequests = useMemo(() => {
    if (!selectedEmpresa) return [];
    return filteredRequisicoes.filter((r) => r.solicitante_empresa === selectedEmpresa);
  }, [filteredRequisicoes, selectedEmpresa]);

  const centroCustoRequests = useMemo(() => {
    if (!selectedCentroCusto) return [];
    return filteredRequisicoes.filter((r) => r.centro_custo === selectedCentroCusto);
  }, [filteredRequisicoes, selectedCentroCusto]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const centrosCustoOptions = useMemo(() => {
    const centros = new Set<string>();
    requisicoes.forEach((r) => { if (r.centro_custo) centros.add(r.centro_custo); });
    return Array.from(centros).sort();
  }, [requisicoes]);

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

  // Drill-down views
  const drillDownViews = [
    { selected: selectedSolicitante, requests: solicitanteRequests, label: selectedSolicitante, clear: () => setSelectedSolicitante(null) },
    { selected: selectedSetor, requests: setorRequests, label: `Setor: ${selectedSetor}`, clear: () => setSelectedSetor(null) },
    { selected: selectedEmpresa, requests: empresaRequests, label: selectedEmpresa, clear: () => setSelectedEmpresa(null) },
    { selected: selectedCentroCusto, requests: centroCustoRequests, label: `Centro de Custo: ${selectedCentroCusto}`, clear: () => setSelectedCentroCusto(null) },
  ];

  const activeDrillDown = drillDownViews.find((v) => v.selected);
  if (activeDrillDown) {
    const totalValor = activeDrillDown.requests.reduce((sum, r) => sum + (r.valor || 0), 0);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={activeDrillDown.clear} className="h-9 w-9">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{activeDrillDown.label}</h2>
              <p className="text-muted-foreground text-sm">
                {activeDrillDown.requests.length} requisições • Total: {formatCurrency(totalValor)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={activeDrillDown.clear}>
            <X className="w-4 h-4 mr-2" /> Fechar
          </Button>
        </div>
        <DrillDownTable requests={activeDrillDown.requests} formatCurrency={formatCurrency} formatDate={formatDate} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Procurement Intelligence</h2>
          <p className="text-muted-foreground text-sm mt-1">Plataforma estratégica de gestão de compras</p>
        </div>
        <DashboardFilters
          filters={filters}
          onChange={setFilters}
          savedFilters={savedFilters}
          onSaveFilter={saveFilter}
          onLoadFilter={loadFilter}
          onDeleteFilter={deleteFilter}
          onReset={resetFilters}
          centrosCustoOptions={centrosCustoOptions}
        />
      </div>

      {/* Smart Action Center - always visible at top */}
      <SmartActionCenter requisicoes={filteredRequisicoes} onFilterStatus={handleFilterByStatuses} />

      {/* Executive KPIs - always visible */}
      <ExecutiveKPIs requisicoes={filteredRequisicoes} previousPeriod={previousPeriodRequisicoes} />

      {/* Tabbed dashboard layers */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="executive" className="gap-1.5 text-xs">
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="gap-1.5 text-xs">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="supplier" className="gap-1.5 text-xs">
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Suppliers</span>
          </TabsTrigger>
          <TabsTrigger value="operational" className="gap-1.5 text-xs">
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ops</span>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="gap-1.5 text-xs">
            <Brain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Predictive</span>
          </TabsTrigger>
        </TabsList>

        {/* Executive Overview */}
        <TabsContent value="executive" className="space-y-6 mt-6">
          <TrendChart requisicoes={filteredRequisicoes} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GastosPorEmpresa requisicoes={filteredRequisicoes} onDrillDown={handleEmpresaClick} />
            <LeadTimeAnalysis requisicoes={filteredRequisicoes} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProcessFunnel requisicoes={filteredRequisicoes} onDrillDown={handleDrillDownStatus} />
            <EfficiencyKPIs requisicoes={filteredRequisicoes} />
          </div>
          <StatusPainel requisicoes={filteredRequisicoes} />
        </TabsContent>

        {/* Financial Spend Intelligence */}
        <TabsContent value="financial" className="space-y-6 mt-6">
          <SpendIntelligence requisicoes={filteredRequisicoes} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EconomiaSummary requisicoes={filteredRequisicoes} />
            <EconomiaPorEmpresa requisicoes={filteredRequisicoes} onDrillDown={handleEmpresaClick} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GastosPorSetorBars requisicoes={filteredRequisicoes} onSetorClick={handleSetorClick} />
            <GastosPorCentroCusto requisicoes={filteredRequisicoes} onDrillDown={handleCentroCustoClick} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GastosLineChart requisicoes={filteredRequisicoes} />
            <PagamentoPieChart requisicoes={filteredRequisicoes} />
          </div>
        </TabsContent>

        {/* Supplier Performance */}
        <TabsContent value="supplier" className="space-y-6 mt-6">
          <SupplierPerformance requisicoes={filteredRequisicoes} />
          <GastosPorSolicitanteBars requisicoes={filteredRequisicoes} onSolicitanteClick={handleSolicitanteClick} />
        </TabsContent>

        {/* Operational Efficiency */}
        <TabsContent value="operational" className="space-y-6 mt-6">
          <OperationalEfficiency requisicoes={filteredRequisicoes} />
          <AlertasInteligentes requisicoes={filteredRequisicoes} totalGasto={filteredRequisicoes.reduce((s, r) => s + (r.valor || 0), 0)} tendencia={0} />
        </TabsContent>

        {/* Predictive Intelligence */}
        <TabsContent value="predictive" className="space-y-6 mt-6">
          <PredictiveInsights requisicoes={filteredRequisicoes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
