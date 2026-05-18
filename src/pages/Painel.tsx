import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, DollarSign, Activity, Truck, Users, Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/Header";
import {
  EconomiaSummary,
  GastosLineChart,
  StatusPainel,
  ProcessFunnel,
  OperationalEfficiency,
  SupplierPerformance,
  EconomiaPorComprador,
  GastosPorSolicitanteBars,
  PredictiveInsights,
  GastosPorSetorBars,
} from "@/components/dashboard";
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
    <div className="min-h-screen bg-white">
      {/* Green accent bar at top */}
      <div className="h-1 bg-success w-full" />
      <style>
        {`
          /* Substituir TODAS as cores laranja por verde - Abordagem agressiva */
          
          /* Todos os backgrounds laranja */
          *[class*="bg-orange"],
          *[style*="background-color: rgb(249, 115, 22)"],
          *[style*="background-color: rgb(251, 146, 60)"],
          *[style*="background: rgb(249, 115, 22)"],
          *[style*="background: rgb(251, 146, 60)"] {
            background-color: #10b981 !important;
            background: #10b981 !important;
          }
          
          /* Todos os textos laranja */
          *[class*="text-orange"] {
            color: #10b981 !important;
          }
          
          /* Todas as bordas laranja */
          *[class*="border-orange"] {
            border-color: #10b981 !important;
          }
          
          /* Todos os hovers laranja */
          *[class*="hover:bg-orange"]:hover {
            background-color: #059669 !important;
            background: #059669 !important;
          }
          
          *[class*="hover:text-orange"]:hover {
            color: #059669 !important;
          }
          
          *[class*="hover:border-orange"]:hover {
            border-color: #059669 !important;
          }
          
          /* Ring/outline laranja */
          *[class*="ring-orange"] {
            --tw-ring-color: #10b981 !important;
          }
          
          /* Focus laranja */
          *[class*="focus:bg-orange"]:focus {
            background-color: #10b981 !important;
          }
          
          *[class*="focus:border-orange"]:focus {
            border-color: #10b981 !important;
          }
          
          *[class*="focus:ring-orange"]:focus {
            --tw-ring-color: #10b981 !important;
          }
        `}
      </style>
      <div className="bg-white sticky top-0 z-50 shadow-sm border-b border-success/20">
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

        {/* Compact status strip — quiet, executive */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-6">
          {[
            { label: "Total", value: stats.total, tone: "slate" },
            { label: "Pendentes", value: stats.pendente, tone: "amber" },
            { label: "Em análise", value: stats.em_analise, tone: "blue" },
            { label: "Aprovados", value: stats.aprovado, tone: "emerald" },
            { label: "Cotando", value: stats.cotando, tone: "slate" },
            { label: "Comprados", value: stats.comprado, tone: "emerald" },
            { label: "Rejeitados", value: stats.rejeitado, tone: "red" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-slate-100 rounded-lg px-3 py-2.5"
            >
              <div className="text-[10px] font-semibold tracking-wide uppercase text-slate-400">
                {s.label}
              </div>
              <div
                className={`text-[20px] font-semibold num-tabular leading-tight mt-0.5 ${
                  s.tone === "red"
                    ? "text-red-600"
                    : s.tone === "amber"
                      ? "text-amber-700"
                      : s.tone === "blue"
                        ? "text-blue-700"
                        : s.tone === "emerald"
                          ? "text-emerald-700"
                          : "text-slate-900"
                }`}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="requisicoes" className="space-y-5">
          <TabsList className="bg-white border border-slate-100 shadow-sm text-slate-600 h-auto p-1">
            <TabsTrigger value="requisicoes" className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              {isReadOnly ? "Minhas Requisições" : "Requisições"}
            </TabsTrigger>
            {!isReadOnly && (
              <>
                <TabsTrigger value="financeiro" className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  <DollarSign className="w-4 h-4" /> Financeiro
                </TabsTrigger>
                <TabsTrigger value="operacional" className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  <Activity className="w-4 h-4" /> Operacional
                </TabsTrigger>
                <TabsTrigger value="fornecedores" className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  <Truck className="w-4 h-4" /> Fornecedores
                </TabsTrigger>
                <TabsTrigger value="compradores" className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  <Users className="w-4 h-4" /> Compradores
                </TabsTrigger>
                <TabsTrigger value="preditivo" className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  <Brain className="w-4 h-4" /> Preditivo
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="requisicoes" className="space-y-0">
            <div className="bg-white text-slate-900 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
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
            <>
              <TabsContent value="financeiro" className="space-y-5">
                <AnalyticCard><EconomiaSummary requisicoes={requisicoes} /></AnalyticCard>
                <AnalyticCard><GastosLineChart requisicoes={requisicoes} /></AnalyticCard>
                <AnalyticCard><GastosPorSetorBars requisicoes={requisicoes} /></AnalyticCard>
              </TabsContent>

              <TabsContent value="operacional" className="space-y-5">
                <AnalyticCard><StatusPainel requisicoes={requisicoes} /></AnalyticCard>
                <AnalyticCard><ProcessFunnel requisicoes={requisicoes} /></AnalyticCard>
                <AnalyticCard><OperationalEfficiency requisicoes={requisicoes} /></AnalyticCard>
              </TabsContent>

              <TabsContent value="fornecedores" className="space-y-5">
                <AnalyticCard><SupplierPerformance requisicoes={requisicoes} /></AnalyticCard>
              </TabsContent>

              <TabsContent value="compradores" className="space-y-5">
                <AnalyticCard><EconomiaPorComprador requisicoes={requisicoes} /></AnalyticCard>
                <AnalyticCard><GastosPorSolicitanteBars requisicoes={requisicoes} /></AnalyticCard>
              </TabsContent>

              <TabsContent value="preditivo" className="space-y-5">
                <AnalyticCard><PredictiveInsights requisicoes={requisicoes} /></AnalyticCard>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}
