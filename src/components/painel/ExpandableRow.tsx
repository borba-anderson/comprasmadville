import { useState } from 'react';
import { ChevronDown, Paperclip, Download, History, FileText, User, Package } from 'lucide-react';
import { Requisicao, STATUS_CONFIG, ValorHistorico } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeliveryBadge } from './DeliveryBadge';
import { SLAIndicator } from './SLAIndicator';
import { QuickActionsMenu } from './QuickActionsMenu';
import { cn } from '@/lib/utils';
import { ViewMode } from './types';

interface ExpandableRowProps {
  requisicao: Requisicao;
  viewMode: ViewMode;
  isSelected: boolean;
  valorHistory?: ValorHistorico[];
  onSelect: () => void;
  onViewDetails: () => void;
  onStatusUpdate: () => void;
  onSendEmail: () => void;
  formatCurrency: (value: number | null | undefined) => string;
}

export function ExpandableRow({
  requisicao,
  viewMode,
  isSelected,
  valorHistory = [],
  onSelect,
  onViewDetails,
  onStatusUpdate,
  onSendEmail,
  formatCurrency,
}: ExpandableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isCompact = viewMode === 'compact';

  return (
    <>
      {/* Main Row */}
      <tr
        className={cn(
          'border-b border-border/50 transition-colors cursor-pointer group',
          isSelected && 'bg-primary/5',
          !isSelected && 'hover:bg-muted/50'
        )}
        onClick={onViewDetails}
      >
        {/* Expand Toggle */}
        <td className="w-10 px-2">
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <ChevronDown 
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                isExpanded && 'rotate-180'
              )} 
            />
          </button>
        </td>

        {/* Item */}
        <td className={cn('px-3', isCompact ? 'py-2' : 'py-3')}>
          <div>
            <p className={cn(
              'font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {requisicao.item_nome}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {requisicao.protocolo}
            </p>
          </div>
        </td>

        {/* Solicitante */}
        <td className={cn('px-3', isCompact ? 'py-2' : 'py-3')}>
          <div>
            <p className={cn('font-medium', isCompact ? 'text-sm' : 'text-base')}>
              {requisicao.solicitante_nome}
            </p>
            <p className="text-xs text-muted-foreground">{requisicao.solicitante_setor}</p>
          </div>
        </td>

        {/* Quantidade */}
        <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-3')}>
          <span className={cn('font-semibold', isCompact ? 'text-sm' : 'text-base')}>
            {requisicao.quantidade}
          </span>
          <span className="text-muted-foreground text-xs ml-1">{requisicao.unidade}</span>
        </td>

        {/* Prioridade */}
        <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-3')}>
          <PriorityBadge priority={requisicao.prioridade} />
        </td>

        {/* Status */}
        <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-3')}>
          <div className="flex items-center justify-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[requisicao.status].dotColor)} />
            <StatusBadge status={requisicao.status} showIcon={!isCompact} />
          </div>
        </td>

        {/* Comprador */}
        <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-3')}>
          {requisicao.comprador_nome ? (
            <span className="text-sm font-medium">{requisicao.comprador_nome}</span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </td>

        {/* Previsão */}
        <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-3')}>
          <DeliveryBadge previsao={requisicao.previsao_entrega} />
        </td>

        {/* SLA */}
        <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-3')}>
          <SLAIndicator requisicao={requisicao} compact={isCompact} />
        </td>

        {/* Valor */}
        <td className={cn('px-3 text-right', isCompact ? 'py-2' : 'py-3')}>
          <span className="font-medium">{formatCurrency(requisicao.valor)}</span>
        </td>

        {/* Data */}
        <td className={cn('px-3 text-center text-muted-foreground', isCompact ? 'py-2 text-xs' : 'py-3 text-sm')}>
          {formatDate(requisicao.created_at)}
        </td>

        {/* Ações */}
        <td className={cn('px-3 text-right', isCompact ? 'py-2' : 'py-3')}>
          <QuickActionsMenu
            requisicao={requisicao}
            onView={onViewDetails}
            onStatusUpdate={onStatusUpdate}
            onSendEmail={onSendEmail}
          />
        </td>
      </tr>

      {/* Expanded Content */}
      {isExpanded && (
        <tr className="bg-muted/30">
          <td colSpan={12} className="p-0">
            <div className="p-4 space-y-4 animate-fade-in border-b border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Descrição / Justificativa */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Descrição
                  </h4>
                  <p className="text-sm bg-background rounded-lg p-3 border">
                    {requisicao.justificativa}
                  </p>
                  {requisicao.especificacoes && (
                    <p className="text-sm bg-background rounded-lg p-3 border whitespace-pre-wrap">
                      <span className="font-medium">Especificações: </span>
                      {requisicao.especificacoes}
                    </p>
                  )}
                </div>

                {/* Solicitante Details */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Solicitante
                  </h4>
                  <div className="bg-background rounded-lg p-3 border space-y-1">
                    <p className="text-sm font-medium">{requisicao.solicitante_nome}</p>
                    <p className="text-xs text-muted-foreground">{requisicao.solicitante_email}</p>
                    {requisicao.solicitante_telefone && (
                      <p className="text-xs text-muted-foreground">{requisicao.solicitante_telefone}</p>
                    )}
                    <p className="text-xs text-muted-foreground">Setor: {requisicao.solicitante_setor}</p>
                  </div>
                </div>

                {/* Anexos & Histórico */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    Informações Adicionais
                  </h4>
                  <div className="bg-background rounded-lg p-3 border space-y-2">
                    {/* Anexo */}
                    {requisicao.arquivo_url ? (
                      <button
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(requisicao.arquivo_url!, '_blank');
                        }}
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        {requisicao.arquivo_nome || 'Ver anexo'}
                        <Download className="w-3 h-3" />
                      </button>
                    ) : (
                      <p className="text-xs text-muted-foreground">Sem anexos</p>
                    )}

                    {/* Motivo compra */}
                    {requisicao.motivo_compra && (
                      <p className="text-xs">
                        <span className="text-muted-foreground">Motivo: </span>
                        {requisicao.motivo_compra}
                      </p>
                    )}

                    {/* Motivo rejeição */}
                    {requisicao.motivo_rejeicao && (
                      <p className="text-xs text-destructive">
                        <span className="font-medium">Rejeição: </span>
                        {requisicao.motivo_rejeicao}
                      </p>
                    )}
                  </div>

                  {/* Value History */}
                  {valorHistory.length > 0 && (
                    <div className="bg-background rounded-lg p-3 border">
                      <h5 className="text-xs font-medium flex items-center gap-1.5 mb-2">
                        <History className="w-3 h-3" />
                        Histórico de Valores
                      </h5>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {valorHistory.slice(0, 3).map((h) => (
                          <div key={h.id} className="text-xs flex justify-between">
                            <span className="text-muted-foreground">
                              {new Date(h.created_at).toLocaleDateString('pt-BR')}
                            </span>
                            <span>
                              {h.valor_anterior ? formatCurrency(h.valor_anterior) : 'N/A'} → {formatCurrency(h.valor_novo)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
