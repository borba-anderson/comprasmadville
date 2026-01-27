import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  RefreshCw,
  Mail,
  Paperclip,
  History,
  Ban,
  FileText,
  Loader2,
} from 'lucide-react';
import { Requisicao, STATUS_CONFIG } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsMenuProps {
  requisicao: Requisicao;
  onView: () => void;
  onStatusUpdate: () => void;
  onSendEmail: () => void;
  onUpdate?: () => void;
  readOnly?: boolean;
}

export function QuickActionsMenu({
  requisicao,
  onView,
  onStatusUpdate,
  onSendEmail,
  onUpdate,
  readOnly = false,
}: QuickActionsMenuProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const canCancel = !['recebido', 'rejeitado', 'cancelado'].includes(requisicao.status);

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const confirmed = window.confirm('Tem certeza que deseja cancelar esta requisição?');
    if (!confirmed) return;
    
    try {
      setIsCanceling(true);
      const { error } = await supabase
        .from('requisicoes')
        .update({ 
          status: 'cancelado',
          updated_at: new Date().toISOString() 
        })
        .eq('id', requisicao.id);

      if (error) throw error;
      toast({ title: 'Requisição cancelada com sucesso' });
      onUpdate?.();
    } catch (error) {
      console.error('Error canceling requisicao:', error);
      toast({ title: 'Erro ao cancelar requisição', variant: 'destructive' });
    } finally {
      setIsCanceling(false);
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleExportPDF = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(true);
    
    try {
      const statusLabel = STATUS_CONFIG[requisicao.status]?.label || requisicao.status;
      
      const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Requisição ${requisicao.protocolo}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .protocolo { font-size: 14px; color: #666; }
    .status { background: #f3f4f6; padding: 4px 12px; border-radius: 4px; font-weight: bold; }
    .section { margin: 20px 0; }
    .section-title { font-weight: bold; color: #333; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-item { margin-bottom: 12px; }
    .info-label { font-size: 12px; color: #666; }
    .info-value { font-size: 14px; color: #333; font-weight: 500; }
    .box { background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Requisição de Compra</h1>
    <div>
      <div class="protocolo">${requisicao.protocolo}</div>
      <div class="status">${statusLabel.toUpperCase()}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Item Solicitado</div>
    <div class="box">
      <div class="info-item">
        <div class="info-label">Item</div>
        <div class="info-value" style="font-size: 18px;">${requisicao.item_nome}</div>
      </div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Quantidade</div>
          <div class="info-value">${requisicao.quantidade} ${requisicao.unidade}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Prioridade</div>
          <div class="info-value">${requisicao.prioridade}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Solicitante</div>
    <div class="box">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nome</div>
          <div class="info-value">${requisicao.solicitante_nome}</div>
        </div>
        <div class="info-item">
          <div class="info-label">E-mail</div>
          <div class="info-value">${requisicao.solicitante_email}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Setor</div>
          <div class="info-value">${requisicao.solicitante_setor}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Empresa</div>
          <div class="info-value">${requisicao.solicitante_empresa || '-'}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Justificativa</div>
    <div class="box">
      <p>${requisicao.justificativa}</p>
    </div>
  </div>

  ${requisicao.especificacoes ? `
  <div class="section">
    <div class="section-title">Especificações</div>
    <div class="box">
      <p>${requisicao.especificacoes}</p>
    </div>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Informações de Compra</div>
    <div class="box">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Comprador</div>
          <div class="info-value">${requisicao.comprador_nome || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Fornecedor</div>
          <div class="info-value">${requisicao.fornecedor_nome || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Valor Orçado</div>
          <div class="info-value">${formatCurrency(requisicao.valor_orcado)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Valor Final</div>
          <div class="info-value">${formatCurrency(requisicao.valor)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Previsão de Entrega</div>
          <div class="info-value">${formatDate(requisicao.previsao_entrega)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Centro de Custo</div>
          <div class="info-value">${requisicao.centro_custo || '-'}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Datas</div>
    <div class="box">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Criado em</div>
          <div class="info-value">${formatDate(requisicao.created_at)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Aprovado em</div>
          <div class="info-value">${formatDate(requisicao.aprovado_em)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Comprado em</div>
          <div class="info-value">${formatDate(requisicao.comprado_em)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Recebido em</div>
          <div class="info-value">${formatDate(requisicao.recebido_em)}</div>
        </div>
      </div>
    </div>
  </div>

  ${requisicao.observacao_comprador ? `
  <div class="section">
    <div class="section-title">Observação do Comprador</div>
    <div class="box">
      <p>${requisicao.observacao_comprador}</p>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    Documento gerado em ${new Date().toLocaleString('pt-BR')}
  </div>
</body>
</html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
      
      toast({ title: 'Exportação iniciada' });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({ title: 'Erro ao exportar', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
          <Eye className="w-4 h-4 mr-2" />
          Ver detalhes
        </DropdownMenuItem>
        {!readOnly && (
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStatusUpdate(); }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar status
          </DropdownMenuItem>
        )}
        {!readOnly && <DropdownMenuSeparator />}
        {!readOnly && (
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSendEmail(); }}>
            <Mail className="w-4 h-4 mr-2" />
            Enviar e-mail
          </DropdownMenuItem>
        )}
        {requisicao.arquivo_url && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                window.open(requisicao.arquivo_url!, '_blank');
              }}
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Ver anexo
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
          <History className="w-4 h-4 mr-2" />
          Ver histórico
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          Exportar PDF
        </DropdownMenuItem>
        {!readOnly && canCancel && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleCancel} 
              disabled={isCanceling}
              className="text-destructive focus:text-destructive"
            >
              {isCanceling ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Ban className="w-4 h-4 mr-2" />
              )}
              Cancelar Requisição
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
