import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, FileText, CheckCircle, XCircle, Package, ShoppingCart, Truck, 
  DollarSign, Paperclip, Download, Mail, Loader2, MessageCircle, 
  StickyNote, Wallet, ChevronRight, Home, Pencil, Check, X, Upload, Trash2,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Header } from '@/components/layout/Header';
import { RequisicaoTimeline, BuyerSelector, FornecedorSelector, DeliveryDatePicker, ValueHistoryList } from '@/components/requisicao';
import { Requisicao, RequisicaoStatus, STATUS_CONFIG, ValorHistorico } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MANUAL_STATUS_OPTIONS: RequisicaoStatus[] = [
  'pendente',
  'em_analise',
  'aprovado',
  'cotando',
  'comprado',
  'em_entrega',
  'recebido',
];

export default function RequisicaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isStaff } = useAuth();
  const { toast } = useToast();
  
  const readOnly = !isStaff;
  const profileNome = profile?.nome;
  const profileId = profile?.id;

  const [requisicao, setRequisicao] = useState<Requisicao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [valorInput, setValorInput] = useState('');
  const [valorOrcadoInput, setValorOrcadoInput] = useState('');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [valorHistory, setValorHistory] = useState<ValorHistorico[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [observacaoComprador, setObservacaoComprador] = useState('');
  const [centroCustoInput, setCentroCustoInput] = useState('');
  const [isDeletingAnexo, setIsDeletingAnexo] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Inline editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editItemNome, setEditItemNome] = useState('');
  const [editQuantidade, setEditQuantidade] = useState('');
  const [editJustificativa, setEditJustificativa] = useState('');
  const [editEspecificacoes, setEditEspecificacoes] = useState('');
  
  // Orcamento upload
  const [isUploadingOrcamento, setIsUploadingOrcamento] = useState(false);
  const orcamentoInputRef = useRef<HTMLInputElement>(null);

  const isAnyLoading = isUpdating || isDeletingAnexo || isCanceling || isDeleting || isUploadingOrcamento;

  const fetchRequisicao = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('requisicoes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setRequisicao(data as Requisicao);
    } catch (error) {
      console.error('Error fetching requisicao:', error);
      toast({ title: 'Erro ao carregar requisição', variant: 'destructive' });
      navigate('/painel');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    fetchRequisicao();
  }, [fetchRequisicao]);

  useEffect(() => {
    const fetchValorHistory = async () => {
      if (!requisicao) return;
      
      const { data, error } = await supabase
        .from('valor_historico')
        .select('*')
        .eq('requisicao_id', requisicao.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setValorHistory(data as ValorHistorico[]);
      }
    };

    if (requisicao) {
      fetchValorHistory();
      setValorInput(requisicao.valor ? formatCurrencyInput(requisicao.valor) : '');
      setValorOrcadoInput(requisicao.valor_orcado ? formatCurrencyInput(requisicao.valor_orcado) : '');
      setMotivoRejeicao('');
      setObservacaoComprador(requisicao.observacao_comprador || '');
      setCentroCustoInput(requisicao.centro_custo || '');
    }
  }, [requisicao]);

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatCurrencyInput = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const parseCurrencyInput = (value: string): number => {
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      const numValue = parseInt(value, 10) / 100;
      setValorInput(formatCurrencyInput(numValue));
    } else {
      setValorInput('');
    }
  };

  const handleValorOrcadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      const numValue = parseInt(value, 10) / 100;
      setValorOrcadoInput(formatCurrencyInput(numValue));
    } else {
      setValorOrcadoInput('');
    }
  };

  const calculateEconomia = (valorOrcado: number | null | undefined, valorFinal: number | null | undefined) => {
    if (!valorOrcado || valorOrcado <= 0 || !valorFinal) return null;
    const economia = valorOrcado - valorFinal;
    const percentual = (economia / valorOrcado) * 100;
    return { valor: economia, percentual };
  };

  const parseDateString = (dateString: string): Date => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(dateString);
  };

  const formatDate = (dateString: string) => {
    return parseDateString(dateString).toLocaleDateString('pt-BR');
  };

  const sendNotification = async (req: Requisicao, newStatus: string) => {
    try {
      await supabase.functions.invoke('send-notification', {
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
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const updateStatus = async (newStatus: RequisicaoStatus, motivo?: string) => {
    if (!requisicao) return;
    
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
        updateData.aprovado_por = profileId;
      }

      if (newStatus === 'comprado') {
        updateData.comprado_em = new Date().toISOString();
        updateData.comprador_id = profileId;
      }

      if (newStatus === 'recebido') {
        updateData.recebido_em = new Date().toISOString();
        updateData.entregue_em = new Date().toISOString();
      }

      const { error } = await supabase
        .from('requisicoes')
        .update(updateData)
        .eq('id', requisicao.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Status atualizado para ${STATUS_CONFIG[newStatus].label}`,
      });

      await sendNotification({ ...requisicao, ...updateData } as Requisicao, newStatus);
      await fetchRequisicao();
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

  const updateComprador = async (compradorNome: string) => {
    if (!requisicao) return;
    
    try {
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          comprador_nome: compradorNome,
          updated_at: new Date().toISOString() 
        })
        .eq('id', requisicao.id);

      if (error) throw error;
      toast({ title: 'Comprador atualizado' });
      await fetchRequisicao();
    } catch (error) {
      console.error('Error updating comprador:', error);
      toast({ title: 'Erro ao atualizar comprador', variant: 'destructive' });
    }
  };

  const updateFornecedor = async (fornecedorNome: string) => {
    if (!requisicao) return;
    
    try {
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          fornecedor_nome: fornecedorNome || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', requisicao.id);

      if (error) throw error;
      toast({ title: 'Fornecedor atualizado' });
      await fetchRequisicao();
    } catch (error) {
      console.error('Error updating fornecedor:', error);
      toast({ title: 'Erro ao atualizar fornecedor', variant: 'destructive' });
    }
  };

  const updatePrevisaoEntrega = async (date: string) => {
    if (!requisicao) return;
    
    try {
      const previsaoValue = date && date.trim() !== '' ? date : null;
      
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          previsao_entrega: previsaoValue,
          updated_at: new Date().toISOString() 
        })
        .eq('id', requisicao.id);

      if (error) throw error;
      toast({ title: 'Previsão atualizada' });
      await fetchRequisicao();
    } catch (error) {
      console.error('Error updating previsao:', error);
      toast({ title: 'Erro ao atualizar previsão', variant: 'destructive' });
    }
  };

  const updateValor = async () => {
    if (!requisicao) return;
    
    try {
      setIsUpdating(true);
      const valor = parseCurrencyInput(valorInput);
      const valorOrcado = valorOrcadoInput ? parseCurrencyInput(valorOrcadoInput) : null;
      const valorAnterior = requisicao.valor;

      const { error: updateError } = await supabase
        .from('requisicoes')
        .update({ 
          valor, 
          valor_orcado: valorOrcado,
          updated_at: new Date().toISOString() 
        })
        .eq('id', requisicao.id);

      if (updateError) throw updateError;

      await supabase.from('valor_historico').insert({
        requisicao_id: requisicao.id,
        valor_anterior: valorAnterior,
        valor_novo: valor,
        alterado_por: profileNome || 'Sistema',
      });

      toast({ title: 'Valores atualizados' });
      
      const { data: historyData } = await supabase
        .from('valor_historico')
        .select('*')
        .eq('requisicao_id', requisicao.id)
        .order('created_at', { ascending: false });
      
      if (historyData) {
        setValorHistory(historyData as ValorHistorico[]);
      }
      
      await fetchRequisicao();
    } catch (error) {
      console.error('Error updating valor:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar valores.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateObservacaoComprador = async () => {
    if (!requisicao) return;
    
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          observacao_comprador: observacaoComprador || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', requisicao.id);

      if (error) throw error;
      toast({ title: 'Observação atualizada' });
      await fetchRequisicao();
    } catch (error) {
      console.error('Error updating observacao:', error);
      toast({ title: 'Erro ao atualizar observação', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCentroCusto = async () => {
    if (!requisicao) return;
    
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          centro_custo: centroCustoInput || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', requisicao.id);

      if (error) throw error;
      toast({ title: 'Centro de custo atualizado' });
      await fetchRequisicao();
    } catch (error) {
      console.error('Error updating centro_custo:', error);
      toast({ title: 'Erro ao atualizar centro de custo', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const sendEmailToSolicitante = async () => {
    if (!requisicao) return;
    await sendNotification(requisicao, requisicao.status);
    toast({ title: 'E-mail enviado ao solicitante' });
  };

  const sendWhatsAppToSolicitante = () => {
    if (!requisicao || !requisicao.solicitante_telefone) {
      toast({ title: 'Telefone não cadastrado', variant: 'destructive' });
      return;
    }
    
    const phone = requisicao.solicitante_telefone.replace(/\D/g, '');
    const phoneWithCountry = phone.startsWith('55') ? phone : `55${phone}`;
    
    const statusLabel = STATUS_CONFIG[requisicao.status]?.label || requisicao.status;
    const previsao = requisicao.previsao_entrega 
      ? `\n📅 Previsão de entrega: ${formatDate(requisicao.previsao_entrega)}` 
      : '';
    const comprador = requisicao.comprador_nome 
      ? `\n👤 Comprador: ${requisicao.comprador_nome}` 
      : '';
    const valor = requisicao.valor 
      ? `\n💰 Valor: ${formatCurrency(requisicao.valor)}` 
      : '';
    
    const message = `Olá ${requisicao.solicitante_nome}! 👋

Atualização da sua requisição:

📋 *Protocolo:* ${requisicao.protocolo}
📦 *Item:* ${requisicao.item_nome}
📊 *Status:* ${statusLabel}${comprador}${previsao}${valor}

Qualquer dúvida, estamos à disposição!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast({ title: 'WhatsApp aberto' });
  };

  // Inline editing functions
  const startEditing = (field: string) => {
    if (!requisicao || readOnly) return;
    setEditingField(field);
    switch (field) {
      case 'item_nome':
        setEditItemNome(requisicao.item_nome);
        break;
      case 'quantidade':
        setEditQuantidade(String(requisicao.quantidade));
        break;
      case 'justificativa':
        setEditJustificativa(requisicao.justificativa);
        break;
      case 'especificacoes':
        setEditEspecificacoes(requisicao.especificacoes || '');
        break;
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
  };

  const saveInlineEdit = async (field: string) => {
    if (!requisicao) return;
    
    try {
      setIsUpdating(true);
      let updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      
      switch (field) {
        case 'item_nome':
          if (!editItemNome.trim()) {
            toast({ title: 'Nome do item é obrigatório', variant: 'destructive' });
            return;
          }
          updateData.item_nome = editItemNome.trim();
          break;
        case 'quantidade':
          const qty = parseFloat(editQuantidade);
          if (isNaN(qty) || qty <= 0) {
            toast({ title: 'Quantidade inválida', variant: 'destructive' });
            return;
          }
          updateData.quantidade = qty;
          break;
        case 'justificativa':
          if (!editJustificativa.trim()) {
            toast({ title: 'Justificativa é obrigatória', variant: 'destructive' });
            return;
          }
          updateData.justificativa = editJustificativa.trim();
          break;
        case 'especificacoes':
          updateData.especificacoes = editEspecificacoes.trim() || null;
          break;
      }

      const { error } = await supabase
        .from('requisicoes')
        .update(updateData)
        .eq('id', requisicao.id);

      if (error) throw error;
      
      toast({ title: 'Atualizado com sucesso' });
      setEditingField(null);
      await fetchRequisicao();
    } catch (error) {
      console.error('Error saving inline edit:', error);
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Orcamento upload functions
  const handleOrcamentoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!requisicao || !e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast({ 
          title: 'Tipo de arquivo não permitido', 
          description: 'Apenas PDF, JPG, PNG e Excel são aceitos.',
          variant: 'destructive' 
        });
        return;
      }
    }
    
    try {
      setIsUploadingOrcamento(true);
      
      const existingUrls = requisicao.orcamento_url ? requisicao.orcamento_url.split(',').map(u => u.trim()) : [];
      const existingNomes = requisicao.orcamento_nome ? requisicao.orcamento_nome.split(',').map(n => n.trim()) : [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${requisicao.id}/orcamento_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('requisicoes-anexos')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('requisicoes-anexos')
          .getPublicUrl(fileName);
        
        existingUrls.push(urlData.publicUrl);
        existingNomes.push(file.name);
      }
      
      const { error: updateError } = await supabase
        .from('requisicoes')
        .update({
          orcamento_url: existingUrls.join(','),
          orcamento_nome: existingNomes.join(','),
          updated_at: new Date().toISOString()
        })
        .eq('id', requisicao.id);
      
      if (updateError) throw updateError;
      
      toast({ title: 'Orçamento anexado com sucesso' });
      await fetchRequisicao();
    } catch (error) {
      console.error('Error uploading orcamento:', error);
      toast({ title: 'Erro ao anexar orçamento', variant: 'destructive' });
    } finally {
      setIsUploadingOrcamento(false);
      if (orcamentoInputRef.current) {
        orcamentoInputRef.current.value = '';
      }
    }
  };

  const deleteOrcamentoFile = async (index: number) => {
    if (!requisicao || !requisicao.orcamento_url) return;
    
    try {
      setIsDeletingAnexo(true);
      
      const urls = requisicao.orcamento_url.split(',').map(u => u.trim());
      const nomes = requisicao.orcamento_nome ? requisicao.orcamento_nome.split(',').map(n => n.trim()) : [];
      
      // Extract file path from URL for deletion
      const urlToDelete = urls[index];
      const urlPath = new URL(urlToDelete).pathname;
      const filePath = urlPath.split('/requisicoes-anexos/')[1];
      
      if (filePath) {
        await supabase.storage.from('requisicoes-anexos').remove([filePath]);
      }
      
      urls.splice(index, 1);
      nomes.splice(index, 1);
      
      const { error } = await supabase
        .from('requisicoes')
        .update({
          orcamento_url: urls.length > 0 ? urls.join(',') : null,
          orcamento_nome: nomes.length > 0 ? nomes.join(',') : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', requisicao.id);
      
      if (error) throw error;
      
      toast({ title: 'Arquivo removido' });
      await fetchRequisicao();
    } catch (error) {
      console.error('Error deleting orcamento file:', error);
      toast({ title: 'Erro ao remover arquivo', variant: 'destructive' });
    } finally {
      setIsDeletingAnexo(false);
    }
  };

  const canEditValor = (status: RequisicaoStatus) => {
    return ['cotando', 'comprado', 'em_entrega', 'recebido'].includes(status);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#107c50]">
        <div className="bg-white sticky top-0 z-50 shadow-sm text-slate-900 [&_*]:text-slate-900">
          <Header />
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </div>
    );
  }

  if (!requisicao) {
    return (
      <div className="min-h-screen bg-[#107c50]">
        <div className="bg-white sticky top-0 z-50 shadow-sm text-slate-900 [&_*]:text-slate-900">
          <Header />
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-white">
          <FileText className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">Requisição não encontrada</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/painel')}>
            Voltar ao Painel
          </Button>
        </div>
      </div>
    );
  }

  const economia = calculateEconomia(requisicao.valor_orcado, requisicao.valor);

  return (
    <div className="min-h-screen bg-[#107c50]">
      {/* Loading Overlay */}
      {isAnyLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Atualizando...</span>
          </div>
        </div>
      )}

      <div className="bg-white sticky top-0 z-40 shadow-sm text-slate-900 [&_*]:text-slate-900">
        <Header />
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-white/70 hover:text-white flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Início
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/50">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/painel" className="text-white/70 hover:text-white">
                  Painel
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white/50">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium">
                {requisicao.protocolo}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button & Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/painel')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Requisição</h1>
              <span className="font-mono text-white/80 text-lg">{requisicao.protocolo}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('w-3 h-3 rounded-full', STATUS_CONFIG[requisicao.status].dotColor)} />
            <StatusBadge status={requisicao.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Linha do Tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <RequisicaoTimeline 
                  requisicao={requisicao} 
                  onRevertStatus={readOnly ? undefined : updateStatus}
                  isUpdating={isUpdating}
                />
              </CardContent>
            </Card>

            {/* Item Info */}
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informações do Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Item Nome - Editable */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Item</Label>
                  {editingField === 'item_nome' ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={editItemNome}
                        onChange={(e) => setEditItemNome(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" onClick={() => saveInlineEdit('item_nome')} disabled={isUpdating}>
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEditing}>
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <p className="font-semibold text-lg flex-1">{requisicao.item_nome}</p>
                      {!readOnly && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditing('item_nome')}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantidade - Editable */}
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Quantidade</Label>
                    {editingField === 'quantidade' ? (
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          value={editQuantidade}
                          onChange={(e) => setEditQuantidade(e.target.value)}
                          type="number"
                          min="1"
                          className="flex-1"
                          autoFocus
                        />
                        <Button size="icon" variant="ghost" onClick={() => saveInlineEdit('quantidade')} disabled={isUpdating}>
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEditing}>
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <p className="font-semibold flex-1">{requisicao.quantidade} {requisicao.unidade}</p>
                        {!readOnly && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => startEditing('quantidade')}
                          >
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Prioridade</Label>
                    <div className="mt-1">
                      <PriorityBadge priority={requisicao.prioridade} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Justificativa - Editable */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Justificativa</Label>
                  {editingField === 'justificativa' ? (
                    <div className="mt-1 space-y-2">
                      <Textarea
                        value={editJustificativa}
                        onChange={(e) => setEditJustificativa(e.target.value)}
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={cancelEditing}>
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={() => saveInlineEdit('justificativa')} disabled={isUpdating}>
                          <Check className="w-4 h-4 mr-1" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <p className="text-sm bg-muted/50 rounded-lg p-3 mt-1">{requisicao.justificativa}</p>
                      {!readOnly && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditing('justificativa')}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Especificações - Editable */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Especificações</Label>
                  {editingField === 'especificacoes' ? (
                    <div className="mt-1 space-y-2">
                      <Textarea
                        value={editEspecificacoes}
                        onChange={(e) => setEditEspecificacoes(e.target.value)}
                        rows={3}
                        placeholder="Adicionar especificações..."
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={cancelEditing}>
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={() => saveInlineEdit('especificacoes')} disabled={isUpdating}>
                          <Check className="w-4 h-4 mr-1" />
                          Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      {requisicao.especificacoes ? (
                        <p className="text-sm bg-muted/50 rounded-lg p-3 mt-1 whitespace-pre-wrap">{requisicao.especificacoes}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 mt-1 italic">
                          Sem especificações
                        </p>
                      )}
                      {!readOnly && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => startEditing('especificacoes')}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Anexos do Solicitante */}
            {requisicao.arquivo_url && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    Anexos ({requisicao.arquivo_url.split(',').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {requisicao.arquivo_url.split(',').map((url, index) => {
                      const nomes = requisicao.arquivo_nome?.split(',') || [];
                      const nome = nomes[index] || `arquivo-${index + 1}`;
                      const trimmedUrl = url.trim();
                      
                      return (
                        <a
                          key={index}
                          href={trimmedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary transition-colors"
                        >
                          <Paperclip className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate flex-1">{nome}</span>
                          <Download className="w-4 h-4 flex-shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Orçamentos do Comprador */}
            {!readOnly && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Orçamentos
                    {requisicao.orcamento_url && (
                      <span className="text-sm font-normal text-muted-foreground">
                        ({requisicao.orcamento_url.split(',').length})
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Lista de orçamentos existentes */}
                  {requisicao.orcamento_url && (
                    <div className="space-y-2">
                      {requisicao.orcamento_url.split(',').map((url, index) => {
                        const nomes = requisicao.orcamento_nome?.split(',') || [];
                        const nome = nomes[index] || `orcamento-${index + 1}`;
                        const trimmedUrl = url.trim();
                        
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-sm"
                          >
                            <Receipt className="w-4 h-4 flex-shrink-0 text-amber-600" />
                            <a
                              href={trimmedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate flex-1 font-medium text-amber-700 hover:underline"
                            >
                              {nome}
                            </a>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteOrcamentoFile(index)}
                              disabled={isDeletingAnexo}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Upload button */}
                  <div>
                    <input
                      ref={orcamentoInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
                      multiple
                      onChange={handleOrcamentoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => orcamentoInputRef.current?.click()}
                      disabled={isUploadingOrcamento}
                    >
                      {isUploadingOrcamento ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Anexar Orçamento
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      PDF, JPG, PNG ou Excel
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Display orcamento for read-only users */}
            {readOnly && requisicao.orcamento_url && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Orçamentos ({requisicao.orcamento_url.split(',').length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {requisicao.orcamento_url.split(',').map((url, index) => {
                      const nomes = requisicao.orcamento_nome?.split(',') || [];
                      const nome = nomes[index] || `orcamento-${index + 1}`;
                      const trimmedUrl = url.trim();
                      
                      return (
                        <a
                          key={index}
                          href={trimmedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg text-sm font-medium text-amber-700 transition-colors"
                        >
                          <Receipt className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate flex-1">{nome}</span>
                          <Download className="w-4 h-4 flex-shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Solicitante */}
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Solicitante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium">{requisicao.solicitante_nome}</p>
                  <p className="text-sm text-muted-foreground">{requisicao.solicitante_email}</p>
                  {requisicao.solicitante_telefone && (
                    <p className="text-sm text-muted-foreground">{requisicao.solicitante_telefone}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Setor: {requisicao.solicitante_setor}</p>
                  {requisicao.solicitante_empresa && (
                    <p className="text-sm text-muted-foreground font-medium">Empresa: {requisicao.solicitante_empresa}</p>
                  )}
                </div>
                {!readOnly && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={sendEmailToSolicitante}>
                      <Mail className="w-4 h-4" />
                      E-mail
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" 
                      onClick={sendWhatsAppToSolicitante}
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Centro de Custo */}
            {!readOnly && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Centro de Custo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      value={centroCustoInput}
                      onChange={(e) => setCentroCustoInput(e.target.value)}
                      placeholder="Ex: CC-001"
                      className="flex-1"
                    />
                    <Button 
                      onClick={updateCentroCusto} 
                      disabled={isUpdating || centroCustoInput === (requisicao.centro_custo || '')}
                      size="sm"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comprador & Fornecedor */}
            {!readOnly && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Atribuição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BuyerSelector
                    value={requisicao.comprador_nome}
                    onChange={updateComprador}
                  />
                  <FornecedorSelector
                    value={requisicao.fornecedor_nome}
                    onChange={updateFornecedor}
                  />
                  <DeliveryDatePicker
                    value={requisicao.previsao_entrega}
                    onChange={updatePrevisaoEntrega}
                  />
                </CardContent>
              </Card>
            )}

            {/* Valores */}
            {!readOnly && canEditValor(requisicao.status) && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Valores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Valor Orçado</Label>
                      <Input
                        value={valorOrcadoInput}
                        onChange={handleValorOrcadoChange}
                        placeholder="0,00"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Valor Final</Label>
                      <Input
                        value={valorInput}
                        onChange={handleValorChange}
                        placeholder="0,00"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {economia && (
                    <div className={cn(
                      'p-3 rounded-lg text-sm',
                      economia.valor >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    )}>
                      <p className="font-medium">
                        {economia.valor >= 0 ? 'Economia: ' : 'Excedente: '}
                        {formatCurrency(Math.abs(economia.valor))} ({economia.percentual.toFixed(1)}%)
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={updateValor} 
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Atualizar Valores
                  </Button>

                  {valorHistory.length > 0 && (
                    <ValueHistoryList history={valorHistory} />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Observações */}
            {!readOnly && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <StickyNote className="w-5 h-5" />
                    Observações do Comprador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={observacaoComprador}
                    onChange={(e) => setObservacaoComprador(e.target.value)}
                    placeholder="Notas internas sobre esta requisição..."
                    rows={3}
                  />
                  <Button 
                    onClick={updateObservacaoComprador} 
                    disabled={isUpdating || observacaoComprador === (requisicao.observacao_comprador || '')}
                    className="w-full"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Salvar Observação
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Ações Rápidas */}
            {!readOnly && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requisicao.status === 'pendente' && (
                    <>
                      <div className="space-y-2">
                        <Textarea
                          value={motivoRejeicao}
                          onChange={(e) => setMotivoRejeicao(e.target.value)}
                          placeholder="Motivo da rejeição (obrigatório para rejeitar)"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant="success"
                          onClick={() => updateStatus('aprovado')}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          className="flex-1"
                          variant="destructive"
                          onClick={() => {
                            if (!motivoRejeicao.trim()) {
                              toast({ title: 'Informe o motivo da rejeição', variant: 'destructive' });
                              return;
                            }
                            updateStatus('rejeitado', motivoRejeicao);
                          }}
                          disabled={isUpdating}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    </>
                  )}

                  {requisicao.status === 'em_analise' && (
                    <>
                      <div className="space-y-2">
                        <Textarea
                          value={motivoRejeicao}
                          onChange={(e) => setMotivoRejeicao(e.target.value)}
                          placeholder="Motivo da rejeição (obrigatório para rejeitar)"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          variant="success"
                          onClick={() => updateStatus('aprovado')}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          className="flex-1"
                          variant="destructive"
                          onClick={() => {
                            if (!motivoRejeicao.trim()) {
                              toast({ title: 'Informe o motivo da rejeição', variant: 'destructive' });
                              return;
                            }
                            updateStatus('rejeitado', motivoRejeicao);
                          }}
                          disabled={isUpdating}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    </>
                  )}

                  {requisicao.status === 'aprovado' && (
                    <Button className="w-full" onClick={() => updateStatus('cotando')} disabled={isUpdating}>
                      <Package className="w-4 h-4 mr-2" />
                      Iniciar Cotação
                    </Button>
                  )}

                  {requisicao.status === 'cotando' && (
                    <Button className="w-full" variant="success" onClick={() => updateStatus('comprado')} disabled={isUpdating}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Marcar como Comprado
                    </Button>
                  )}

                  {requisicao.status === 'comprado' && (
                    <Button className="w-full" onClick={() => updateStatus('em_entrega')} disabled={isUpdating}>
                      <Truck className="w-4 h-4 mr-2" />
                      Marcar em Entrega
                    </Button>
                  )}

                  {requisicao.status === 'em_entrega' && (
                    <Button className="w-full" variant="success" onClick={() => updateStatus('recebido')} disabled={isUpdating}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmar Entrega
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Read-only view info */}
            {readOnly && requisicao.centro_custo && (
              <Card className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <span className="font-medium text-primary">Centro de Custo:</span> {requisicao.centro_custo}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
