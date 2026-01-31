import { useEffect, useState } from 'react';
import { X, FileText, CheckCircle, XCircle, Package, ShoppingCart, Truck, DollarSign, Paperclip, Download, Mail, Upload, Loader2, MessageCircle, Trash2, StickyNote, Ban, Wallet, RefreshCw } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { RequisicaoTimeline, BuyerSelector, FornecedorSelector, DeliveryDatePicker, ValueHistoryList } from '@/components/requisicao';
import { Requisicao, RequisicaoStatus, STATUS_CONFIG, ValorHistorico } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Status disponíveis para alteração manual
const MANUAL_STATUS_OPTIONS: RequisicaoStatus[] = [
  'pendente',
  'em_analise',
  'aprovado',
  'cotando',
  'comprado',
  'em_entrega',
  'recebido',
];

interface SidePanelProps {
  requisicao: Requisicao | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  profileNome?: string;
  profileId?: string;
  readOnly?: boolean;
}

export function SidePanel({
  requisicao,
  isOpen,
  onClose,
  onUpdate,
  profileNome,
  profileId,
  readOnly = false,
}: SidePanelProps) {
  // Local state to hold the current requisicao data (updated after changes)
  const [localRequisicao, setLocalRequisicao] = useState<Requisicao | null>(requisicao);
  const [valorInput, setValorInput] = useState('');
  const [valorOrcadoInput, setValorOrcadoInput] = useState('');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [valorHistory, setValorHistory] = useState<ValorHistorico[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [orcamentoFile, setOrcamentoFile] = useState<File | null>(null);
  const [isUploadingOrcamento, setIsUploadingOrcamento] = useState(false);
  const [observacaoComprador, setObservacaoComprador] = useState('');
  const [centroCustoInput, setCentroCustoInput] = useState('');
  const [isDeletingAnexo, setIsDeletingAnexo] = useState(false);
  const [isDeletingOrcamento, setIsDeletingOrcamento] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Sync localRequisicao with prop when prop changes (new requisicao selected)
  useEffect(() => {
    setLocalRequisicao(requisicao);
  }, [requisicao]);

  // Helper to refresh local requisicao data from database
  const refreshLocalRequisicao = async () => {
    if (!localRequisicao) return;
    
    const { data, error } = await supabase
      .from('requisicoes')
      .select('*')
      .eq('id', localRequisicao.id)
      .single();
    
    if (!error && data) {
      setLocalRequisicao(data as Requisicao);
    }
  };

  // Fetch valor history
  useEffect(() => {
    const fetchValorHistory = async () => {
      if (!localRequisicao) return;
      
      const { data, error } = await supabase
        .from('valor_historico')
        .select('*')
        .eq('requisicao_id', localRequisicao.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setValorHistory(data as ValorHistorico[]);
      }
    };

    if (isOpen && localRequisicao) {
      fetchValorHistory();
      setValorInput(localRequisicao.valor ? formatCurrencyInput(localRequisicao.valor) : '');
      setValorOrcadoInput(localRequisicao.valor_orcado ? formatCurrencyInput(localRequisicao.valor_orcado) : '');
      setMotivoRejeicao('');
      setObservacaoComprador(localRequisicao.observacao_comprador || '');
      setCentroCustoInput(localRequisicao.centro_custo || '');
    }
  }, [isOpen, localRequisicao]);

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

  // Parse date string correctly to avoid timezone issues
  const parseDateString = (dateString: string): Date => {
    // If it's a date-only string like "2025-01-20", parse without timezone
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    // Otherwise parse as is (for timestamps)
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
    if (!localRequisicao) return;
    
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
        .eq('id', localRequisicao.id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: `Status atualizado para ${STATUS_CONFIG[newStatus].label}`,
      });

      await sendNotification({ ...localRequisicao, ...updateData } as Requisicao, newStatus);
      await refreshLocalRequisicao();
      onUpdate();
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
    if (!localRequisicao) return;
    
    try {
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          comprador_nome: compradorNome,
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Comprador atualizado' });
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error updating comprador:', error);
      toast({ title: 'Erro ao atualizar comprador', variant: 'destructive' });
    }
  };

  const updateFornecedor = async (fornecedorNome: string) => {
    if (!localRequisicao) return;
    
    try {
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          fornecedor_nome: fornecedorNome || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Fornecedor atualizado' });
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error updating fornecedor:', error);
      toast({ title: 'Erro ao atualizar fornecedor', variant: 'destructive' });
    }
  };

  const updatePrevisaoEntrega = async (date: string) => {
    if (!localRequisicao) return;
    
    try {
      const previsaoValue = date && date.trim() !== '' ? date : null;
      
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          previsao_entrega: previsaoValue,
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Previsão atualizada' });
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error updating previsao:', error);
      toast({ title: 'Erro ao atualizar previsão', variant: 'destructive' });
    }
  };

  const updateValor = async () => {
    if (!localRequisicao) return;
    
    try {
      setIsUpdating(true);
      const valor = parseCurrencyInput(valorInput);
      const valorOrcado = valorOrcadoInput ? parseCurrencyInput(valorOrcadoInput) : null;
      const valorAnterior = localRequisicao.valor;

      const { error: updateError } = await supabase
        .from('requisicoes')
        .update({ 
          valor, 
          valor_orcado: valorOrcado,
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (updateError) throw updateError;

      await supabase.from('valor_historico').insert({
        requisicao_id: localRequisicao.id,
        valor_anterior: valorAnterior,
        valor_novo: valor,
        alterado_por: profileNome || 'Sistema',
      });

      toast({ title: 'Valores atualizados' });
      
      const { data: historyData } = await supabase
        .from('valor_historico')
        .select('*')
        .eq('requisicao_id', localRequisicao.id)
        .order('created_at', { ascending: false });
      
      if (historyData) {
        setValorHistory(historyData as ValorHistorico[]);
      }
      
      await refreshLocalRequisicao();
      onUpdate();
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

  const handleOrcamentoUpload = async () => {
    if (!orcamentoFile || !localRequisicao) return;

    try {
      setIsUploadingOrcamento(true);
      const fileExt = orcamentoFile.name.split('.').pop();
      const fileName = `orcamentos/${localRequisicao.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('requisicoes-anexos')
        .upload(fileName, orcamentoFile);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('requisicoes-anexos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('requisicoes')
        .update({
          orcamento_url: publicUrl.publicUrl,
          orcamento_nome: orcamentoFile.name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', localRequisicao.id);

      if (updateError) throw updateError;

      toast({ title: 'Orçamento anexado com sucesso' });
      setOrcamentoFile(null);
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error uploading orcamento:', error);
      toast({ title: 'Erro ao anexar orçamento', variant: 'destructive' });
    } finally {
      setIsUploadingOrcamento(false);
    }
  };

  const updateObservacaoComprador = async () => {
    if (!localRequisicao) return;
    
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          observacao_comprador: observacaoComprador || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Observação atualizada' });
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error updating observacao:', error);
      toast({ title: 'Erro ao atualizar observação', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCentroCusto = async () => {
    if (!localRequisicao) return;
    
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          centro_custo: centroCustoInput || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Centro de custo atualizado' });
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error updating centro_custo:', error);
      toast({ title: 'Erro ao atualizar centro de custo', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteAnexo = async (indexToDelete?: number) => {
    if (!localRequisicao || !localRequisicao.arquivo_url) return;
    
    try {
      setIsDeletingAnexo(true);
      
      const urls = localRequisicao.arquivo_url.split(',');
      const nomes = localRequisicao.arquivo_nome?.split(',') || [];
      
      if (indexToDelete !== undefined && urls.length > 1) {
        // Delete single file from multiple
        const urlToDelete = urls[indexToDelete];
        const urlParts = urlToDelete.split('/requisicoes-anexos/');
        if (urlParts.length > 1) {
          await supabase.storage
            .from('requisicoes-anexos')
            .remove([urlParts[1]]);
        }
        
        // Update with remaining files
        const remainingUrls = urls.filter((_, i) => i !== indexToDelete);
        const remainingNomes = nomes.filter((_, i) => i !== indexToDelete);
        
        const { error } = await supabase
          .from('requisicoes')
          .update({ 
            arquivo_url: remainingUrls.length > 0 ? remainingUrls.join(',') : null,
            arquivo_nome: remainingNomes.length > 0 ? remainingNomes.join(',') : null,
            updated_at: new Date().toISOString() 
          })
          .eq('id', localRequisicao.id);

        if (error) throw error;
      } else {
        // Delete all files
        for (const url of urls) {
          const urlParts = url.split('/requisicoes-anexos/');
          if (urlParts.length > 1) {
            await supabase.storage
              .from('requisicoes-anexos')
              .remove([urlParts[1]]);
          }
        }
        
        // Update requisicao
        const { error } = await supabase
          .from('requisicoes')
          .update({ 
            arquivo_url: null,
            arquivo_nome: null,
            updated_at: new Date().toISOString() 
          })
          .eq('id', localRequisicao.id);

        if (error) throw error;
      }
      
      toast({ title: 'Anexo excluído com sucesso' });
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error deleting anexo:', error);
      toast({ title: 'Erro ao excluir anexo', variant: 'destructive' });
    } finally {
      setIsDeletingAnexo(false);
    }
  };

  const deleteOrcamento = async () => {
    if (!localRequisicao || !(localRequisicao as any).orcamento_url) return;
    
    try {
      setIsDeletingOrcamento(true);
      
      // Extract path from URL for storage deletion
      const url = (localRequisicao as any).orcamento_url;
      const urlParts = url.split('/requisicoes-anexos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage
          .from('requisicoes-anexos')
          .remove([filePath]);
      }
      
      // Update requisicao
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          orcamento_url: null,
          orcamento_nome: null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Orçamento excluído com sucesso' });
      await refreshLocalRequisicao();
      onUpdate();
    } catch (error) {
      console.error('Error deleting orcamento:', error);
      toast({ title: 'Erro ao excluir orçamento', variant: 'destructive' });
    } finally {
      setIsDeletingOrcamento(false);
    }
  };

  const cancelRequisicao = async () => {
    if (!localRequisicao) return;
    
    try {
      setIsCanceling(true);
      
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          status: 'cancelado',
          updated_at: new Date().toISOString() 
        })
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Requisição cancelada com sucesso' });
      await sendNotification({ ...localRequisicao, status: 'cancelado' } as Requisicao, 'cancelado');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error canceling requisicao:', error);
      toast({ title: 'Erro ao cancelar requisição', variant: 'destructive' });
    } finally {
      setIsCanceling(false);
    }
  };

  const deleteRequisicao = async () => {
    if (!localRequisicao) return;
    
    const confirmed = window.confirm('Tem certeza que deseja excluir permanentemente esta requisição? Esta ação não pode ser desfeita.');
    if (!confirmed) return;
    
    try {
      setIsDeleting(true);
      
      // Delete related records first
      await supabase.from('valor_historico').delete().eq('requisicao_id', localRequisicao.id);
      await supabase.from('comentarios').delete().eq('requisicao_id', localRequisicao.id);
      await supabase.from('audit_logs').delete().eq('requisicao_id', localRequisicao.id);
      
      // Delete files from storage if they exist (multiple files support)
      if (localRequisicao.arquivo_url) {
        const urls = localRequisicao.arquivo_url.split(',');
        for (const url of urls) {
          const urlParts = url.trim().split('/requisicoes-anexos/');
          if (urlParts.length > 1) {
            await supabase.storage.from('requisicoes-anexos').remove([urlParts[1]]);
          }
        }
      }
      
      if ((localRequisicao as any).orcamento_url) {
        const urlParts = (localRequisicao as any).orcamento_url.split('/requisicoes-anexos/');
        if (urlParts.length > 1) {
          await supabase.storage.from('requisicoes-anexos').remove([urlParts[1]]);
        }
      }
      
      // Delete the requisicao
      const { error } = await supabase
        .from('requisicoes')
        .delete()
        .eq('id', localRequisicao.id);

      if (error) throw error;
      toast({ title: 'Requisição excluída com sucesso' });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting requisicao:', error);
      toast({ title: 'Erro ao excluir requisição', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const canEditValor = (status: RequisicaoStatus) => {
    return ['cotando', 'comprado', 'em_entrega', 'recebido'].includes(status);
  };

  const sendEmailToSolicitante = async () => {
    if (!localRequisicao) return;
    await sendNotification(localRequisicao, localRequisicao.status);
    toast({ title: 'E-mail enviado ao solicitante' });
  };

  const sendWhatsAppToSolicitante = () => {
    if (!localRequisicao || !localRequisicao.solicitante_telefone) {
      toast({ title: 'Telefone não cadastrado', variant: 'destructive' });
      return;
    }
    
    const phone = localRequisicao.solicitante_telefone.replace(/\D/g, '');
    const phoneWithCountry = phone.startsWith('55') ? phone : `55${phone}`;
    
    const statusLabel = STATUS_CONFIG[localRequisicao.status]?.label || localRequisicao.status;
    const previsao = localRequisicao.previsao_entrega 
      ? `\n📅 Previsão de entrega: ${formatDate(localRequisicao.previsao_entrega)}` 
      : '';
    const comprador = localRequisicao.comprador_nome 
      ? `\n👤 Comprador: ${localRequisicao.comprador_nome}` 
      : '';
    const valor = localRequisicao.valor 
      ? `\n💰 Valor: ${formatCurrency(localRequisicao.valor)}` 
      : '';
    
    const message = `Olá ${localRequisicao.solicitante_nome}! 👋

Atualização da sua requisição:

📋 *Protocolo:* ${localRequisicao.protocolo}
📦 *Item:* ${localRequisicao.item_nome}
📊 *Status:* ${statusLabel}${comprador}${previsao}${valor}

Qualquer dúvida, estamos à disposição!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast({ title: 'WhatsApp aberto' });
  };

  // Combined loading state for overlay
  const isAnyLoading = isUpdating || isUploadingOrcamento || isDeletingAnexo || isDeletingOrcamento || isCanceling || isDeleting;

  if (!localRequisicao) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col relative">
        {/* Loading Overlay with smooth transition */}
        <div 
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${
            isAnyLoading 
              ? 'opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className={`flex flex-col items-center gap-3 transition-transform duration-300 ease-out ${
            isAnyLoading ? 'scale-100' : 'scale-95'
          }`}>
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Atualizando...</span>
          </div>
        </div>
        
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              Requisição
            </SheetTitle>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-mono text-muted-foreground">{localRequisicao.protocolo}</span>
            <div className="flex items-center gap-2">
              <span className={cn('w-2.5 h-2.5 rounded-full', STATUS_CONFIG[localRequisicao.status].dotColor)} />
              <StatusBadge status={localRequisicao.status} />
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Timeline - disable revert for read-only */}
            <RequisicaoTimeline 
              requisicao={localRequisicao} 
              onRevertStatus={readOnly ? undefined : updateStatus}
              isUpdating={isUpdating}
            />

            <Separator />

            {/* Item Info */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase">Item</Label>
                <p className="font-semibold text-lg">{localRequisicao.item_nome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Quantidade</Label>
                  <p className="font-semibold">{localRequisicao.quantidade} {localRequisicao.unidade}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Prioridade</Label>
                  <div className="mt-1">
                    <PriorityBadge priority={localRequisicao.prioridade} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Solicitante */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Solicitante</Label>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="font-medium">{localRequisicao.solicitante_nome}</p>
                <p className="text-sm text-muted-foreground">{localRequisicao.solicitante_email}</p>
                {localRequisicao.solicitante_telefone && (
                  <p className="text-sm text-muted-foreground">{localRequisicao.solicitante_telefone}</p>
                )}
                <p className="text-sm text-muted-foreground">Setor: {localRequisicao.solicitante_setor}</p>
                {localRequisicao.solicitante_empresa && (
                  <p className="text-sm text-muted-foreground font-medium">Empresa: {localRequisicao.solicitante_empresa}</p>
                )}
                {readOnly && localRequisicao.centro_custo && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">Centro de Custo:</span> {localRequisicao.centro_custo}
                  </p>
                )}
              </div>
              {!readOnly && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={sendEmailToSolicitante}>
                    <Mail className="w-4 h-4" />
                    Enviar e-mail
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" 
                    onClick={sendWhatsAppToSolicitante}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>
              )}
            </div>

            {/* Centro de Custo - Editable for staff */}
            {!readOnly && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Centro de Custo
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={centroCustoInput}
                    onChange={(e) => setCentroCustoInput(e.target.value)}
                    placeholder="Ex: CC-001, Marketing-2024"
                    className="flex-1"
                  />
                  <Button 
                    onClick={updateCentroCusto} 
                    disabled={isUpdating || centroCustoInput === (localRequisicao.centro_custo || '')}
                    size="sm"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            {/* Justificativa */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Justificativa</Label>
              <p className="text-sm bg-muted/50 rounded-lg p-3">{localRequisicao.justificativa}</p>
            </div>

            {/* Especificações */}
            {localRequisicao.especificacoes && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Especificações</Label>
                <p className="text-sm bg-muted/50 rounded-lg p-3 whitespace-pre-wrap">{localRequisicao.especificacoes}</p>
              </div>
            )}

            {/* Anexos */}
            {localRequisicao.arquivo_url && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">
                  Anexos ({localRequisicao.arquivo_url.split(',').length} {localRequisicao.arquivo_url.split(',').length === 1 ? 'arquivo' : 'arquivos'})
                </Label>
                <div className="space-y-2">
                  {localRequisicao.arquivo_url.split(',').map((url, index) => {
                    const nomes = localRequisicao.arquivo_nome?.split(',') || [];
                    const nome = nomes[index] || `arquivo-${index + 1}`;
                    const trimmedUrl = url.trim();
                    
                    // Download handler using download attribute + fallback to blob
                    const handleDownload = async (e: React.MouseEvent) => {
                      e.preventDefault();
                      
                      // Try direct download link first (works for most browsers with public files)
                      const link = document.createElement('a');
                      link.href = trimmedUrl;
                      link.download = nome;
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      
                      // Force download by using blob approach
                      try {
                        const response = await fetch(trimmedUrl, { mode: 'cors' });
                        if (!response.ok) throw new Error('Fetch failed');
                        const blob = await response.blob();
                        const blobUrl = window.URL.createObjectURL(blob);
                        link.href = blobUrl;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                      } catch {
                        // Fallback: open in new tab
                        window.open(trimmedUrl, '_blank', 'noopener,noreferrer');
                      }
                    };
                    
                    return (
                      <div key={index} className="flex gap-2">
                        <button
                          onClick={handleDownload}
                          className="flex-1 flex items-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary transition-colors"
                        >
                          <Paperclip className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{nome}</span>
                          <Download className="w-4 h-4 ml-auto flex-shrink-0" />
                        </button>
                        {/* Delete button - only for staff */}
                        {!readOnly && (
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteAnexo(index)}
                            disabled={isDeletingAnexo}
                            title="Excluir anexo"
                          >
                            {isDeletingAnexo ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Observação do comprador - read-only display or editable */}
            {localRequisicao.observacao_comprador && readOnly && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase flex items-center gap-1.5">
                  <StickyNote className="w-4 h-4" />
                  Observação do Comprador
                </Label>
                <p className="text-sm bg-muted/50 rounded-lg p-3">{localRequisicao.observacao_comprador}</p>
              </div>
            )}

            {!readOnly && !['pendente', 'rejeitado', 'cancelado'].includes(localRequisicao.status) && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <StickyNote className="w-4 h-4" />
                  Observação do Comprador
                </Label>
                <Textarea
                  value={observacaoComprador}
                  onChange={(e) => setObservacaoComprador(e.target.value)}
                  placeholder="Adicione observações sobre a compra..."
                  rows={3}
                />
                <Button 
                  onClick={updateObservacaoComprador} 
                  disabled={isUpdating}
                  size="sm"
                  className="w-full"
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Observação'}
                </Button>
              </div>
            )}

            <Separator />

            {/* Comprador, Fornecedor & Previsão - only for staff */}
            {!readOnly && !['pendente', 'rejeitado', 'cancelado'].includes(localRequisicao.status) && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <BuyerSelector
                    value={localRequisicao.comprador_nome}
                    onChange={updateComprador}
                  />
                  <DeliveryDatePicker
                    value={localRequisicao.previsao_entrega}
                    onChange={updatePrevisaoEntrega}
                  />
                </div>
                <FornecedorSelector
                  value={localRequisicao.fornecedor_nome}
                  onChange={updateFornecedor}
                />
              </div>
            )}

            {/* Read-only view of comprador/fornecedor/previsao */}
            {readOnly && (localRequisicao.comprador_nome || localRequisicao.fornecedor_nome || localRequisicao.previsao_entrega) && (
              <div className="space-y-3">
                {localRequisicao.comprador_nome && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Comprador</Label>
                    <p className="font-medium">{localRequisicao.comprador_nome}</p>
                  </div>
                )}
                {localRequisicao.fornecedor_nome && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Fornecedor</Label>
                    <p className="font-medium">{localRequisicao.fornecedor_nome}</p>
                  </div>
                )}
                {localRequisicao.previsao_entrega && (
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase">Previsão de Entrega</Label>
                    <p className="font-medium">{new Date(localRequisicao.previsao_entrega + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Valores - read-only for solicitantes */}
            {readOnly && (localRequisicao.valor || localRequisicao.valor_orcado) && (
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valores
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {localRequisicao.valor_orcado && (
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Valor Orçado</Label>
                      <p className="font-semibold">{formatCurrency(localRequisicao.valor_orcado)}</p>
                    </div>
                  )}
                  {localRequisicao.valor && (
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase">Valor Final</Label>
                      <p className="font-semibold">{formatCurrency(localRequisicao.valor)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Valores - editable for staff */}
            {!readOnly && canEditValor(localRequisicao.status) && (
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valores da Compra
                </Label>
                
                {/* Valor Orçado */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Valor Orçado (Estimado)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      value={valorOrcadoInput}
                      onChange={handleValorOrcadoChange}
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Valor Negociado (Final) */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Valor Negociado (Final)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      value={valorInput}
                      onChange={handleValorChange}
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Economia Calculada */}
                {(() => {
                  const economia = calculateEconomia(
                    valorOrcadoInput ? parseCurrencyInput(valorOrcadoInput) : localRequisicao.valor_orcado,
                    valorInput ? parseCurrencyInput(valorInput) : localRequisicao.valor
                  );
                  if (!economia) return null;
                  
                  const isPositive = economia.valor >= 0;
                  return (
                    <div className={cn(
                      "p-3 rounded-lg border",
                      isPositive ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-medium", isPositive ? "text-emerald-700" : "text-red-700")}>
                          {isPositive ? '💰 Economia:' : '⚠️ Acréscimo:'}
                        </span>
                        <div className="text-right">
                          <span className={cn("font-bold", isPositive ? "text-emerald-700" : "text-red-700")}>
                            {formatCurrency(Math.abs(economia.valor))}
                          </span>
                          <span className={cn("text-sm ml-2", isPositive ? "text-emerald-600" : "text-red-600")}>
                            ({Math.abs(economia.percentual).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <Button onClick={updateValor} disabled={!valorInput || isUpdating} className="w-full">
                  {isUpdating ? 'Salvando...' : 'Salvar Valores'}
                </Button>

                {/* Anexo de Orçamento */}
                <div className="space-y-2 pt-2">
                  <Label className="text-xs text-muted-foreground uppercase flex items-center gap-2">
                    <Upload className="w-3 h-3" />
                    Anexar Orçamento/Cotação
                  </Label>
                  
                  {(localRequisicao as any).orcamento_url ? (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch((localRequisicao as any).orcamento_url);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = (localRequisicao as any).orcamento_nome || 'orcamento';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                          } catch {
                            window.open((localRequisicao as any).orcamento_url, '_blank');
                          }
                        }}
                        className="flex-1 flex items-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg text-sm font-medium text-emerald-600 transition-colors"
                      >
                        <Paperclip className="w-4 h-4" />
                        {(localRequisicao as any).orcamento_nome || 'Baixar orçamento'}
                        <Download className="w-4 h-4 ml-auto" />
                      </button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={deleteOrcamento}
                        disabled={isDeletingOrcamento}
                        title="Excluir orçamento"
                      >
                        {isDeletingOrcamento ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <label className="flex-1">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.doc,.docx"
                            onChange={(e) => setOrcamentoFile(e.target.files?.[0] || null)}
                          />
                          <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {orcamentoFile ? orcamentoFile.name : 'Selecionar arquivo...'}
                            </span>
                          </div>
                        </label>
                        {orcamentoFile && (
                          <Button 
                            onClick={handleOrcamentoUpload} 
                            disabled={isUploadingOrcamento}
                            size="sm"
                            className="h-auto"
                          >
                            {isUploadingOrcamento ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Enviar'
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PDF, Imagens, Excel ou Word (máx. 5MB)
                      </p>
                    </div>
                  )}
                </div>

                <ValueHistoryList history={valorHistory} />
              </div>
            )}

            {/* Rejeição - only for staff */}
            {!readOnly && localRequisicao.status === 'pendente' && (
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-sm font-medium">Motivo da Rejeição (se aplicável)</Label>
                <Textarea
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  placeholder="Informe o motivo caso vá rejeitar..."
                  rows={2}
                />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions Footer - only for staff */}
        {!readOnly && (
          <div className="p-4 border-t bg-muted/30 space-y-3">
            {/* Ações rápidas por status */}

            {/* Ações rápidas por status */}
            {localRequisicao.status === 'pendente' && (
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
            )}

            {localRequisicao.status === 'em_analise' && (
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
            )}

            {localRequisicao.status === 'aprovado' && (
              <Button className="w-full" onClick={() => updateStatus('cotando')} disabled={isUpdating}>
                <Package className="w-4 h-4 mr-2" />
                Iniciar Cotação
              </Button>
            )}

            {localRequisicao.status === 'cotando' && (
              <Button className="w-full" variant="success" onClick={() => updateStatus('comprado')} disabled={isUpdating}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Marcar como Comprado
              </Button>
            )}

            {localRequisicao.status === 'comprado' && (
              <Button className="w-full" onClick={() => updateStatus('em_entrega')} disabled={isUpdating}>
                <Truck className="w-4 h-4 mr-2" />
                Marcar em Entrega
              </Button>
            )}

            {localRequisicao.status === 'em_entrega' && (
              <Button className="w-full" variant="success" onClick={() => updateStatus('recebido')} disabled={isUpdating}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Entrega
              </Button>
            )}


          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
