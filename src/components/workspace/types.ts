import { Requisicao, RequisicaoStatus } from '@/types';

export type KanbanStageId =
  | 'novo_pedido'
  | 'cotacao'
  | 'comparando'
  | 'negociacao'
  | 'aprovacao'
  | 'pedido_emitido'
  | 'aguardando_nf'
  | 'concluido';

export interface KanbanStage {
  id: KanbanStageId;
  label: string;
  hint: string;
  /** Status sugerido ao mover o cartão para esta coluna (opcional) */
  status?: RequisicaoStatus;
}

export const KANBAN_STAGES: KanbanStage[] = [
  { id: 'novo_pedido', label: 'Novo Pedido', hint: 'Entrada de requisições', status: 'pendente' },
  { id: 'cotacao', label: 'Cotação', hint: 'Buscando fornecedores', status: 'cotando' },
  { id: 'comparando', label: 'Comparando', hint: 'Análise de propostas' },
  { id: 'negociacao', label: 'Negociação', hint: 'Ajuste de preço e prazo' },
  { id: 'aprovacao', label: 'Aprovação', hint: 'Aguardando decisão', status: 'aprovado' },
  { id: 'pedido_emitido', label: 'Pedido Emitido', hint: 'Compra realizada', status: 'comprado' },
  { id: 'aguardando_nf', label: 'Aguardando NF', hint: 'Documento fiscal / entrega', status: 'em_entrega' },
  { id: 'concluido', label: 'Concluído', hint: 'Recebido e finalizado', status: 'recebido' },
];

const STATUS_TO_STAGE: Record<RequisicaoStatus, KanbanStageId> = {
  pendente: 'novo_pedido',
  em_analise: 'cotacao',
  cotando: 'comparando',
  aprovado: 'aprovacao',
  comprado: 'pedido_emitido',
  em_entrega: 'aguardando_nf',
  recebido: 'concluido',
  rejeitado: 'concluido',
  cancelado: 'concluido',
};

export type KanbanRequisicao = Requisicao & {
  kanban_stage?: string | null;
  checklist?: ChecklistItem[] | null;
};

export interface ChecklistItem {
  id: string;
  texto: string;
  feito: boolean;
}

export const resolveStage = (req: KanbanRequisicao): KanbanStageId => {
  const raw = req.kanban_stage as KanbanStageId | null | undefined;
  if (raw && KANBAN_STAGES.some((s) => s.id === raw)) return raw;
  return STATUS_TO_STAGE[req.status] ?? 'novo_pedido';
};

export const formatBRL = (v?: number | null) =>
  typeof v === 'number'
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';
