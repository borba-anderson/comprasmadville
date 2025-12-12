import { useEffect, useState } from 'react';
import { X, FileText, CheckCircle, XCircle, Package, ShoppingCart, Truck, DollarSign, Paperclip, Download, Mail } from 'lucide-react';
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
import { RequisicaoTimeline, BuyerSelector, DeliveryDatePicker, ValueHistoryList } from '@/components/requisicao';
import { Requisicao, RequisicaoStatus, STATUS_CONFIG, ValorHistorico } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SidePanelProps {
  requisicao: Requisicao | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  profileNome?: string;
  profileId?: string;
}

export function SidePanel({
  requisicao,
  isOpen,
  onClose,
  onUpdate,
  profileNome,
  profileId,
}: SidePanelProps) {
  const [valorInput, setValorInput] = useState('');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [valorHistory, setValorHistory] = useState<ValorHistorico[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch valor history
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

    if (isOpen && requisicao) {
      fetchValorHistory();
      setValorInput(requisicao.valor ? formatCurrencyInput(requisicao.valor) : '');
      setMotivoRejeicao('');
    }
  }, [isOpen, requisicao]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
      onUpdate();
      onClose();
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
      onUpdate();
    } catch (error) {
      console.error('Error updating comprador:', error);
      toast({ title: 'Erro ao atualizar comprador', variant: 'destructive' });
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
      onUpdate();
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
      const valorAnterior = requisicao.valor;

      const { error: updateError } = await supabase
        .from('requisicoes')
        .update({ valor, updated_at: new Date().toISOString() })
        .eq('id', requisicao.id);

      if (updateError) throw updateError;

      await supabase.from('valor_historico').insert({
        requisicao_id: requisicao.id,
        valor_anterior: valorAnterior,
        valor_novo: valor,
        alterado_por: profileNome || 'Sistema',
      });

      toast({ title: 'Valor atualizado' });
      
      const { data: historyData } = await supabase
        .from('valor_historico')
        .select('*')
        .eq('requisicao_id', requisicao.id)
        .order('created_at', { ascending: false });
      
      if (historyData) {
        setValorHistory(historyData as ValorHistorico[]);
      }
      
      onUpdate();
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

  const canEditValor = (status: RequisicaoStatus) => {
    return ['cotando', 'comprado', 'em_entrega', 'recebido'].includes(status);
  };

  const sendEmailToSolicitante = async () => {
    if (!requisicao) return;
    await sendNotification(requisicao, requisicao.status);
    toast({ title: 'E-mail enviado ao solicitante' });
  };

  if (!requisicao) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5" />
              Requisição
            </SheetTitle>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-mono text-muted-foreground">{requisicao.protocolo}</span>
            <div className="flex items-center gap-2">
              <span className={cn('w-2.5 h-2.5 rounded-full', STATUS_CONFIG[requisicao.status].dotColor)} />
              <StatusBadge status={requisicao.status} />
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Timeline */}
            <RequisicaoTimeline requisicao={requisicao} />

            <Separator />

            {/* Item Info */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase">Item</Label>
                <p className="font-semibold text-lg">{requisicao.item_nome}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Quantidade</Label>
                  <p className="font-semibold">{requisicao.quantidade} {requisicao.unidade}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase">Prioridade</Label>
                  <div className="mt-1">
                    <PriorityBadge priority={requisicao.prioridade} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Solicitante */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Solicitante</Label>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="font-medium">{requisicao.solicitante_nome}</p>
                <p className="text-sm text-muted-foreground">{requisicao.solicitante_email}</p>
                {requisicao.solicitante_telefone && (
                  <p className="text-sm text-muted-foreground">{requisicao.solicitante_telefone}</p>
                )}
                <p className="text-sm text-muted-foreground">Setor: {requisicao.solicitante_setor}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={sendEmailToSolicitante}>
                <Mail className="w-4 h-4" />
                Enviar e-mail
              </Button>
            </div>

            <Separator />

            {/* Justificativa */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase">Justificativa</Label>
              <p className="text-sm bg-muted/50 rounded-lg p-3">{requisicao.justificativa}</p>
            </div>

            {/* Especificações */}
            {requisicao.especificacoes && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Especificações</Label>
                <p className="text-sm bg-muted/50 rounded-lg p-3 whitespace-pre-wrap">{requisicao.especificacoes}</p>
              </div>
            )}

            {/* Anexo */}
            {requisicao.arquivo_url && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Anexo</Label>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(requisicao.arquivo_url!);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = requisicao.arquivo_nome || 'arquivo';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch {
                      window.open(requisicao.arquivo_url!, '_blank');
                    }
                  }}
                  className="flex items-center gap-2 p-3 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm font-medium text-primary transition-colors w-full"
                >
                  <Paperclip className="w-4 h-4" />
                  {requisicao.arquivo_nome || 'Baixar arquivo'}
                  <Download className="w-4 h-4 ml-auto" />
                </button>
              </div>
            )}

            <Separator />

            {/* Comprador & Previsão */}
            {!['pendente', 'rejeitado', 'cancelado'].includes(requisicao.status) && (
              <div className="grid grid-cols-2 gap-4">
                <BuyerSelector
                  value={requisicao.comprador_nome}
                  onChange={updateComprador}
                />
                <DeliveryDatePicker
                  value={requisicao.previsao_entrega}
                  onChange={updatePrevisaoEntrega}
                />
              </div>
            )}

            {/* Valor */}
            {canEditValor(requisicao.status) && (
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valor do Pedido (R$)
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      value={valorInput}
                      onChange={handleValorChange}
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={updateValor} disabled={!valorInput || isUpdating}>
                    {isUpdating ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
                <ValueHistoryList history={valorHistory} />
              </div>
            )}

            {/* Rejeição */}
            {requisicao.status === 'pendente' && (
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

        {/* Actions Footer */}
        <div className="p-4 border-t bg-muted/30">
          {requisicao.status === 'pendente' && (
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
