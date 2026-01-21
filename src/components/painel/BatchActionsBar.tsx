import { useState } from 'react';
import { X, Mail, UserPlus, CheckCircle, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Requisicao, STATUS_CONFIG, COMPRADORES, RequisicaoStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BatchActionsBarProps {
  selectedItems: Requisicao[];
  selectedCount: number;
  onClear: () => void;
  onActionComplete: () => void;
}

export function BatchActionsBar({
  selectedItems,
  selectedCount,
  onClear,
  onActionComplete,
}: BatchActionsBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    variant?: 'default' | 'destructive';
  }>({ open: false, title: '', description: '', action: async () => {} });
  
  const { toast } = useToast();

  const handleBatchStatusUpdate = async (newStatus: RequisicaoStatus) => {
    const statusLabel = STATUS_CONFIG[newStatus].label;
    
    setConfirmDialog({
      open: true,
      title: `Alterar status para "${statusLabel}"?`,
      description: `${selectedCount} requisições serão atualizadas para o status "${statusLabel}".`,
      action: async () => {
        setIsLoading(true);
        try {
          const { error } = await supabase
            .from('requisicoes')
            .update({ 
              status: newStatus,
              updated_at: new Date().toISOString(),
            })
            .in('id', selectedItems.map((r) => r.id));

          if (error) throw error;

          toast({
            title: 'Status atualizado',
            description: `${selectedCount} requisições atualizadas com sucesso.`,
          });
          onClear();
          onActionComplete();
        } catch (error) {
          console.error('Batch status update error:', error);
          toast({
            title: 'Erro',
            description: 'Falha ao atualizar status.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleBatchAssignBuyer = async (buyerName: string) => {
    const buyer = COMPRADORES.find((c) => c.nome === buyerName);
    if (!buyer) return;

    setConfirmDialog({
      open: true,
      title: `Atribuir comprador "${buyerName}"?`,
      description: `${selectedCount} requisições serão atribuídas ao comprador "${buyerName}".`,
      action: async () => {
        setIsLoading(true);
        try {
          const { error } = await supabase
            .from('requisicoes')
            .update({ 
              comprador_nome: buyer.nome,
              comprador_id: buyer.id,
              updated_at: new Date().toISOString(),
            })
            .in('id', selectedItems.map((r) => r.id));

          if (error) throw error;

          toast({
            title: 'Comprador atribuído',
            description: `${selectedCount} requisições atribuídas a ${buyerName}.`,
          });
          onClear();
          onActionComplete();
        } catch (error) {
          console.error('Batch buyer assignment error:', error);
          toast({
            title: 'Erro',
            description: 'Falha ao atribuir comprador.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleBatchSendEmail = async () => {
    setConfirmDialog({
      open: true,
      title: 'Enviar notificações por e-mail?',
      description: `Serão enviados e-mails de atualização para os solicitantes de ${selectedCount} requisições.`,
      action: async () => {
        setIsLoading(true);
        try {
          let successCount = 0;
          for (const req of selectedItems) {
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
              successCount++;
            } catch (e) {
              console.error('Email send error for', req.id, e);
            }
          }

          toast({
            title: 'E-mails enviados',
            description: `${successCount} de ${selectedCount} e-mails enviados com sucesso.`,
          });
          onClear();
        } catch (error) {
          console.error('Batch email error:', error);
          toast({
            title: 'Erro',
            description: 'Falha ao enviar e-mails.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="sticky top-[140px] z-30 bg-primary text-primary-foreground shadow-lg animate-in slide-in-from-top-2 duration-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={onClear}
            >
              <X className="w-4 h-4" />
            </Button>
            <span className="font-medium">
              {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Update */}
            <Select onValueChange={(value) => handleBatchStatusUpdate(value as RequisicaoStatus)} disabled={isLoading}>
              <SelectTrigger className="w-[160px] h-9 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CheckCircle className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Alterar status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', config.dotColor)} />
                      {config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assign Buyer */}
            <Select onValueChange={handleBatchAssignBuyer} disabled={isLoading}>
              <SelectTrigger className="w-[160px] h-9 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <UserPlus className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Atribuir comprador" />
              </SelectTrigger>
              <SelectContent>
                {COMPRADORES.map((c) => (
                  <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Send Emails */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleBatchSendEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              Notificar
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {confirmDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDialog.action();
              }}
              disabled={isLoading}
              className={cn(confirmDialog.variant === 'destructive' && 'bg-destructive hover:bg-destructive/90')}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
