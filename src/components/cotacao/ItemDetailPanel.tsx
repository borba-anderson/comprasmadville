import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LinhaCotacao, brl } from './mockData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react';

interface Props {
  linha: LinhaCotacao | null;
  onClose: () => void;
}

export function ItemDetailPanel({ linha, onClose }: Props) {
  if (!linha) return null;

  const serie = [...linha.historico]
    .sort((a, b) => a.data.localeCompare(b.data))
    .map((h) => ({
      label: new Date(h.data).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      preco: h.preco,
    }));
  if (linha.melhorPreco !== null) serie.push({ label: 'Cotação', preco: linha.melhorPreco });

  const Icon = linha.diferenca <= 0 ? TrendingDown : TrendingUp;

  return (
    <Sheet open onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-left text-[16px] leading-snug">{linha.descricao}</SheetTitle>
          <p className="text-left text-[12px] text-[hsl(var(--text-quaternary))]">
            Cód. {linha.codigo} · {linha.quantidade} un
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section className="grid grid-cols-2 gap-3">
            <div className="surface-card p-4">
              <p className="data-label">Última compra</p>
              <p className="mt-1 text-[18px] font-semibold tabular-nums">{brl(linha.ultimaCompra)}</p>
            </div>
            <div className="surface-card p-4">
              <p className="data-label">Melhor preço</p>
              <p className="mt-1 flex items-center gap-1.5 text-[18px] font-semibold tabular-nums text-primary">
                <Icon className="h-4 w-4" /> {brl(linha.melhorPreco)}
              </p>
            </div>
          </section>

          <section>
            <h3 className="data-label mb-2">Evolução de preços</h3>
            <div className="surface-card h-[180px] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={serie} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-subtle))" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={54} />
                  <Tooltip formatter={(v: number) => brl(v)} />
                  <Line
                    type="monotone"
                    dataKey="preco"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h3 className="data-label mb-2">Últimas compras</h3>
            <ul className="surface-card divide-y divide-[hsl(var(--border-subtle))]">
              {linha.historico.map((h) => (
                <li key={h.data} className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <div>
                    <p className="font-medium text-[hsl(var(--text-primary))]">{h.fornecedor}</p>
                    <p className="text-[11px] text-[hsl(var(--text-quaternary))]">
                      {new Date(h.data).toLocaleDateString('pt-BR')} · {h.quantidade} un
                    </p>
                  </div>
                  <span className="tabular-nums">{brl(h.preco)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="data-label mb-2">Justificativa da recomendação</h3>
            <div className="surface-card flex gap-3 p-4">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
              <p className="text-[13px] leading-relaxed text-[hsl(var(--text-secondary))]">
                {linha.melhorFornecedor ? (
                  <>
                    <strong>{linha.melhorFornecedor}</strong> apresenta o menor preço unitário (
                    {brl(linha.melhorPreco)}), {linha.diferenca <= 0 ? 'abaixo' : 'acima'} da última compra em{' '}
                    {Math.abs(linha.diferencaPct).toFixed(1)}%. Considerando {linha.quantidade} unidades, a
                    economia projetada é de <strong>{brl(linha.economia)}</strong>.
                    {linha.divergencia ? ` Atenção: ${linha.divergencia.toLowerCase()}.` : ''}
                  </>
                ) : (
                  'Nenhum fornecedor cotou este item.'
                )}
              </p>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
