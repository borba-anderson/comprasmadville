import { useEffect, useState } from 'react';
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
  AlertTriangle,
  ExternalLink,
  Paperclip,
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
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Requisicao, RequisicaoStatus, RequisicaoStats, STATUS_CONFIG } from '@/types';
import { Textarea } from '@/components/ui/textarea';

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
  const [selectedRequisicao, setSelectedRequisicao] = useState<Requisicao | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const { user, profile, isStaff, isLoading: authLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
 
  // Redirect if not staff - wait for auth and roles to load
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
  const fetchRequisicoes = async () => {
    try {
      setIsLoading(true);
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
      toast({
        title: 'Erro',
        description: 'Falha ao carregar requisições.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isStaff) {
      fetchRequisicoes();
    }
  }, [isStaff]);

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

    setFilteredRequisicoes(filtered);
  }, [requisicoes, searchTerm, statusFilter]);

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

      const { error } = await supabase
        .from('requisicoes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Status atualizado para ${STATUS_CONFIG[newStatus].label}`,
      });

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatsCard title="Total" value={stats.total} icon={FileText} />
          <StatsCard title="Pendentes" value={stats.pendente} variant="warning" icon={Clock} />
          <StatsCard title="Em Análise" value={stats.em_analise} variant="info" icon={TrendingUp} />
          <StatsCard title="Aprovados" value={stats.aprovado} variant="success" icon={CheckCircle} />
          <StatsCard title="Cotando" value={stats.cotando} variant="primary" icon={Package} />
          <StatsCard title="Comprados" value={stats.comprado} variant="success" icon={CheckCircle} />
          <StatsCard title="Rejeitados" value={stats.rejeitado} variant="danger" icon={XCircle} />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
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
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.icon} {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchRequisicoes} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
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
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'As requisições aparecerão aqui'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Item</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-center">Prioridade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequisicoes.map((req) => (
                  <TableRow key={req.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-semibold">{req.item_nome}</p>
                        <p className="text-xs text-muted-foreground">{req.protocolo}</p>
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
                      <span className="text-muted-foreground text-sm ml-1">{req.unidade}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <PriorityBadge priority={req.prioridade} />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {formatDate(req.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRequisicao(req);
                          setIsModalOpen(true);
                        }}
                      >
                        Ver detalhes →
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detalhes da Requisição
            </DialogTitle>
          </DialogHeader>

          {selectedRequisicao && (
            <div className="space-y-6">
              {/* Protocol & Status */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Protocolo</p>
                  <p className="text-xl font-bold font-mono">{selectedRequisicao.protocolo}</p>
                </div>
                <StatusBadge status={selectedRequisicao.status} />
              </div>

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

              {/* Anexo */}
              {selectedRequisicao.arquivo_url && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Anexo</p>
                  <a
                    href={selectedRequisicao.arquivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                    {selectedRequisicao.arquivo_nome || 'Abrir arquivo'}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Priority & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Prioridade</p>
                  <PriorityBadge priority={selectedRequisicao.prioridade} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-semibold">{formatDate(selectedRequisicao.created_at)}</p>
                </div>
              </div>

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
                    Marcar como Comprado
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
