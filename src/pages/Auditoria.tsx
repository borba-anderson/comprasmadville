import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileDropzone, UploadFile } from '@/components/orcamento/FileDropzone';
import { FornecedorOrcamento, brl } from '@/components/orcamento/types';
import { AUDITORIA_STATUS, auditar } from '@/components/auditoria/auditoria';
import { extrairDocumentos } from '@/lib/extractDocs';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Loader2, RotateCcw, ScanSearch, Wallet } from 'lucide-react';

export default function Auditoria() {
  const { toast } = useToast();
  const [pedidoFile, setPedidoFile] = useState<UploadFile[]>([]);
  const [notaFile, setNotaFile] = useState<UploadFile[]>([]);
  const [pedido, setPedido] = useState<FornecedorOrcamento | null>(null);
  const [nota, setNota] = useState<FornecedorOrcamento | null>(null);
  const [loading, setLoading] = useState(false);

  const linhas = useMemo(() => auditar(pedido, nota), [pedido, nota]);
  const analisado = linhas.length > 0;

  const resumo = useMemo(
    () => ({
      itens: linhas.length,
      conformes: linhas.filter((l) => l.status === 'ok').length,
      divergentes: linhas.filter((l) => !['ok', 'revisao'].includes(l.status)).length,
      revisar: linhas.filter((l) => l.status === 'revisao').length,
      impacto: linhas.reduce((s, l) => s + l.impacto, 0),
    }),
    [linhas]
  );

  const analisar = async () => {
    setLoading(true);
    try {
      const [ped, nf] = await Promise.all([
        extrairDocumentos(pedidoFile.map((f) => f.file), 'pedido'),
        extrairDocumentos(notaFile.map((f) => f.file), 'nota_fiscal'),
      ]);
      setPedido(ped[0] ?? null);
      setNota(nf[0] ?? null);
      if (!ped[0]?.itens.length || !nf[0]?.itens.length) {
        throw new Error('Não foi possível identificar os itens em um dos documentos. Verifique a nitidez e o tipo dos arquivos.');
      }
      toast({
        title: 'Auditoria concluída',
        description: `${ped[0]?.itens.length ?? 0} itens no pedido · ${nf[0]?.itens.length ?? 0} itens na nota fiscal`,
      });
    } catch (e) {
      toast({
        title: 'Erro na auditoria',
        description: e instanceof Error ? e.message : String(e),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const th = 'px-3 py-3 text-left data-label whitespace-nowrap';

  return (
    <div className="page-shell pb-12 stack-section">
      <header className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <ScanSearch className="h-6 w-6 text-primary" strokeWidth={1.75} /> Auditoria
        </h1>
        <p className="page-subtitle">
          Envie o pedido/orçamento aprovado e a nota fiscal — a IA confere item a item se tudo foi faturado
          conforme o combinado, apontando alterações de quantidade e de preço.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="surface-card p-5 stack-md">
          <h2 className="data-label">Pedido / Orçamento aprovado</h2>
          <FileDropzone
            files={pedidoFile}
            multiple={false}
            title="Arraste o pedido ou orçamento"
            subtitle="Um arquivo · PDF, Excel (xlsx/xls/csv) ou imagem"
            disabled={loading}
            onAdd={(fs) => setPedidoFile(fs.slice(0, 1).map((file) => ({ id: crypto.randomUUID(), file })))}
            onRemove={() => setPedidoFile([])}
          />
        </div>
        <div className="surface-card p-5 stack-md">
          <h2 className="data-label">Nota Fiscal</h2>
          <FileDropzone
            files={notaFile}
            multiple={false}
            title="Arraste a nota fiscal"
            subtitle="Um arquivo · PDF, Excel (xlsx/xls/csv) ou imagem"
            disabled={loading}
            onAdd={(fs) => setNotaFile(fs.slice(0, 1).map((file) => ({ id: crypto.randomUUID(), file })))}
            onRemove={() => setNotaFile([])}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={analisar} disabled={!pedidoFile.length || !notaFile.length || loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
          {loading ? 'Auditando documentos...' : 'Auditar faturamento'}
        </Button>
        {analisado && (
          <Button
            variant="ghost"
            onClick={() => {
              setPedido(null);
              setNota(null);
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Limpar auditoria
          </Button>
        )}
      </div>

      {analisado && (
        <>
          <section className="metric-grid">
            {[
              { label: 'Itens auditados', value: String(resumo.itens), icon: ScanSearch },
              { label: 'Conformes', value: String(resumo.conformes), icon: CheckCircle2 },
              {
                label: resumo.revisar ? 'Divergências / revisar' : 'Divergências',
                value: resumo.revisar ? `${resumo.divergentes} / ${resumo.revisar}` : String(resumo.divergentes),
                icon: AlertTriangle,
              },
              {
                label: 'Impacto financeiro',
                value: `${resumo.impacto > 0 ? '+' : ''}${brl(resumo.impacto)}`,
                icon: Wallet,
                accent: true,
              },
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

          {(pedido?.fornecedor || nota?.fornecedor) && (
            <p className="text-[13px] text-[hsl(var(--text-tertiary))]">
              Pedido: <strong>{pedido?.fornecedor ?? '—'}</strong> · Nota fiscal:{' '}
              <strong>{nota?.fornecedor ?? '—'}</strong>
            </p>
          )}

          <div className="surface-card overflow-x-auto">
            <table className="w-full min-w-[1040px] text-[13px]">
              <thead>
                <tr className="border-b border-[hsl(var(--border-subtle))]">
                  <th className={th}>Código</th>
                  <th className={th}>Descrição</th>
                  <th className={th}>Qtd. pedido</th>
                  <th className={th}>Qtd. NF</th>
                  <th className={th}>Preço pedido</th>
                  <th className={th}>Preço NF</th>
                  <th className={th}>Variação preço</th>
                  <th className={th}>Impacto</th>
                  <th className={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr
                    key={l.chave}
                    className="border-b border-[hsl(var(--border-subtle))] last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-3 py-3 font-medium tabular-nums">{l.codigo ?? '—'}</td>
                    <td className="px-3 py-3 text-[hsl(var(--text-primary))]">{l.descricao}</td>
                    <td className="px-3 py-3 tabular-nums">{l.qtdPedido ?? '—'}</td>
                    <td
                      className={cn(
                        'px-3 py-3 tabular-nums',
                        l.difQtd !== 0 && l.qtdNota != null && 'font-semibold text-amber-600'
                      )}
                    >
                      {l.qtdNota ?? '—'}
                      {l.difQtd !== 0 && l.qtdNota != null && l.qtdPedido != null && (
                        <span className="ml-1 text-[11px]">({l.difQtd > 0 ? '+' : ''}{l.difQtd})</span>
                      )}
                    </td>
                    <td className="px-3 py-3 tabular-nums">{brl(l.precoPedido)}</td>
                    <td className="px-3 py-3 tabular-nums">{brl(l.precoNota)}</td>
                    <td
                      className={cn(
                        'px-3 py-3 tabular-nums',
                        l.difPrecoPct > 0 ? 'text-red-600' : l.difPrecoPct < 0 ? 'text-emerald-600' : ''
                      )}
                    >
                      {l.precoPedido && l.precoNota
                        ? `${l.difPrecoPct > 0 ? '+' : ''}${l.difPrecoPct.toFixed(1)}%`
                        : '—'}
                    </td>
                    <td
                      className={cn(
                        'px-3 py-3 tabular-nums font-medium',
                        l.impacto > 0 ? 'text-red-600' : l.impacto < 0 ? 'text-emerald-600' : ''
                      )}
                    >
                      {l.impacto ? `${l.impacto > 0 ? '+' : ''}${brl(l.impacto)}` : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          'inline-flex whitespace-nowrap rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide',
                          AUDITORIA_STATUS[l.status].cls
                        )}
                      >
                        {AUDITORIA_STATUS[l.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
