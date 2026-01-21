import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/StatsCard';
import { GastosDashboard } from '@/components/dashboard';
import {
  FiltersBar,
  RequisicaoTable,
  SidePanel,
  usePainelFilters,
  useSorting,
} from '@/components/painel';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Requisicao, RequisicaoStats, ValorHistorico } from '@/types';
import {
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Package,
  ShoppingCart,
} from 'lucide-react';

const AUTO_REFRESH_INTERVAL = 15000;

export default function Painel() {
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [stats, setStats] = useState<RequisicaoStats>({
    total: 0, pendente: 0, em_analise: 0, aprovado: 0, cotando: 0, comprado: 0, rejeitado: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRequisicao, setSelectedRequisicao] = useState<Requisicao | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [valorHistoryMap, _setValorHistoryMap] = useState<Record<string, ValorHistorico[]>>({});

  const { user, profile, isStaff, isLoading: authLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    filters,
    updateFilter,
    filteredRequisicoes,
    savedFilters,
    saveFilter,
    loadFilter,
    deleteFilter,
    resetFilters,
    viewMode,
    setViewMode,
    applyQuickView,
  } = usePainelFilters(requisicoes);

  const { sortConfig, handleSort, sortedRequisicoes } = useSorting(filteredRequisicoes);
  // Redirect if not staff
  useEffect(() => {
    if (!authLoading && rolesLoaded) {
      if (user && !isStaff) {
        toast({ title: 'Acesso negado', description: 'Você não tem permissão.', variant: 'destructive' });
        navigate('/');
      }
      if (!user) navigate('/auth');
    }
  }, [authLoading, rolesLoaded, user, isStaff, navigate, toast]);

  const fetchRequisicoes = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setIsRefreshing(true);

      const { data, error } = await supabase
        .from('requisicoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const requisicaoData = (data || []) as Requisicao[];
      setRequisicoes(requisicaoData);

      const newStats: RequisicaoStats = {
        total: requisicaoData.length, pendente: 0, em_analise: 0, aprovado: 0, cotando: 0, comprado: 0, rejeitado: 0,
      };
      requisicaoData.forEach((req) => {
        if (req.status in newStats) newStats[req.status as keyof RequisicaoStats]++;
      });
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching requisitions:', error);
      if (!silent) toast({ title: 'Erro', description: 'Falha ao carregar requisições.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isStaff) fetchRequisicoes();
  }, [isStaff, fetchRequisicoes]);

  useEffect(() => {
    if (!isStaff) return;
    const interval = setInterval(() => fetchRequisicoes(true), AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isStaff, fetchRequisicoes]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const sendNotification = async (req: Requisicao) => {
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          to: req.solicitante_email,
          solicitante_nome: req.solicitante_nome,
          item_nome: req.item_nome,
          protocolo: req.protocolo,
          status: req.status,
          comprador_nome: req.comprador_nome,
          previsao_entrega: req.previsao_entrega,
        },
      });
      toast({ title: 'E-mail enviado' });
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const handleViewDetails = (req: Requisicao) => {
    setSelectedRequisicao(req);
    setIsPanelOpen(true);
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.status.length > 0 ||
    filters.comprador !== 'all' ||
    filters.setor !== 'all' ||
    filters.prioridade.length > 0 ||
    filters.empresa.length > 0 ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.deliveryFilter !== 'all';

  if (authLoading || !rolesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 py-4">
        {/* Compact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
          <StatsCard title="Total" value={stats.total} icon={FileText} className="col-span-1" />
          <StatsCard title="Pendentes" value={stats.pendente} variant="warning" icon={Clock} />
          <StatsCard title="Em Análise" value={stats.em_analise} variant="info" icon={TrendingUp} />
          <StatsCard title="Aprovados" value={stats.aprovado} variant="success" icon={CheckCircle} />
          <StatsCard title="Cotando" value={stats.cotando} variant="primary" icon={Package} />
          <StatsCard title="Comprados" value={stats.comprado} variant="success" icon={ShoppingCart} />
          <StatsCard title="Rejeitados" value={stats.rejeitado} variant="danger" icon={XCircle} />
        </div>

        <Tabs defaultValue="requisicoes" className="space-y-4">
          <TabsList className="bg-card border">
            <TabsTrigger value="requisicoes" className="gap-2">
              <FileText className="w-4 h-4" />
              Requisições
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requisicoes" className="space-y-0">
            <div className="bg-card rounded-xl border overflow-hidden">
              <FiltersBar
                filters={filters}
                onFilterChange={updateFilter}
                onReset={resetFilters}
                onRefresh={() => fetchRequisicoes()}
                isRefreshing={isRefreshing}
                savedFilters={savedFilters}
                onSaveFilter={saveFilter}
                onLoadFilter={loadFilter}
                onDeleteFilter={deleteFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                resultCount={filteredRequisicoes.length}
                totalCount={requisicoes.length}
                onQuickView={applyQuickView}
              />

              <RequisicaoTable
                requisicoes={sortedRequisicoes}
                isLoading={isLoading}
                viewMode={viewMode}
                selectedId={selectedRequisicao?.id || null}
                valorHistoryMap={valorHistoryMap}
                onSelect={setSelectedRequisicao}
                onViewDetails={handleViewDetails}
                onSendEmail={sendNotification}
                formatCurrency={formatCurrency}
                hasFilters={hasActiveFilters}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <GastosDashboard requisicoes={requisicoes} />
          </TabsContent>
        </Tabs>
      </main>

      <SidePanel
        requisicao={selectedRequisicao}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onUpdate={() => fetchRequisicoes(true)}
        profileNome={profile?.nome}
        profileId={profile?.id}
      />
    </div>
  );
}
