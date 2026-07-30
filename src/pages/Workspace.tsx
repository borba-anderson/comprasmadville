import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KANBAN_STAGES, KanbanRequisicao, KanbanStageId, resolveStage, formatBRL } from '@/components/workspace/types';
import { KanbanColumn } from '@/components/workspace/KanbanColumn';
import { CardDetailPanel } from '@/components/workspace/CardDetailPanel';
import { Search, RefreshCw, LayoutGrid } from 'lucide-react';

export default function Workspace() {
  const { toast } = useToast();
  const [reqs, setReqs] = useState<KanbanRequisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<KanbanStageId | null>(null);
  const [selected, setSelected] = useState<KanbanRequisicao | null>(null);

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('requisicoes')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' });
      return;
    }
    setReqs((data ?? []) as unknown as KanbanRequisicao[]);
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return reqs;
    return reqs.filter((r) =>
      [r.item_nome, r.protocolo, r.fornecedor_nome, r.comprador_nome, r.solicitante_nome]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [reqs, busca]);

  const porColuna = useMemo(() => {
    const map = new Map<KanbanStageId, KanbanRequisicao[]>();
    KANBAN_STAGES.forEach((s) => map.set(s.id, []));
    filtrados.forEach((r) => map.get(resolveStage(r))?.push(r));
    return map;
  }, [filtrados]);

  const mover = async (stageId: KanbanStageId) => {
    const id = draggingId;
    setDraggingId(null);
    setOverStage(null);
    if (!id) return;
    const req = reqs.find((r) => r.id === id);
    if (!req || resolveStage(req) === stageId) return;

    const anterior = reqs;
    setReqs((prev) => prev.map((r) => (r.id === id ? { ...r, kanban_stage: stageId } : r)));

    const { error } = await supabase
      .from('requisicoes')
      .update({ kanban_stage: stageId } as never)
      .eq('id', id);

    if (error) {
      setReqs(anterior);
      toast({ title: 'Não foi possível mover', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Cartão movido', description: KANBAN_STAGES.find((s) => s.id === stageId)?.label });
  };

  const totalValor = filtrados.reduce((s, r) => s + (r.valor ?? r.valor_orcado ?? 0), 0);

  return (
    <div className="page-shell pb-10">
      <header className="page-header flex-row items-end justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" strokeWidth={1.75} /> Workspace
          </h1>
          <p className="page-subtitle">
            {filtrados.length} pedidos em fluxo · {formatBRL(totalValor)} em valor estimado
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--text-quaternary))]" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar pedido, fornecedor..."
              className="w-64 pl-9"
            />
          </div>
          <Button variant="outline" size="icon" onClick={carregar} disabled={loading}>
            <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          </Button>
        </div>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {KANBAN_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            cards={porColuna.get(stage.id) ?? []}
            isOver={overStage === stage.id}
            draggingId={draggingId}
            onCardClick={setSelected}
            onCardDragStart={setDraggingId}
            onCardDragEnd={() => {
              setDraggingId(null);
              setOverStage(null);
            }}
            onDragOver={() => setOverStage(stage.id)}
            onDragLeave={() => setOverStage((s) => (s === stage.id ? null : s))}
            onDrop={() => mover(stage.id)}
          />
        ))}
      </div>

      <CardDetailPanel
        req={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onUpdated={(r) => {
          setReqs((prev) => prev.map((x) => (x.id === r.id ? r : x)));
          setSelected(r);
        }}
      />
    </div>
  );
}
