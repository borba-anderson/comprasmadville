import { cn } from '@/lib/utils';
import { KanbanStage, KanbanRequisicao, formatBRL } from './types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  stage: KanbanStage;
  cards: KanbanRequisicao[];
  isOver: boolean;
  draggingId: string | null;
  onCardClick: (req: KanbanRequisicao) => void;
  onCardDragStart: (id: string) => void;
  onCardDragEnd: () => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
}

export function KanbanColumn({
  stage,
  cards,
  isOver,
  draggingId,
  onCardClick,
  onCardDragStart,
  onCardDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: KanbanColumnProps) {
  const total = cards.reduce((s, c) => s + (c.valor ?? c.valor_orcado ?? 0), 0);

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      className={cn(
        'flex w-[272px] shrink-0 flex-col rounded-xl border bg-[hsl(var(--surface-1))] transition-colors',
        isOver ? 'border-primary/60 bg-primary/5' : 'border-[hsl(var(--border-subtle))]'
      )}
    >
      <header className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-semibold tracking-[-0.01em] text-[hsl(var(--text-primary))]">
            {stage.label}
          </h2>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-[hsl(var(--text-tertiary))]">
            {cards.length}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-[hsl(var(--text-quaternary))]">
          {total > 0 ? formatBRL(total) : stage.hint}
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-3 custom-scrollbar min-h-[120px] max-h-[calc(100vh-300px)]">
        {cards.map((req) => (
          <KanbanCard
            key={req.id}
            req={req}
            dragging={draggingId === req.id}
            onClick={() => onCardClick(req)}
            onDragStart={() => onCardDragStart(req.id)}
            onDragEnd={onCardDragEnd}
          />
        ))}
        {cards.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-[hsl(var(--border-subtle))] p-4 text-[11px] text-[hsl(var(--text-quaternary))]">
            Arraste cartões para cá
          </div>
        )}
      </div>
    </section>
  );
}
