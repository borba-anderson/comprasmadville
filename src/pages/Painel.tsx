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
  PaginationControls,
  usePainelFilters,
  useSorting,
  usePagination,
} from '@/components/painel';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
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
      if (!user) navigate('/auth');
    }
  }, [authLoading, rolesLoaded, user, navigate]);

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

  useRealtimeNotifications({
    userEmail: profile?.email || null,
    enabled: isReadOnly && !!profile?.email,
    onDataChange: () => fetchRequisicoes(true),
  });

  useEffect(() => {
    if (user) fetchRequisicoes();
  }, [user, fetchRequisicoes]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => fetchRequisicoes(true), AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [user, fetchRequisicoes]);

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
      <div className="min-h-screen flex items-center justify-center bg-[#107c50]">
        <div className="spinner w-8 h-8 border-white" />
      </div>
    );
  }

  return (
    // FUNDO VERDE ESPECÍFICO (#107c50) E TEXTO BRANCO PARA O GERAL
    <div className="min-h-screen bg-[#107c50] text-slate-50">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 py-4">
        {/* Banner do Solicitante (Fundo Branco para destaque) */}
        {isReadOnly && (
          <div className="mb-4 p-3 bg-white rounded-lg flex items-center gap-2 shadow-sm border-l-4 border-blue-600 text-slate-700">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm">
              <strong>Modo visualização:</strong> Você está vendo apenas as suas requisições.
            </span>
          </div>
        )}

        {/* Stats Cards - O componente StatsCard geralmente já tem fundo branco.
            Se necessário,
