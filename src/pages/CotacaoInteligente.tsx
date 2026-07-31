import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileDropzone, UploadFile } from '@/components/orcamento/FileDropzone';
import { ItemDetailPanel } from '@/components/cotacao/ItemDetailPanel';
import {
  FORNECEDORES_MOCK,
  ITENS_MOCK,
  LinhaCotacao,
  brl,
  calcularLinhas,
} from '@/components/cotacao/mockData';
import { cn } from '@/lib/utils';
import {
  ArrowUpDown,
  AlertTriangle,
  Crown,
  FileSearch,
  Loader2,
  Search,
  Users,
  TrendingDown,
  Package,
} from 'lucide-react';

type SortKey = 'codigo' | 'descricao' | 'economia' | 'diferencaPct';

const STATUS_LABEL: Record<LinhaCotacao['status'], { label: string; cls: string }> = {
  economia: { label: 'Economia', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  atencao: { label: 'Acima da última compra', cls: 'bg-amber-100 text-amber-800 border-amber-300' },
  divergencia: { label: 'Divergência', cls: 'bg-red-100 text-red-800 border-red-300' },
};

export default function CotacaoInteligente() {
  const [pedido, setPedido] = useState<UploadFile[]>([]);
  const [orcamentos, setOrcamentos] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparado, setComparado] = useState(false);
  const [busca, setBusca] = useState('');
  const [fornecedorFiltro, setFornecedorFiltro] = useState('todos');
  const [sortKey, setSortKey] = useState<SortKey>('economia');
  const [asc, setAsc] = useState(false);
  const [selecionado, setSelecionado] = useState<LinhaCotacao | null>(null);

  const linhas = useMemo(() => calcularLinhas(ITENS_MOCK, FORNECEDORES_MOCK), []);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const base = linhas.filter((l) => {
      const matchBusca =
        !q || l.descricao.toLowerCase().includes(q) || l.codigo.toLowerCase().includes(q);
      const matchForn =
        fornecedorFiltro === 'todos' || l.melhorFornecedor === fornecedorFiltro;
      return matchBusca && matchForn;
    });
    return [...base].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === 'number' && typeof vb === 'number'
        ? va - vb
        : String(va).localeCompare(String(vb));
      return asc ? cmp : -cmp;
    });
  }, [linhas, busca, fornecedorFiltro, sortKey, asc]);

  const resumo = useMemo(
    () => ({
      itens: linhas.length,
      fornecedores: FORNECEDORES_MOCK.length,
      economia: linhas.reduce((s, l) => s + l.economia, 0),
      divergencias: linhas.filter((l) => l.status === 'divergencia').length,
    }),
    [linhas]
  );

  const comparar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setComparado(true);
    }, 900);
  };

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  };

  const th = 'px-3 py-3 text-left data-label whitespace-nowrap';

  return (
    <div className="page-shell pb-12 stack-section">
      <header className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <FileSearch className="h-6 w-6 text-primary" strokeWidth={1.75} /> Cotação Inteligente
        </h1>
        <p className="page-subtitle">
          Compare um Pedido de Compra com múltiplos orçamentos de fornecedores e identifique o melhor preço item a item.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5 stack-md">
          <h2 className="data-label">Pedido de Compra</h2>
          <FileDropzone
            files={pedido}
            multiple={false}
            title="Arraste o pedido de compra"
            subtitle="Um arquivo · PDF, Excel (xlsx/xls/csv) ou imagem"
            disabled={loading}
            onAdd={(fs) => setPedido(fs.slice(0, 1).map((file) => ({ id: crypto.randomUUID(), file })))}
            onRemove={() => setPedido([])}
          />
        </div>

        <div className="surface-card p-5 stack-md">
          <h2 className="data-label">Orçamentos dos Fornecedores</h2>
          <FileDropzone
            files={orcamentos}
            disabled={loading}
            title="Arraste os orçamentos dos fornecedores"
            subtitle="Múltiplos arquivos · PDF, Excel (xlsx/xls/csv) ou imagens"
            onAdd={(fs) =>
              setOrcamentos((prev) => [...prev, ...fs.map((file) => ({ id: crypto.randomUUID(), file }))])
            }
            onRemove={(id) => setOrcamentos((prev) => prev.filter((f) => f.id !== id))}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={comparar} disabled={!pedido.length || !orcamentos.length || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
          {loading ? 'Comparando cotações...' : 'Comparar Cotações'}
        </Button>
        {comparado && (
          <span className="text-[12px] text-[hsl(var(--text-quaternary))]">
            Dados simulados — a leitura real dos arquivos será habilitada em breve.
          </span>
        )}
      </div>

      {comparado && (
        <>
          <section className="metric-grid">
            {[
              { label: 'Itens analisados', value: String(resumo.itens), icon: Package },
              { label: 'Fornecedores', value: String(resumo.fornecedores), icon: Users },
              { label: 'Economia estimada', value: brl(resumo.economia), icon: TrendingDown, accent: true },
              { label: 'Itens com divergência', value: String(resumo.divergencias), icon: AlertTriangle },
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

          <section className="stack-md">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--text-quaternary))]" />
                <Input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Pesquisar por código ou descrição"
                  className="pl-9"
                />
              </div>
              <Select value={fornecedorFiltro} onValueChange={setFornecedorFiltro}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Fornecedor recomendado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os fornecedores</SelectItem>
                  {FORNECEDORES_MOCK.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economia">Ordenar por economia</SelectItem>
                  <SelectItem value="diferencaPct">Ordenar por diferença %</SelectItem>
                  <SelectItem value="codigo">Ordenar por código</SelectItem>
                  <SelectItem value="descricao">Ordenar por descrição</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setAsc((v) => !v)} title="Inverter ordem">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="surface-card overflow-x-auto">
              <table className="w-full min-w-[1180px] text-[13px]">
                <thead>
                  <tr className="border-b border-[hsl(var(--border-subtle))]">
                    <th className={th} onClick={() => toggleSort('codigo')}>Código</th>
                    <th className={th} onClick={() => toggleSort('descricao')}>Descrição</th>
                    <th className={th}>Qtd.</th>
                    <th className={th}>Última compra</th>
                    {FORNECEDORES_MOCK.map((f) => (
                      <th key={f} className={th}>{f}</th>
                    ))}
                    <th className={th}>Melhor preço</th>
                    <th className={th}>Diferença R$</th>
                    <th className={th}>Diferença %</th>
                    <th className={th}>Economia</th>
                    <th className={th}>Recomendado</th>
                    <th className={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map((l) => (
                    <tr
                      key={l.codigo}
                      onClick={() => setSelecionado(l)}
                      className="cursor-pointer border-b border-[hsl(var(--border-subtle))] transition-colors last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-3 py-3 font-medium tabular-nums">{l.codigo}</td>
                      <td className="px-3 py-3 text-[hsl(var(--text-primary))]">{l.descricao}</td>
                      <td className="px-3 py-3 tabular-nums">{l.quantidade}</td>
                      <td className="px-3 py-3 tabular-nums text-[hsl(var(--text-tertiary))]">{brl(l.ultimaCompra)}</td>
                      {FORNECEDORES_MOCK.map((f) => {
                        const p = l.precos[f];
                        const melhor = l.melhorFornecedor === f;
                        return (
                          <td
                            key={f}
                            className={cn(
                              'px-3 py-3 tabular-nums',
                              melhor && 'font-semibold text-primary',
                              p == null && 'text-[hsl(var(--text-quaternary))]'
                            )}
                          >
                            {brl(p)}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 font-semibold tabular-nums text-primary">{brl(l.melhorPreco)}</td>
                      <td
                        className={cn(
                          'px-3 py-3 tabular-nums',
                          l.diferenca <= 0 ? 'text-emerald-600' : 'text-amber-600'
                        )}
                      >
                        {l.diferenca <= 0 ? '' : '+'}
                        {brl(l.diferenca)}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-3 tabular-nums',
                          l.diferenca <= 0 ? 'text-emerald-600' : 'text-amber-600'
                        )}
                      >
                        {l.diferencaPct > 0 ? '+' : ''}
                        {l.diferencaPct.toFixed(1)}%
                      </td>
                      <td className="px-3 py-3 tabular-nums font-medium">{brl(l.economia)}</td>
                      <td className="px-3 py-3">
                        {l.melhorFornecedor ? (
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <Crown className="h-3.5 w-3.5 text-primary" />
                            {l.melhorFornecedor}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            'inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide',
                            STATUS_LABEL[l.status].cls
                          )}
                        >
                          {STATUS_LABEL[l.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtradas.length === 0 && (
                    <tr>
                      <td colSpan={14} className="px-3 py-10 text-center text-[hsl(var(--text-quaternary))]">
                        Nenhum item encontrado com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <ItemDetailPanel linha={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
