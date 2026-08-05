import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileDropzone, UploadFile } from '@/components/orcamento/FileDropzone';
import { FornecedorOrcamento, brl } from '@/components/orcamento/types';
import { compararCotacoes } from '@/components/cotacao/comparativo';
import { extrairDocumentos } from '@/lib/extractDocs';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Crown,
  FileSearch,
  Loader2,
  Package,
  RotateCcw,
  Search,
  TrendingDown,
  Users,
} from 'lucide-react';

export default function CotacaoInteligente() {
  const { toast } = useToast();
  const [pedidoFile, setPedidoFile] = useState<UploadFile[]>([]);
  const [orcamentoFiles, setOrcamentoFiles] = useState<UploadFile[]>([]);
  const [pedido, setPedido] = useState<FornecedorOrcamento | null>(null);
  const [fornecedores, setFornecedores] = useState<FornecedorOrcamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');

  const linhas = useMemo(
    () => compararCotacoes(pedido?.itens ?? [], fornecedores),
    [pedido, fornecedores]
  );

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return linhas;
    return linhas.filter(
      (l) => l.descricao.toLowerCase().includes(q) || (l.codigo ?? '').toLowerCase().includes(q)
    );
  }, [linhas, busca]);

  const resumo = useMemo(() => {
    const totaisPorFornecedor = fornecedores.map((f) => ({
      id: f.id,
      nome: f.fornecedor,
      total: linhas.reduce((s, l) => s + (l.precos[f.id] ?? 0) * (l.quantidade ?? 1), 0),
      itens: linhas.filter((l) => l.precos[f.id] != null).length,
    }));
    const comValor = totaisPorFornecedor.filter((t) => t.total > 0);
    const melhor = comValor.length ? comValor.reduce((a, b) => (a.total <= b.total ? a : b)) : null;
    return {
      itens: linhas.length,
      fornecedores: fornecedores.length,
      economia: linhas.reduce((s, l) => s + l.economia, 0),
      divergencias: linhas.filter((l) => l.cotacoesFaltantes > 0).length,
      totaisPorFornecedor,
      melhor,
    };
  }, [linhas, fornecedores]);

  const comparar = async () => {
    setLoading(true);
    try {
      const [ped, orcs] = await Promise.all([
        extrairDocumentos(pedidoFile.map((f) => f.file), 'pedido'),
        extrairDocumentos(orcamentoFiles.map((f) => f.file), 'orcamento'),
      ]);
      setPedido(ped[0] ?? null);
      setFornecedores(orcs);
      toast({
        title: 'Cotações comparadas',
        description: `${orcs.length} fornecedor(es) identificado(s) · ${ped[0]?.itens.length ?? 0} itens no pedido`,
      });
    } catch (e) {
      toast({
        title: 'Erro na comparação',
        description: e instanceof Error ? e.message : String(e),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => {
    setPedido(null);
    setFornecedores([]);
  };

  const th = 'px-3 py-3 text-left data-label whitespace-nowrap';
  const analisado = fornecedores.length > 0;

  return (
    <div className="page-shell pb-12 stack-section">
      <header className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <FileSearch className="h-6 w-6 text-primary" strokeWidth={1.75} /> Cotação Inteligente
        </h1>
        <p className="page-subtitle">
          Envie o pedido de compra e quantos orçamentos precisar — a IA identifica os fornecedores reais,
          compara item a item e indica onde comprar.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5 stack-md">
          <h2 className="data-label">Pedido de Compra</h2>
          <FileDropzone
            files={pedidoFile}
            multiple={false}
            title="Arraste o pedido de compra"
            subtitle="Um arquivo · PDF, Excel (xlsx/xls/csv) ou imagem"
            disabled={loading}
            onAdd={(fs) => setPedidoFile(fs.slice(0, 1).map((file) => ({ id: crypto.randomUUID(), file })))}
            onRemove={() => setPedidoFile([])}
          />
        </div>

        <div className="surface-card p-5 stack-md">
          <h2 className="data-label">Orçamentos dos Fornecedores</h2>
          <FileDropzone
            files={orcamentoFiles}
            disabled={loading}
            title="Arraste os orçamentos dos fornecedores"
            subtitle="Múltiplos arquivos · PDF, Excel (xlsx/xls/csv) ou imagens"
            onAdd={(fs) =>
              setOrcamentoFiles((prev) => [...prev, ...fs.map((file) => ({ id: crypto.randomUUID(), file }))])
            }
            onRemove={(id) => setOrcamentoFiles((prev) => prev.filter((f) => f.id !== id))}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={comparar} disabled={!pedidoFile.length || !orcamentoFiles.length || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
          {loading ? 'Lendo documentos com IA...' : 'Comparar Cotações'}
        </Button>
        {analisado && (
          <Button variant="ghost" onClick={limpar}>
            <RotateCcw className="mr-2 h-4 w-4" /> Limpar análise
          </Button>
        )}
      </div>

      {analisado && (
        <>
          <section className="metric-grid">
            {[
              { label: 'Itens analisados', value: String(resumo.itens), icon: Package },
              { label: 'Fornecedores', value: String(resumo.fornecedores), icon: Users },
              { label: 'Economia potencial', value: brl(resumo.economia), icon: TrendingDown, accent: true },
              { label: 'Itens sem cotação completa', value: String(resumo.divergencias), icon: AlertTriangle },
            ].map((c) => (
              <div key={c.label} className="surface-card p-5">
                <div className="flex items-center gap-2">
                  <c.icon className="h-4 w-4 text-[hsl(var(--text-quaternary))]" strokeWidth={1.75} />
                  <p className="data-label">{c.label}</p>
                </div>
                <p
                  className={cn(
                    'mt-2 text-[26px] font-semibold tabular-nums tracking-[-0.02em]',
                    c.accent ? 'text-primary' : 'text-[hsl(var(--text-primary))]'
                  )}
                >
                  {c.value}
                </p>
              </div>
            ))}
          </section>

          <section className="surface-card p-5 stack-md">
            <h2 className="data-label">Onde comprar</h2>
            <p className="text-[15px] text-[hsl(var(--text-primary))]">
              Melhor proposta cheia:{' '}
              <span className="font-semibold text-primary">{resumo.melhor?.nome ?? '—'}</span>
              {resumo.melhor ? ` · ${brl(resumo.melhor.total)}` : ''}
            </p>
            <div className="space-y-2">
              {resumo.totaisPorFornecedor
                .slice()
                .sort((a, b) => a.total - b.total)
                .map((t) => {
                  const max = Math.max(...resumo.totaisPorFornecedor.map((x) => x.total), 1);
                  return (
                    <div key={t.id} className="flex items-center gap-3">
                      <span className="w-48 truncate text-[12px] text-[hsl(var(--text-tertiary))]">{t.nome}</span>
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-2 rounded-full',
                            t.id === resumo.melhor?.id ? 'bg-primary' : 'bg-muted-foreground/30'
                          )}
                          style={{ width: `${(t.total / max) * 100}%` }}
                        />
                      </div>
                      <span className="w-28 text-right text-[12px] font-semibold tabular-nums">{brl(t.total)}</span>
                    </div>
                  );
                })}
            </div>
          </section>

          <section className="stack-md">
            <div className="relative min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--text-quaternary))]" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar por código ou descrição"
                className="pl-9"
              />
            </div>

            <div className="surface-card overflow-x-auto">
              <table className="w-full min-w-[980px] text-[13px]">
                <thead>
                  <tr className="border-b border-[hsl(var(--border-subtle))]">
                    <th className={th}>Código</th>
                    <th className={th}>Descrição</th>
                    <th className={th}>Qtd.</th>
                    {fornecedores.map((f) => (
                      <th key={f.id} className={th}>
                        {f.fornecedor}
                      </th>
                    ))}
                    <th className={th}>Melhor preço</th>
                    <th className={th}>Variação vs. média</th>
                    <th className={th}>Economia</th>
                    <th className={th}>Onde comprar</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map((l) => {
                    const melhorNome = fornecedores.find((f) => f.id === l.melhorFornecedorId)?.fornecedor;
                    return (
                      <tr
                        key={l.chave}
                        className="border-b border-[hsl(var(--border-subtle))] transition-colors last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-3 py-3 font-medium tabular-nums">{l.codigo ?? '—'}</td>
                        <td className="px-3 py-3 text-[hsl(var(--text-primary))]">{l.descricao}</td>
                        <td className="px-3 py-3 tabular-nums">{l.quantidade ?? '—'}</td>
                        {fornecedores.map((f) => {
                          const p = l.precos[f.id];
                          const melhor = l.melhorFornecedorId === f.id;
                          return (
                            <td
                              key={f.id}
                              className={cn(
                                'px-3 py-3 tabular-nums',
                                melhor && 'font-semibold text-primary',
                                p == null && 'text-[hsl(var(--text-quaternary))]'
                              )}
                            >
                              {p == null ? 'Não cotado' : brl(p)}
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 font-semibold tabular-nums text-primary">{brl(l.melhorPreco)}</td>
                        <td
                          className={cn(
                            'px-3 py-3 tabular-nums',
                            l.variacaoPct <= 0 ? 'text-emerald-600' : 'text-amber-600'
                          )}
                        >
                          {l.melhorPreco == null
                            ? '—'
                            : `${l.variacaoPct > 0 ? '+' : ''}${l.variacaoPct.toFixed(1)}%`}
                        </td>
                        <td className="px-3 py-3 font-medium tabular-nums">{brl(l.economia)}</td>
                        <td className="px-3 py-3">
                          {melhorNome ? (
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                              <Crown className="h-3.5 w-3.5 text-primary" />
                              {melhorNome}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtradas.length === 0 && (
                    <tr>
                      <td colSpan={8 + fornecedores.length} className="px-3 py-10 text-center text-[hsl(var(--text-quaternary))]">
                        Nenhum item encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
