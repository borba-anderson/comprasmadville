import { useState, useMemo } from 'react';
import { ChevronDown, Paperclip, Download, History, FileText, User, Package, AlertTriangle, Building } from 'lucide-react';
import { Requisicao, STATUS_CONFIG, ValorHistorico } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { DeliveryBadge } from './DeliveryBadge';
import { SLAIndicator } from './SLAIndicator';
import { QuickActionsMenu } from './QuickActionsMenu';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ViewMode } from './types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Multi-select props
  isChecked?: boolean;
  onToggleCheck?: () => void;
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
  isChecked = false,
  onToggleCheck,
}: ExpandableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMultiSelect = onToggleCheck !== undefined;

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

  const isCompact = viewMode === 'compact';

  // Check if overdue (previsao_entrega < today and not recebido/cancelado/rejeitado)
  const isOverdue = useMemo(() => {
    if (!requisicao.previsao_entrega) return false;
    if (['recebido', 'cancelado', 'rejeitado'].includes(requisicao.status)) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = parseDateString(requisicao.previsao_entrega);
    delivery.setHours(0, 0, 0, 0);
    
    return delivery < today;
  }, [requisicao.previsao_entrega, requisicao.status]);

  // Get empresa short name for display
  const empresaShort = useMemo(() => {
    if (!requisicao.solicitante_empresa) return null;
    return requisicao.solicitante_empresa.replace('GMAD ', '');
  }, [requisicao.solicitante_empresa]);

  return (
    <TooltipProvider>
      <>
        {/* Main Row */}
        <tr
          className={cn(
            'border-b border-border/30 transition-all cursor-pointer group',
            isSelected && 'bg-primary/8 ring-1 ring-primary/20',
            !isSelected && 'hover:bg-muted/40',
            isOverdue && 'bg-red-50/60 dark:bg-red-950/30 border-l-[3px] border-l-red-500',
            isCompact ? 'h-12' : 'h-14'
          )}
          onClick={onViewDetails}
        >
          {/* Multi-select Checkbox */}
          {hasMultiSelect && (
            <td className="w-10 px-2">
              <Checkbox
                checked={isChecked}
                onCheckedChange={(e) => {
                  onToggleCheck();
                }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Selecionar ${requisicao.item_nome}`}
              />
            </td>
          )}

          {/* Expand Toggle + Overdue Icon */}
          <td className="w-10 px-2">
            <div className="flex items-center gap-1">
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
              {isOverdue && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Entrega atrasada!</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </td>

          {/* Item */}
          <td className={cn('px-3', isCompact ? 'py-2' : 'py-2.5')}>
            <div className="min-w-0">
              <p className={cn(
                'font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug',
                isCompact ? 'text-sm' : 'text-sm'
              )} title={requisicao.item_nome}>
                {requisicao.item_nome}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-xs text-muted-foreground font-mono truncate">
                  {requisicao.protocolo}
                </p>
                {empresaShort && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted/80 text-muted-foreground whitespace-nowrap">
                    {empresaShort}
                  </span>
                )}
              </div>
            </div>
          </td>

          {/* Solicitante */}
          <td className={cn('px-3', isCompact ? 'py-2' : 'py-2.5')}>
            <div className="min-w-0">
              <p className={cn('font-medium truncate', isCompact ? 'text-sm' : 'text-sm')} title={requisicao.solicitante_nome}>
                {requisicao.solicitante_nome}
              </p>
              <p className="text-xs text-muted-foreground truncate">{requisicao.solicitante_setor}</p>
            </div>
          </td>

          {/* Quantidade */}
          <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-2.5')}>
            <span className={cn('font-semibold', isCompact ? 'text-sm' : 'text-sm')}>
              {requisicao.quantidade}
            </span>
            <span className="text-muted-foreground text-xs ml-1">{requisicao.unidade}</span>
          </td>

          {/* Prioridade */}
          <td className={cn('px-2 text-center', isCompact ? 'py-2' : 'py-2.5')}>
            <PriorityBadge priority={requisicao.prioridade} />
          </td>

          {/* Status */}
          <td className={cn('px-2 text-center', isCompact ? 'py-2' : 'py-2.5')}>
            <StatusBadge status={requisicao.status} showIcon={false} />
          </td>

          {/* Comprador */}
          <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-2.5')}>
            {requisicao.comprador_nome ? (
              <span className="text-sm font-medium truncate block" title={requisicao.comprador_nome}>{requisicao.comprador_nome}</span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </td>

          {/* Fornecedor */}
          <td className={cn('px-3 text-center', isCompact ? 'py-2' : 'py-2.5')}>
            {requisicao.fornecedor_nome ? (
              <span className="text-sm font-medium truncate block" title={requisicao.fornecedor_nome}>{requisicao.fornecedor_nome}</span>
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </td>

          {/* Previsão */}
          <td className={cn('px-2 text-center', isCompact ? 'py-2' : 'py-2.5')}>
            <DeliveryBadge previsao={requisicao.previsao_entrega} />
          </td>

          {/* SLA */}
          <td className={cn('px-2 text-center', isCompact ? 'py-2' : 'py-2.5')}>
            <SLAIndicator requisicao={requisicao} compact={false} />
          </td>

          {/* Valor */}
          <td className={cn('px-3 text-right', isCompact ? 'py-2' : 'py-2.5')}>
            <span className={cn('font-semibold tabular-nums', isCompact ? 'text-sm' : 'text-sm')}>{formatCurrency(requisicao.valor)}</span>
          </td>

          {/* Data */}
          <td className={cn('px-3 text-center text-muted-foreground tabular-nums', isCompact ? 'py-2 text-xs' : 'py-2.5 text-sm')}>
            {formatDate(requisicao.created_at)}
          </td>

          {/* Ações */}
          <td className={cn('px-2 text-right', isCompact ? 'py-2' : 'py-2.5')}>
            <QuickActionsMenu
              requisicao={requisicao}
              onView={onViewDetails}
              onStatusUpdate={onStatusUpdate}
              onSendEmail={onSendEmail}
            />
          </td>
        </tr>

        {isExpanded && (
          <tr className="bg-muted/30">
            <td colSpan={hasMultiSelect ? 15 : 14} className="p-0">
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
                      {requisicao.solicitante_empresa && (
                        <p className="text-xs">
                          <span className="text-muted-foreground">Empresa: </span>
                          <span className="font-medium">{requisicao.solicitante_empresa}</span>
                        </p>
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
    </TooltipProvider>
  );
}
