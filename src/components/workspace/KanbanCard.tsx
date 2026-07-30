import { Building2, CalendarClock, User, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from '@/components/PriorityBadge';
import { KanbanRequisicao, formatBRL } from './types';

interface KanbanCardProps {
  req: KanbanRequisicao;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dragging?: boolean;
}

export function KanbanCard({ req, onClick, onDragStart, onDragEnd, dragging }: KanbanCardProps) {
  const prazo = req.previsao_entrega
    ? (() => {
        const [y, m, d] = req.previsao_entrega.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      })()
    : null;

  const atrasado =
    req.previsao_entrega && !['recebido', 'cancelado', 'rejeitado'].includes(req.status)
      ? new Date(req.previsao_entrega) < new Date(new Date().toDateString())
      : false;

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'surface-card cursor-pointer select-none p-3 transition-all duration-150',
        'hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant-md)]',
        dragging && 'opacity-40'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold leading-snug text-[hsl(var(--text-primary))] line-clamp-2">
          {req.item_nome}
        </p>
        <PriorityBadge priority={req.prioridade} showIcon={false} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[hsl(var(--text-tertiary))]">
        <span className="inline-flex items-center gap-1">
          <Hash className="h-3 w-3" /> {req.protocolo}
        </span>
        <span className="inline-flex items-center gap-1 truncate">
          <Building2 className="h-3 w-3" /> {req.fornecedor_nome || 'Sem fornecedor'}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] text-[hsl(var(--text-tertiary))] truncate">
          <User className="h-3 w-3" /> {req.comprador_nome || req.solicitante_nome}
        </span>
        <span className="text-[12px] font-semibold tabular-nums text-[hsl(var(--text-primary))]">
          {formatBRL(req.valor ?? req.valor_orcado)}
        </span>
      </div>

      {prazo && (
        <div
          className={cn(
            'mt-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium',
            atrasado ? 'bg-red-100 text-red-700' : 'bg-muted text-[hsl(var(--text-tertiary))]'
          )}
        >
          <CalendarClock className="h-3 w-3" /> {prazo}
        </div>
      )}
    </article>
  );
}
