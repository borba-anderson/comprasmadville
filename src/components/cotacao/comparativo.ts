import { FornecedorOrcamento, OrcamentoItem } from '@/components/orcamento/types';
import { acharChaveEquivalente, chaveItem } from '@/lib/matching';

export interface LinhaCotacaoReal {
  chave: string;
  codigo: string | null;
  descricao: string;
  quantidade: number | null;
  precos: Record<string, number | null>;
  melhorFornecedorId: string | null;
  melhorPreco: number | null;
  maiorPreco: number | null;
  media: number | null;
  /** variação do melhor preço em relação à média das propostas (negativo = abaixo da média) */
  variacaoPct: number;
  economia: number;
  cotacoesFaltantes: number;
}

const unitario = (i: OrcamentoItem) =>
  i.preco_unitario ??
  (i.preco_total && i.quantidade ? i.preco_total / i.quantidade : null);

export function compararCotacoes(
  pedido: OrcamentoItem[],
  fornecedores: FornecedorOrcamento[]
): LinhaCotacaoReal[] {
  const base = new Map<string, LinhaCotacaoReal>();

  const criar = (item: OrcamentoItem, chave: string): LinhaCotacaoReal => ({
    chave,
    codigo: item.codigo ?? null,
    descricao: item.descricao,
    quantidade: item.quantidade ?? null,
    precos: {},
    melhorFornecedorId: null,
    melhorPreco: null,
    maiorPreco: null,
    media: null,
    variacaoPct: 0,
    economia: 0,
    cotacoesFaltantes: 0,
  });

  for (const item of pedido) {
    const chave = acharChaveEquivalente(item, base) ?? chaveItem(item);
    const linha = base.get(chave) ?? criar(item, chave);
    if (!linha.codigo && item.codigo) linha.codigo = item.codigo;
    if (linha.quantidade == null && item.quantidade != null) linha.quantidade = item.quantidade;
    base.set(chave, linha);
  }

  for (const f of fornecedores) {
    for (const item of f.itens) {
      const chave = acharChaveEquivalente(item, base) ?? chaveItem(item);
      const linha = base.get(chave) ?? criar(item, chave);
      base.set(chave, linha);
      if (!linha.codigo && item.codigo) linha.codigo = item.codigo;
      if (linha.quantidade == null && item.quantidade != null) linha.quantidade = item.quantidade;
      const preco = unitario(item);
      if (preco != null && linha.precos[f.id] == null) linha.precos[f.id] = preco;
    }
  }


  return Array.from(base.values()).map((l) => {
    for (const f of fornecedores) if (l.precos[f.id] == null) l.precos[f.id] = null;

    const validos = fornecedores
      .map((f) => ({ id: f.id, p: l.precos[f.id] }))
      .filter((x): x is { id: string; p: number } => typeof x.p === 'number' && x.p > 0);

    l.cotacoesFaltantes = fornecedores.length - validos.length;

    if (validos.length) {
      const melhor = validos.reduce((a, b) => (a.p <= b.p ? a : b));
      const pior = validos.reduce((a, b) => (a.p >= b.p ? a : b));
      const media = validos.reduce((s, v) => s + v.p, 0) / validos.length;
      l.melhorFornecedorId = melhor.id;
      l.melhorPreco = melhor.p;
      l.maiorPreco = pior.p;
      l.media = media;
      l.variacaoPct = media > 0 ? ((melhor.p - media) / media) * 100 : 0;
      l.economia = (pior.p - melhor.p) * (l.quantidade ?? 1);
    }
    return l;
  });
}
