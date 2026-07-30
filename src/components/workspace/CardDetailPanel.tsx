import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { ValueHistoryList } from '@/components/requisicao';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Comentario, ValorHistorico } from '@/types';
import { KanbanRequisicao, ChecklistItem, formatBRL, KANBAN_STAGES, resolveStage } from './types';
import { Paperclip, Plus, Send, Trash2, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CardDetailPanelProps {
  req: KanbanRequisicao | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (req: KanbanRequisicao) => void;
}

const fmtDateTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : null;

export function CardDetailPanel({ req, open, onClose, onUpdated }: CardDetailPanelProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [historico, setHistorico] = useState<ValorHistorico[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [novoItem, setNovoItem] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!req) return;
    setChecklist(Array.isArray(req.checklist) ? req.checklist : []);
    (async () => {
      const [{ data: cs }, { data: hs }] = await Promise.all([
        supabase.from('comentarios').select('*').eq('requisicao_id', req.id).order('created_at', { ascending: true }),
        supabase.from('valor_historico').select('*').eq('requisicao_id', req.id).order('created_at', { ascending: false }),
      ]);
      setComentarios((cs as Comentario[]) ?? []);
      setHistorico((hs as ValorHistorico[]) ?? []);
    })();
  }, [req]);

  if (!req) return null;

  const persistChecklist = async (next: ChecklistItem[]) => {
    setChecklist(next);
    setSaving(true);
    const { error } = await supabase
      .from('requisicoes')
      .update({ checklist: next } as never)
      .eq('id', req.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Erro ao salvar checklist', description: error.message, variant: 'destructive' });
      return;
    }
    onUpdated({ ...req, checklist: next });
  };

  const addChecklistItem = () => {
    if (!novoItem.trim()) return;
    persistChecklist([...checklist, { id: crypto.randomUUID(), texto: novoItem.trim(), feito: false }]);
    setNovoItem('');
  };

  const enviarComentario = async () => {
    if (!novoComentario.trim()) return;
    const { data, error } = await supabase
      .from('comentarios')
      .insert({
        requisicao_id: req.id,
        usuario_nome: profile?.nome ?? 'Usuário',
        conteudo: novoComentario.trim(),
      })
      .select()
      .single();
    if (error) {
      toast({ title: 'Erro ao comentar', description: error.message, variant: 'destructive' });
      return;
    }
    setComentarios((prev) => [...prev, data as Comentario]);
    setNovoComentario('');
  };

  const anexos = [
    req.arquivo_url ? { url: req.arquivo_url, nome: req.arquivo_nome || 'Anexo da requisição' } : null,
    req.orcamento_url ? { url: req.orcamento_url, nome: req.orcamento_nome || 'Orçamento' } : null,
  ].filter(Boolean) as { url: string; nome: string }[];

  const historicoEventos = [
    { label: 'Criada', at: req.created_at },
    { label: 'Aprovada', at: req.aprovado_em },
    { label: 'Comprada', at: req.comprado_em },
    { label: 'Entregue', at: req.entregue_em },
    { label: 'Recebida', at: req.recebido_em },
  ].filter((e) => e.at);

  const stageLabel = KANBAN_STAGES.find((s) => s.id === resolveStage(req))?.label;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-xl p-0">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="text-[18px] leading-tight">{req.item_nome}</SheetTitle>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <StatusBadge status={req.status} />
            <PriorityBadge priority={req.prioridade} />
            <span className="data-label">{stageLabel}</span>
          </div>
        </SheetHeader>
        <Separator />

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="space-y-6 px-6 py-5">
            {/* Descrição */}
            <section className="space-y-2">
              <h3 className="data-label">Descrição</h3>
              <dl className="grid grid-cols-2 gap-3 text-[13px]">
                <div><dt className="text-[hsl(var(--text-quaternary))]">Protocolo</dt><dd className="font-medium">{req.protocolo}</dd></div>
                <div><dt className="text-[hsl(var(--text-quaternary))]">Fornecedor</dt><dd className="font-medium">{req.fornecedor_nome || '—'}</dd></div>
                <div><dt className="text-[hsl(var(--text-quaternary))]">Responsável</dt><dd className="font-medium">{req.comprador_nome || req.solicitante_nome}</dd></div>
                <div><dt className="text-[hsl(var(--text-quaternary))]">Quantidade</dt><dd className="font-medium">{req.quantidade} {req.unidade}</dd></div>
                <div><dt className="text-[hsl(var(--text-quaternary))]">Valor estimado</dt><dd className="font-medium tabular-nums">{formatBRL(req.valor ?? req.valor_orcado)}</dd></div>
                <div><dt className="text-[hsl(var(--text-quaternary))]">Prazo</dt><dd className="font-medium">{req.previsao_entrega ? new Date(req.previsao_entrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—'}</dd></div>
              </dl>
              {req.especificacoes && (
                <p className="text-[13px] leading-relaxed text-[hsl(var(--text-secondary))]">{req.especificacoes}</p>
              )}
              <p className="text-[13px] leading-relaxed text-[hsl(var(--text-tertiary))]">{req.justificativa}</p>
              <Button asChild variant="outline" size="sm">
                <Link to={`/painel/${req.id}`}>
                  Abrir requisição <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </section>

            <Separator />

            {/* Checklist */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="data-label">Checklist</h3>
                <span className="text-[11px] text-[hsl(var(--text-quaternary))]">
                  {checklist.filter((c) => c.feito).length}/{checklist.length}
                </span>
              </div>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={item.feito}
                      onCheckedChange={(v) =>
                        persistChecklist(checklist.map((c) => (c.id === item.id ? { ...c, feito: !!v } : c)))
                      }
                    />
                    <span className={item.feito ? 'flex-1 text-[13px] line-through text-[hsl(var(--text-quaternary))]' : 'flex-1 text-[13px]'}>
                      {item.texto}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => persistChecklist(checklist.filter((c) => c.id !== item.id))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={novoItem}
                  onChange={(e) => setNovoItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                  placeholder="Nova tarefa..."
                />
                <Button variant="outline" size="icon" onClick={addChecklistItem} disabled={saving}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <Separator />

            {/* Comentários */}
            <section className="space-y-3">
              <h3 className="data-label">Comentários</h3>
              <div className="space-y-2">
                {comentarios.map((c) => (
                  <div key={c.id} className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center justify-between text-[11px] text-[hsl(var(--text-quaternary))]">
                      <span className="font-medium text-[hsl(var(--text-tertiary))]">{c.usuario_nome || 'Usuário'}</span>
                      <span>{fmtDateTime(c.created_at)}</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed">{c.conteudo}</p>
                  </div>
                ))}
                {comentarios.length === 0 && (
                  <p className="text-[12px] text-[hsl(var(--text-quaternary))]">Nenhum comentário ainda.</p>
                )}
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Escreva um comentário..."
                  rows={2}
                />
                <Button variant="outline" size="icon" onClick={enviarComentario}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <Separator />

            {/* Anexos */}
            <section className="space-y-2">
              <h3 className="data-label">Anexos</h3>
              {anexos.length === 0 && (
                <p className="text-[12px] text-[hsl(var(--text-quaternary))]">Nenhum anexo.</p>
              )}
              {anexos.map((a) => (
                <a
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-[hsl(var(--border-subtle))] px-3 py-2 text-[13px] hover:bg-muted/50"
                >
                  <Paperclip className="h-3.5 w-3.5 text-[hsl(var(--text-quaternary))]" />
                  <span className="truncate">{a.nome}</span>
                </a>
              ))}
            </section>

            <Separator />

            {/* Histórico */}
            <section className="space-y-3">
              <h3 className="data-label">Histórico</h3>
              <ul className="space-y-2">
                {historicoEventos.map((e) => (
                  <li key={e.label} className="flex items-center gap-2 text-[12px] text-[hsl(var(--text-tertiary))]">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-medium text-[hsl(var(--text-secondary))]">{e.label}</span>
                    <span>{fmtDateTime(e.at)}</span>
                  </li>
                ))}
              </ul>
              <ValueHistoryList history={historico} />
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
