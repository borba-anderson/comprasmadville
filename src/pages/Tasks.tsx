import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PRIORIDADE_TASK,
  Task,
  TaskFiltro,
  TaskPrioridade,
  filtrarTasks,
  useTasks,
} from '@/components/tasks/useTasks';
import { CalendarDays, CheckCircle2, Flag, GripVertical, ListTodo, Plus, Sun, Trash2, X } from 'lucide-react';

const FILTROS: { key: TaskFiltro; label: string; icon: typeof Sun }[] = [
  { key: 'hoje', label: 'Hoje', icon: Sun },
  { key: 'semana', label: 'Esta Semana', icon: CalendarDays },
  { key: 'proximas', label: 'Próximas', icon: ListTodo },
  { key: 'concluidas', label: 'Concluídas', icon: CheckCircle2 },
];

const fmtData = (d?: string | null) =>
  d ? new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : null;

export default function Tasks() {
  const { tasks, add, update, remove, toggle, reorder } = useTasks();
  const [filtro, setFiltro] = useState<TaskFiltro>('hoje');
  const [novo, setNovo] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novaPrioridade, setNovaPrioridade] = useState<TaskPrioridade>('media');
  const [editando, setEditando] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState<string | null>(null);

  const lista = useMemo(() => filtrarTasks(tasks, filtro), [tasks, filtro]);
  const contagem = useMemo(
    () =>
      FILTROS.reduce<Record<string, number>>(
        (acc, f) => ({ ...acc, [f.key]: filtrarTasks(tasks, f.key).length }),
        {}
      ),
    [tasks]
  );

  const criar = () => {
    const titulo = novo.trim();
    if (!titulo) return;
    add({ titulo, data: novaData || null, prioridade: novaPrioridade, fornecedor: null, pedido: null });
    setNovo('');
    setNovaData('');
    setNovaPrioridade('media');
  };

  return (
    <div className="page-shell pb-12 stack-section">
      <header className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <ListTodo className="h-6 w-6 text-primary" strokeWidth={1.75} /> Tasks
        </h1>
        <p className="page-subtitle">
          Suas pendências de compras em uma lista simples — vinculadas a pedidos e fornecedores.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="surface-card h-fit p-2">
          <nav className="space-y-0.5">
            {FILTROS.map((f) => {
              const ativo = filtro === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFiltro(f.key)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                    ativo
                      ? 'bg-muted/70 text-[hsl(var(--text-primary))]'
                      : 'text-[hsl(var(--text-tertiary))] hover:bg-muted/40 hover:text-[hsl(var(--text-primary))]'
                  )}
                >
                  <f.icon className={cn('h-4 w-4', ativo ? 'text-primary' : 'opacity-70')} strokeWidth={1.75} />
                  <span className="flex-1 text-left">{f.label}</span>
                  <span className="text-[11px] tabular-nums text-[hsl(var(--text-quaternary))]">
                    {contagem[f.key] ?? 0}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="stack-md">
          <div className="surface-card flex flex-wrap items-center gap-2 p-3">
            <Plus className="ml-1 h-4 w-4 text-[hsl(var(--text-quaternary))]" />
            <Input
              value={novo}
              onChange={(e) => setNovo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && criar()}
              placeholder="Nova tarefa"
              className="h-9 min-w-[200px] flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
            <Input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className="h-9 w-[150px]"
            />
            <Select value={novaPrioridade} onValueChange={(v) => setNovaPrioridade(v as TaskPrioridade)}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={criar} disabled={!novo.trim()}>
              Adicionar
            </Button>
          </div>

          <ul className="surface-card divide-y divide-[hsl(var(--border-subtle))]">
            {lista.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                editando={editando === t.id}
                onEdit={() => setEditando(t.id)}
                onStopEdit={() => setEditando(null)}
                onToggle={() => toggle(t.id)}
                onUpdate={(patch) => update(t.id, patch)}
                onRemove={() => remove(t.id)}
                onDragStart={() => setArrastando(t.id)}
                onDropOn={() => {
                  if (arrastando && arrastando !== t.id) reorder(arrastando, t.id);
                  setArrastando(null);
                }}
              />
            ))}
            {lista.length === 0 && (
              <li className="px-4 py-14 text-center text-[13px] text-[hsl(var(--text-quaternary))]">
                Nada por aqui. Aproveite o dia.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

interface RowProps {
  task: Task;
  editando: boolean;
  onEdit: () => void;
  onStopEdit: () => void;
  onToggle: () => void;
  onUpdate: (patch: Partial<Task>) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDropOn: () => void;
}

function TaskRow({
  task,
  editando,
  onEdit,
  onStopEdit,
  onToggle,
  onUpdate,
  onRemove,
  onDragStart,
  onDropOn,
}: RowProps) {
  const prio = PRIORIDADE_TASK[task.prioridade];

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropOn}
      className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
    >
      <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-[hsl(var(--text-quaternary))] opacity-0 transition-opacity group-hover:opacity-100" />
      <Checkbox checked={task.concluida} onCheckedChange={onToggle} className="mt-0.5 rounded-full" />

      <div className="min-w-0 flex-1">
        {editando ? (
          <div className="space-y-2">
            <Input
              autoFocus
              value={task.titulo}
              onChange={(e) => onUpdate({ titulo: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && onStopEdit()}
              className="h-8"
            />
            <div className="flex flex-wrap gap-2">
              <Input
                type="date"
                value={task.data ?? ''}
                onChange={(e) => onUpdate({ data: e.target.value || null })}
                className="h-8 w-[150px]"
              />
              <Select
                value={task.prioridade}
                onValueChange={(v) => onUpdate({ prioridade: v as TaskPrioridade })}
              >
                <SelectTrigger className="h-8 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={task.fornecedor ?? ''}
                onChange={(e) => onUpdate({ fornecedor: e.target.value || null })}
                placeholder="Fornecedor (opcional)"
                className="h-8 w-[190px]"
              />
              <Input
                value={task.pedido ?? ''}
                onChange={(e) => onUpdate({ pedido: e.target.value || null })}
                placeholder="Pedido (ex. REQ-000123)"
                className="h-8 w-[190px]"
              />
              <Button size="sm" variant="ghost" onClick={onStopEdit}>
                <X className="mr-1 h-3.5 w-3.5" /> Fechar
              </Button>
            </div>
          </div>
        ) : (
          <button onClick={onEdit} className="w-full text-left">
            <p
              className={cn(
                'truncate text-[14px] font-medium text-[hsl(var(--text-primary))]',
                task.concluida && 'text-[hsl(var(--text-quaternary))] line-through'
              )}
            >
              {task.titulo}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[hsl(var(--text-quaternary))]">
              {fmtData(task.data) && (
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> {fmtData(task.data)}
                </span>
              )}
              <span className={cn('inline-flex items-center gap-1', prio.cls)}>
                <Flag className="h-3 w-3" /> {prio.label}
              </span>
              {task.fornecedor && <span>· {task.fornecedor}</span>}
              {task.pedido && <span className="tabular-nums">· {task.pedido}</span>}
            </div>
          </button>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        title="Excluir tarefa"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </li>
  );
}
