import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Package,
  Download,
  Paperclip,
  DollarSign,
  ShoppingCart,
  Users,
  CalendarDays,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { GastosDashboard } from '@/components/dashboard';
import { 
  RequisicaoTimeline, 
  BuyerSelector, 
  DeliveryDatePicker,
  ValueHistoryList 
} from '@/components/requisicao';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Requisicao, 
  RequisicaoStatus, 
  RequisicaoStats, 
  STATUS_CONFIG, 
  COMPRADORES,
  ValorHistorico 
} from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const AUTO_REFRESH_INTERVAL = 15000; // 15 seconds

export default function Painel() {
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  const [filteredRequisicoes, setFilteredRequisicoes] = useState<Requisicao[]>([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [compradorFilter, setCompradorFilter] = useState<string>('all');
  const [selectedRequisicao, setSelectedRequisicao] = useState<Requisicao | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [valorInput, setValorInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [valorHistory, setValorHistory] = useState<ValorHistorico[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user, profile, isStaff, isLoading: authLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not staff
  useEffect(() => {
    if (!authLoading && rolesLoaded) {
      if (user && !isStaff) {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar esta página.',
          variant: 'destructive',
        });
        navigate('/');
      }
      if (!user) {
        navigate('/auth');
      }
    }
  }, [authLoading, rolesLoaded, user, isStaff, navigate, toast]);

  // Fetch requisitions
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

      // Calculate stats
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
        if (req.status in newStats) {
          newStats[req.status as keyof RequisicaoStats]++;
        }
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching requisitions:', error);
      if (!silent) {
        toast({
          title: 'Erro',
          description: 'Falha ao carregar requisições.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    if (isStaff) {
      fetchRequisicoes();
    }
  }, [isStaff, fetchRequisicoes]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!isStaff) return;
    
    const interval = setInterval(() => {
      fetchRequisicoes(true);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isStaff, fetchRequisicoes]);

  // Fetch valor history when modal opens
  useEffect(() => {
    const fetchValorHistory = async () => {
      if (!selectedRequisicao) return;
      
      const { data, error } = await supabase
        .from('valor_historico')
        .select('*')
        .eq('requisicao_id', selectedRequisicao.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setValorHistory(data as ValorHistorico[]);
      }
    };

    if (isModalOpen && selectedRequisicao) {
      fetchValorHistory();
    }
  }, [isModalOpen, selectedRequisicao]);

  // Filter requisitions
  useEffect(() => {
    let filtered = [...requisicoes];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.item_nome.toLowerCase().includes(search) ||
          req.solicitante_nome.toLowerCase().includes(search) ||
          req.solicitante_email.toLowerCase().includes(search) ||
          req.protocolo?.toLowerCase().includes(search)
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    if (compradorFilter && compradorFilter !== 'all') {
      filtered = filtered.filter((req) => req.comprador_nome === compradorFilter);
    }

    setFilteredRequisicoes(filtered);
  }, [requisicoes, searchTerm, statusFilter, compradorFilter]);

  // Set valor input when modal opens
  useEffect(() => {
    if (selectedRequisicao) {
      setValorInput(selectedRequisicao.valor ? formatCurrencyInput(selectedRequisicao.valor) : '');
    }
  }, [selectedRequisicao]);

  // Format currency for display
  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Format currency for input
  const formatCurrencyInput = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Parse currency input
  const parseCurrencyInput = (value: string): number => {
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  // Handle valor input change with mask
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      const numValue = parseInt(value, 10) / 100;
      setValorInput(formatCurrencyInput(numValue));
    } else {
      setValorInput('');
    }
  };

  // Send notification email
  const sendNotification = async (req: Requisicao, newStatus: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: {
          to: req.solicitante_email,
          solicitante_nome: req.solicitante_nome,
          item_nome: req.item_nome,
          protocolo: req.protocolo,
          status: newStatus,
          comprador_nome: req.comprador_nome,
          previsao_entrega: req.previsao_entrega,
          motivo_rejeicao: req.motivo_rejeicao,
        },
      });

      if (error) {
        console.error('Failed to send notification:', error);
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  // Update status
  const updateStatus = async (id: string, newStatus: RequisicaoStatus, motivo?: string) => {
    try {
      setIsUpdating(true);

      const updateData: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'rejeitado' && motivo) {
        updateData.motivo_rejeicao = motivo;
      }

      if (newStatus === 'aprovado') {
        updateData.aprovado_em = new Date().toISOString();
        updateData.aprovado_por = profile?.id;
      }

      if (newStatus === 'comprado') {
        updateData.comprado_em = new Date().toISOString();
        updateData.comprador_id = profile?.id;
      }

      if (newStatus === 'recebido') {
        updateData.recebido_em = new Date().toISOString();
        updateData.entregue_em = new Date().toISOString();
      }

      const { error } = await supabase
        .from('requisicoes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Status atualizado para ${STATUS_CONFIG[newStatus].label}`,
      });

      // Send notification
      if (selectedRequisicao) {
        await sendNotification({ ...selectedRequisicao, ...updateData } as Requisicao, newStatus);
      }

      setIsModalOpen(false);
      setMotivoRejeicao('');
      fetchRequisicoes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar status.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Update comprador
  const updateComprador = async (id: string, compradorNome: string) => {
    try {
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          comprador_nome: compradorNome,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Comprador atualizado' });
      
      if (selectedRequisicao) {
        setSelectedRequisicao({ ...selectedRequisicao, comprador_nome: compradorNome });
      }
      
      fetchRequisicoes(true);
    } catch (error) {
      console.error('Error updating comprador:', error);
      toast({ title: 'Erro ao atualizar comprador', variant: 'destructive' });
    }
  };

  // Update previsao entrega
  const updatePrevisaoEntrega = async (id: string, date: string) => {
    try {
      // Convert empty string to null for database
      const previsaoValue = date && date.trim() !== '' ? date : null;
      
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          previsao_entrega: previsaoValue,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Previsão atualizada' });
      
      if (selectedRequisicao) {
        setSelectedRequisicao({ ...selectedRequisicao, previsao_entrega: previsaoValue });
      }
      
      fetchRequisicoes(true);
    } catch (error) {
      console.error('Error updating previsao:', error);
      toast({ title: 'Erro ao atualizar previsão', variant: 'destructive' });
    }
  };

  // Update valor with history tracking
  const updateValor = async (id: string) => {
    try {
      setIsUpdating(true);
      const valor = parseCurrencyInput(valorInput);
      const valorAnterior = selectedRequisicao?.valor;

      // Update requisicao
      const { error: updateError } = await supabase
        .from('requisicoes')
        .update({ valor, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      // Record history
      const { error: historyError } = await supabase
        .from('valor_historico')
        .insert({
          requisicao_id: id,
          valor_anterior: valorAnterior,
          valor_novo: valor,
          alterado_por: profile?.nome || 'Sistema',
        });

      if (historyError) {
        console.error('Failed to record valor history:', historyError);
      }

      toast({ title: 'Valor atualizado' });
      
      // Refresh history
      const { data: historyData } = await supabase
        .from('valor_historico')
        .select('*')
        .eq('requisicao_id', id)
        .order('created_at', { ascending: false });
      
      if (historyData) {
        setValorHistory(historyData as ValorHistorico[]);
      }
      
      if (selectedRequisicao) {
        setSelectedRequisicao({ ...selectedRequisicao, valor });
      }
      
      fetchRequisicoes(true);
    } catch (error) {
      console.error('Error updating valor:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar valor.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const canEditValor = (status: RequisicaoStatus) => {
    return ['cotando', 'comprado', 'em_entrega', 'recebido'].includes(status);
  };

  const getDeliveryStatus = (previsao: string | undefined) => {
    if (!previsao) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(previsao);
    delivery.setHours(0, 0, 0, 0);
    const diff = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'overdue';
    if (diff <= 3) return 'warning';
    return 'ontime';
  };

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

      <main className="page-container">
        {/* Stats - Redesigned */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          <StatsCard 
            title="Total" 
            value={stats.total} 
            icon={FileText}
            className="col-span-1"
          />
          <StatsCard 
            title="Pendentes" 
            value={stats.pendente} 
            variant="warning" 
            icon={Clock}
          />
          <StatsCard 
            title="Em Análise" 
            value={stats.em_analise} 
            variant="info" 
            icon={TrendingUp}
          />
          <StatsCard 
            title="Aprovados" 
            value={stats.aprovado} 
            variant="success" 
            icon={CheckCircle}
          />
          <StatsCard 
            title="Cotando" 
            value={stats.cotando} 
            variant="primary" 
            icon={Package}
          />
          <StatsCard 
            title="Comprados" 
            value={stats.comprado} 
            variant="success" 
            icon={ShoppingCart}
          />
          <StatsCard 
            title="Rejeitados" 
            value={stats.rejeitado} 
            variant="danger" 
            icon={XCircle}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requisicoes" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="requisicoes" className="gap-2">
              <FileText className="w-4 h-4" />
              Requisições
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Dashboard de Gastos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requisicoes" className="space-y-6">
            {/* Filters */}
            <div className="bg-card rounded-xl border p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por item, solicitante ou protocolo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-44">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-lg">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                          {config.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={compradorFilter} onValueChange={setCompradorFilter}>
                  <SelectTrigger className="w-full lg:w-44">
                    <SelectValue placeholder="Todos Compradores" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-lg">
                    <SelectItem value="all">Todos Compradores</SelectItem>
                    {COMPRADORES.map((c) => (
                      <SelectItem key={c.id} value={c.nome}>
                        <span className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {c.nome}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => fetchRequisicoes()} 
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="spinner w-10 h-10 mx-auto mb-4 border-primary" />
                  <p className="text-muted-foreground">Carregando requisições...</p>
                </div>
              ) : filteredRequisicoes.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold">Nenhuma requisição encontrada</p>
                  <p className="text-muted-foreground text-sm">
                    {searchTerm || statusFilter !== 'all' || compradorFilter !== 'all'
                      ? 'Tente ajustar os filtros'
                      : 'As requisições aparecerão aqui'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>Item</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-center">Prioridade</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Comprador</TableHead>
                        <TableHead className="text-center">Previsão</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-center">Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequisicoes.map((req) => {
                        const deliveryStatus = getDeliveryStatus(req.previsao_entrega);
                        
                        return (
                          <TableRow 
                            key={req.id} 
                            className="hover:bg-primary/5 transition-colors cursor-pointer group"
                            onClick={() => {
                              setSelectedRequisicao(req);
                              setIsModalOpen(true);
                            }}
                          >
                            <TableCell>
                              <div>
                                <p className="font-semibold group-hover:text-primary transition-colors">
                                  {req.item_nome}
                                </p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {req.protocolo}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{req.solicitante_nome}</p>
                                <p className="text-xs text-muted-foreground">{req.solicitante_setor}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="font-semibold">{req.quantidade}</span>
                              <span className="text-muted-foreground text-xs ml-1">{req.unidade}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <PriorityBadge priority={req.prioridade} />
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[req.status].dotColor}`} />
                                <StatusBadge status={req.status} />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {req.comprador_nome ? (
                                <span className="text-sm font-medium">{req.comprador_nome}</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {req.previsao_entrega ? (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  deliveryStatus === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                                  deliveryStatus === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                }`}>
                                  {formatDate(req.previsao_entrega)}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(req.valor)}
                            </TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground">
                              {formatDate(req.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRequisicao(req);
                                  setIsModalOpen(true);
                                }}
                              >
                                Ver →
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <GastosDashboard requisicoes={requisicoes} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Enhanced Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detalhes da Requisição
            </DialogTitle>
          </DialogHeader>

          {selectedRequisicao && (
            <div className="space-y-6">
              {/* Protocol & Status Header */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">Protocolo</p>
                  <p className="text-xl font-bold font-mono">{selectedRequisicao.protocolo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${STATUS_CONFIG[selectedRequisicao.status].dotColor}`} />
                  <StatusBadge status={selectedRequisicao.status} />
                </div>
              </div>

              {/* Timeline */}
              <RequisicaoTimeline requisicao={selectedRequisicao} />

              <Separator />

              {/* Item Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Item</p>
                  <p className="font-semibold">{selectedRequisicao.item_nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantidade</p>
                  <p className="font-semibold">
                    {selectedRequisicao.quantidade} {selectedRequisicao.unidade}
                  </p>
                </div>
              </div>

              {/* Solicitante */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Solicitante</p>
                  <p className="font-semibold">{selectedRequisicao.solicitante_nome}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequisicao.solicitante_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Setor</p>
                  <p className="font-semibold">{selectedRequisicao.solicitante_setor}</p>
                </div>
              </div>

              {/* Justificativa */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Justificativa</p>
                <p className="p-3 bg-muted rounded-lg text-sm">{selectedRequisicao.justificativa}</p>
              </div>

              {/* Especificações Técnicas */}
              {selectedRequisicao.especificacoes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Especificações Técnicas</p>
                  <p className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">{selectedRequisicao.especificacoes}</p>
                </div>
              )}

              {/* Anexo */}
              {selectedRequisicao.arquivo_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Anexo</p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await fetch(selectedRequisicao.arquivo_url!);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = selectedRequisicao.arquivo_nome || 'arquivo';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        window.open(selectedRequisicao.arquivo_url!, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="inline-flex items-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                    {selectedRequisicao.arquivo_nome || 'Baixar arquivo'}
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Priority & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prioridade</p>
                  <PriorityBadge priority={selectedRequisicao.prioridade} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Criada em</p>
                  <p className="font-semibold">{formatDate(selectedRequisicao.created_at)}</p>
                </div>
              </div>

              <Separator />

              {/* Comprador & Previsão - Only for approved+ statuses */}
              {!['pendente', 'rejeitado', 'cancelado'].includes(selectedRequisicao.status) && (
                <div className="grid grid-cols-2 gap-4">
                  <BuyerSelector
                    value={selectedRequisicao.comprador_nome}
                    onChange={(value) => updateComprador(selectedRequisicao.id, value)}
                  />
                  <DeliveryDatePicker
                    value={selectedRequisicao.previsao_entrega}
                    onChange={(value) => updatePrevisaoEntrega(selectedRequisicao.id, value)}
                  />
                </div>
              )}

              {/* Valor Section */}
              {canEditValor(selectedRequisicao.status) && (
                <div className="border-t pt-4 space-y-4">
                  <Label htmlFor="valor" className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valor do Pedido (R$)
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                      <Input
                        id="valor"
                        value={valorInput}
                        onChange={handleValorChange}
                        placeholder="0,00"
                        className="pl-10"
                      />
                    </div>
                    <Button
                      onClick={() => updateValor(selectedRequisicao.id)}
                      isLoading={isUpdating}
                      disabled={!valorInput}
                    >
                      Salvar
                    </Button>
                  </div>
                  {selectedRequisicao.valor != null && valorInput !== formatCurrencyInput(selectedRequisicao.valor) && (
                    <p className="text-xs text-muted-foreground">
                      Valor atual: {formatCurrency(selectedRequisicao.valor)}
                    </p>
                  )}
                  
                  {/* Valor History */}
                  <ValueHistoryList history={valorHistory} />
                </div>
              )}

              {/* Display valor for other statuses */}
              {!canEditValor(selectedRequisicao.status) && selectedRequisicao.valor != null && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Valor do Pedido</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(selectedRequisicao.valor)}</p>
                </div>
              )}

              {/* Reject reason input */}
              {selectedRequisicao.status === 'pendente' && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold mb-2">Motivo da Rejeição (se aplicável)</p>
                  <Textarea
                    value={motivoRejeicao}
                    onChange={(e) => setMotivoRejeicao(e.target.value)}
                    placeholder="Informe o motivo caso vá rejeitar..."
                    rows={2}
                  />
                </div>
              )}

              {/* Actions */}
              {selectedRequisicao.status === 'pendente' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    variant="success"
                    onClick={() => updateStatus(selectedRequisicao.id, 'aprovado')}
                    isLoading={isUpdating}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => {
                      if (!motivoRejeicao.trim()) {
                        toast({
                          title: 'Atenção',
                          description: 'Informe o motivo da rejeição',
                          variant: 'destructive',
                        });
                        return;
                      }
                      updateStatus(selectedRequisicao.id, 'rejeitado', motivoRejeicao);
                    }}
                    isLoading={isUpdating}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              )}

              {selectedRequisicao.status === 'aprovado' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => updateStatus(selectedRequisicao.id, 'cotando')}
                    isLoading={isUpdating}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Iniciar Cotação
                  </Button>
                </div>
              )}

              {selectedRequisicao.status === 'cotando' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    variant="success"
                    onClick={() => updateStatus(selectedRequisicao.id, 'comprado')}
                    isLoading={isUpdating}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Marcar como Comprado
                  </Button>
                </div>
              )}

              {selectedRequisicao.status === 'comprado' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => updateStatus(selectedRequisicao.id, 'em_entrega')}
                    isLoading={isUpdating}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Marcar em Entrega
                  </Button>
                </div>
              )}

              {selectedRequisicao.status === 'em_entrega' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    variant="success"
                    onClick={() => updateStatus(selectedRequisicao.id, 'recebido')}
                    isLoading={isUpdating}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Entrega
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
