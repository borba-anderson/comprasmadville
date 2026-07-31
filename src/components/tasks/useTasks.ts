import { useCallback, useEffect, useState } from 'react';

export type TaskPrioridade = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  titulo: string;
  data: string | null;
  prioridade: TaskPrioridade;
  fornecedor?: string | null;
  pedido?: string | null;
  concluida: boolean;
  concluidaEm?: string | null;
  ordem: number;
}

export const PRIORIDADE_TASK: Record<TaskPrioridade, { label: string; cls: string }> = {
  baixa: { label: 'Baixa', cls: 'text-[hsl(var(--text-quaternary))]' },
  media: { label: 'Média', cls: 'text-amber-600' },
  alta: { label: 'Alta', cls: 'text-red-600' },
};

const KEY = 'gmad.tasks.v1';

const hoje = () => new Date().toISOString().slice(0, 10);
const emDias = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

const SEED: Task[] = [
  { id: 't1', titulo: 'Cobrar orçamento pendente do fornecedor', data: hoje(), prioridade: 'alta', fornecedor: 'Madville Distribuidora', pedido: 'REQ-000142', concluida: false, ordem: 0 },
  { id: 't2', titulo: 'Validar prazo de entrega das chapas MDF', data: hoje(), prioridade: 'media', fornecedor: 'Fornecedor B', pedido: 'REQ-000138', concluida: false, ordem: 1 },
  { id: 't3', titulo: 'Negociar condição de pagamento 30/60', data: emDias(3), prioridade: 'media', fornecedor: 'Fornecedor A', pedido: null, concluida: false, ordem: 2 },
  { id: 't4', titulo: 'Revisar comparativo de cotação da semana', data: emDias(9), prioridade: 'baixa', fornecedor: null, pedido: null, concluida: false, ordem: 3 },
  { id: 't5', titulo: 'Conferir nota fiscal do pedido emitido', data: emDias(-2), prioridade: 'alta', fornecedor: 'Fornecedor C', pedido: 'REQ-000131', concluida: true, concluidaEm: emDias(-1), ordem: 4 },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Task[]) : SEED;
    } catch {
      return SEED;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch {
      /* ignore */
    }
  }, [tasks]);

  const add = useCallback((task: Omit<Task, 'id' | 'ordem' | 'concluida'>) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: crypto.randomUUID(), concluida: false, ordem: prev.length },
    ]);
  }, []);

  const update = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const remove = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggle = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, concluida: !t.concluida, concluidaEm: !t.concluida ? new Date().toISOString() : null }
          : t
      )
    );
  }, []);

  const reorder = useCallback((sourceId: string, targetId: string) => {
    setTasks((prev) => {
      const ordered = [...prev].sort((a, b) => a.ordem - b.ordem);
      const from = ordered.findIndex((t) => t.id === sourceId);
      const to = ordered.findIndex((t) => t.id === targetId);
      if (from < 0 || to < 0 || from === to) return prev;
      const [moved] = ordered.splice(from, 1);
      ordered.splice(to, 0, moved);
      return ordered.map((t, i) => ({ ...t, ordem: i }));
    });
  }, []);

  return { tasks, add, update, remove, toggle, reorder };
}

export type TaskFiltro = 'hoje' | 'semana' | 'proximas' | 'concluidas';

export function filtrarTasks(tasks: Task[], filtro: TaskFiltro): Task[] {
  const hojeStr = hoje();
  const fimSemana = emDias(7);
  const abertas = tasks.filter((t) => !t.concluida);
  const lista =
    filtro === 'concluidas'
      ? tasks.filter((t) => t.concluida)
      : filtro === 'hoje'
        ? abertas.filter((t) => !t.data || t.data <= hojeStr)
        : filtro === 'semana'
          ? abertas.filter((t) => t.data && t.data <= fimSemana)
          : abertas.filter((t) => !t.data || t.data > fimSemana);
  return [...lista].sort((a, b) => a.ordem - b.ordem);
}
