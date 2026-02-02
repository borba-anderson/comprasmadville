import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/StatsCard";
import { GastosDashboard } from "@/components/dashboard";
import {
  FiltersBar,
  RequisicaoTable,
  PaginationControls,
  usePainelFilters,
  useSorting,
  usePagination,
} from "@/components/painel";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { Requisicao, RequisicaoStats, ValorHistorico } from "@/types";
import { Clock, CheckCircle, XCircle, TrendingUp, Package, ShoppingCart } from "lucide-react";

const AUTO_REFRESH_INTERVAL = 15000;

export default function Painel() {
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [stats, setStats] = useState<RequisicaoStats>({
    total: 0,
    pendente: 0,
    em_analise: 0,
    aprovado: 0,
    cotando: 0,
    comprado: 0,
    rejeitado: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRequisicao, setSelectedRequisicao] = useState<Requisicao | null>(null);
  const [valorHistoryMap, _setValorHistoryMap] = useState<Record<string, ValorHistorico[]>>({});

  const { user, profile, isStaff, isLoading: authLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isReadOnly = !isStaff;
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
  const { paginatedItems, pagination, goToPage, changePageSize } = usePagination(sortedRequisicoes, 25);

  useEffect(() => {
    if (!authLoading && rolesLoaded) {
      if (!user) navigate("/auth");
    }
  }, [authLoading, rolesLoaded, user, navigate]);

  const fetchRequisicoes = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setIsLoading(true);
        setIsRefreshing(true);

        const { data, error } = await supabase
          .from("requisicoes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const requisicaoData = (data || []) as Requisicao[];
        setRequisicoes(requisicaoData);

        const newStats: RequisicaoStats = {
          total: requisicaoData.length,
          pendente: 0,
          em_analise: 0,
          aprovado: 0,
          cotando: 0,
          comprado: 0,
          rejeitado: 0,
        };
        requisicaoData.forEach((req) => {
          if (req.status in newStats) newStats[req.status as keyof RequisicaoStats]++;
        });
        setStats(newStats);
      } catch (error) {
        console.error("Error fetching requisitions:", error);
        if (!silent) toast({ title: "Erro", description: "Falha ao carregar requisições.", variant: "destructive" });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    if (user) fetchRequisicoes();
  }, [user, fetchRequisicoes]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => fetchRequisicoes(true), AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [user, fetchRequisicoes]);

  // Realtime notifications - for solicitantes (status changes) and staff (new requisitions)
  // Must be called unconditionally to respect rules of hooks
  useRealtimeNotifications({
    userEmail: profile?.email || null,
    enabled: !!profile?.email,
    onDataChange: useCallback(() => fetchRequisicoes(true), [fetchRequisicoes]),
    isStaff: !!isStaff,
  });

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return "-";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const sendNotification = async (req: Requisicao) => {
    try {
      await supabase.functions.invoke("send-notification", {
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
      toast({ title: "E-mail enviado" });
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  const handleViewDetails = (req: Requisicao) => {
    navigate(`/painel/${req.id}`);
  };

  const hasActiveFilters =
    filters.search !== "" ||
    filters.status.length > 0 ||
    filters.comprador !== "all" ||
    filters.setor !== "all" ||
    filters.prioridade.length > 0 ||
    filters.empresa.length > 0 ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.deliveryFilter !== "all";

  if (authLoading || !rolesLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="spinner w-8 h-8 border-[#107c50]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>
        {`
          /* Sobrescrever cores laranja/warning para verde */
          .bg-orange-100,
          .bg-yellow-100,
          .bg-amber-100 {
            background-color: #d1fae5 !important;
          }
          
          .text-orange-800,
          .text-yellow-800,
          .text-amber-800 {
            color: #065f46 !important;
          }
          
          .border-orange-200,
          .border-yellow-200,
          .border-amber-200 {
            border-color: #a7f3d0 !important;
          }
          
          .hover\\:bg-orange-50:hover,
          .hover\\:bg-yellow-50:hover,
          .hover\\:bg-amber-50:hover {
            background-color: #ecfdf5 !important;
          }
          
          .ring-orange-500,
          .ring-yellow-500,
          .ring-amber-500 {
            --tw-ring-color: #10b981 !important;
          }
          
          .text-orange-500,
          .text-yellow-500,
          .text-amber-500 {
            color: #10b981 !important;
          }
          
          .text-orange-600,
          .text-yellow-600,
          .text-amber-600 {
            color: #059669 !important;
          }
          
          .bg-orange-500,
          .bg-yellow-500,
          .bg-amber-500 {
            background-color: #10b981 !important;
          }
          
          .bg-orange-600,
          .bg-yellow-600,
          .bg-amber-600 {
            background-color: #059669 !important;
          }
          
          button.bg-orange-500,
          button.bg-yellow-500,
          button.bg-amber-500 {
            background-color: #10b981 !important;
          }
          
          button.hover\\:bg-orange-600:hover,
          button.hover\\:bg-yellow-600:hover,
          button.hover\\:bg-amber-600:hover {
            background-color: #059669 !important;
          }
        `}
      </style>
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <Header />
      </div>

      <main className="max-w-[1600px] mx-auto px-4 py-4">
        {isReadOnly && (
          <div className="mb-4 p-3 bg-white rounded-lg flex items-center gap-2 shadow-sm border-l-4 border-blue-600 text-slate-700">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm">
              <strong>Modo visualização:</strong> Você está vendo apenas as suas requisições.
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
          <StatsCard
            title="Total"
            value={stats.total}
            icon={FileText}
            className="col-span-1 bg-white text-slate-900 shadow-sm border-none"
          />
          <StatsCard
            title="Pendentes"
            value={stats.pendente}
            variant="warning"
            icon={Clock}
            className="bg-white text-slate-900 shadow-sm border-none"
          />
          <StatsCard
            title="Em Análise"
            value={stats.em_analise}
            variant="info"
            icon={TrendingUp}
            className="bg-white text-slate-900 shadow-sm border-none"
          />
          <StatsCard
            title="Aprovados"
            value={stats.aprovado}
            variant="success"
            icon={CheckCircle}
            className="bg-white text-slate-900 shadow-sm border-none"
          />
          <StatsCard
            title="Cotando"
            value={stats.cotando}
            variant="primary"
            icon={Package}
            className="bg-white text-slate-900 shadow-sm border-none"
          />
          <StatsCard
            title="Comprados"
            value={stats.comprado}
            variant="success"
            icon={ShoppingCart}
            className="bg-white text-slate-900 shadow-sm border-none"
          />
          <StatsCard
            title="Rejeitados"
            value={stats.rejeitado}
            variant="danger"
            icon={XCircle}
            className="bg-white text-slate-900 shadow-sm border-none"
          />
        </div>

        <Tabs defaultValue="requisicoes" className="space-y-4">
          <TabsList className="bg-white border shadow-sm text-slate-600">
            <TabsTrigger
              value="requisicoes"
              className="gap-2 data-[state=active]:bg-slate-100 data-[state=active]:text-[#107c50]"
            >
              <FileText className="w-4 h-4" />
              {isReadOnly ? "Minhas Requisições" : "Requisições"}
            </TabsTrigger>
            {!isReadOnly && (
              <TabsTrigger
                value="dashboard"
                className="gap-2 data-[state=active]:bg-slate-100 data-[state=active]:text-[#107c50]"
              >
                <DollarSign className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="requisicoes" className="space-y-0">
            <div className="bg-white text-slate-900 rounded-xl border-none overflow-hidden shadow-lg">
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
                exportRequisicoes={sortedRequisicoes}
                readOnly={isReadOnly}
              />

              <RequisicaoTable
                requisicoes={paginatedItems}
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
                readOnly={isReadOnly}
                onUpdate={() => fetchRequisicoes(true)}
              />

              <PaginationControls pagination={pagination} onPageChange={goToPage} onPageSizeChange={changePageSize} />
            </div>
          </TabsContent>

          {!isReadOnly && (
            <TabsContent value="dashboard">
              <div className="bg-white text-slate-900 rounded-xl p-4 shadow-lg">
                <GastosDashboard requisicoes={requisicoes} />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
