export interface OrcamentoItem {
  codigo?: string | null;
  descricao: string;
  quantidade?: number | null;
  embalagem?: string | null;
  preco_unitario?: number | null;
  preco_total?: number | null;
}

export interface FornecedorOrcamento {
  id: string;
  arquivo: string;
  fornecedor: string;
  prazo_entrega?: string | null;
  condicao_pagamento?: string | null;
  validade?: string | null;
  total?: number | null;
  itens: OrcamentoItem[];
}

export interface LinhaComparativa {
  chave: string;
  descricao: string;
  codigo?: string | null;
  porFornecedor: Record<
    string,
    {
      item?: OrcamentoItem;
      unitario?: number | null;
      total?: number | null;
    }
  >;
  melhorFornecedorId?: string;
  menorUnitario?: number | null;
  divergencias: string[];
}

export const normalizar = (s?: string | null) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const brl = (v?: number | null) =>
  typeof v === 'number' && !Number.isNaN(v)
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';

/** Constrói a matriz comparativa alinhando itens por código (ou descrição normalizada). */
export function construirComparativo(fornecedores: FornecedorOrcamento[]): LinhaComparativa[] {
  const linhas = new Map<string, LinhaComparativa>();

  for (const f of fornecedores) {
    for (const item of f.itens) {
      const chave = item.codigo ? `cod:${normalizar(item.codigo)}` : `desc:${normalizar(item.descricao)}`;
      if (!linhas.has(chave)) {
        linhas.set(chave, {
          chave,
          descricao: item.descricao,
          codigo: item.codigo ?? null,
          porFornecedor: {},
          divergencias: [],
        });
      }
      const linha = linhas.get(chave)!;
      if (!linha.codigo && item.codigo) linha.codigo = item.codigo;
      const unitario =
        item.preco_unitario ??
        (item.preco_total && item.quantidade ? item.preco_total / item.quantidade : null);
      linha.porFornecedor[f.id] = {
        item,
        unitario,
        total: item.preco_total ?? (unitario && item.quantidade ? unitario * item.quantidade : null),
      };
    }
  }

  return Array.from(linhas.values()).map((linha) => {
    const entradas = Object.entries(linha.porFornecedor);
    const validos = entradas.filter(([, v]) => typeof v.unitario === 'number');
    if (validos.length) {
      const melhor = validos.reduce((a, b) => ((a[1].unitario ?? Infinity) <= (b[1].unitario ?? Infinity) ? a : b));
      linha.melhorFornecedorId = melhor[0];
      linha.menorUnitario = melhor[1].unitario ?? null;
    }

    // divergências
    const divergencias: string[] = [];
    if (entradas.length < fornecedores.length) divergencias.push('Item ausente em algum fornecedor');
    const qtds = new Set(entradas.map(([, v]) => v.item?.quantidade ?? null).filter((q) => q != null));
    if (qtds.size > 1) divergencias.push('Quantidades divergentes');
    const embs = new Set(entradas.map(([, v]) => normalizar(v.item?.embalagem)).filter(Boolean));
    if (embs.size > 1) divergencias.push('Embalagens diferentes');
    const precos = validos.map(([, v]) => v.unitario as number);
    if (precos.length > 1) {
      const min = Math.min(...precos);
      const max = Math.max(...precos);
      if (min > 0 && (max - min) / min > 0.3) divergencias.push('Variação de preço acima de 30%');
    }
    linha.divergencias = divergencias;
    return linha;
  });
}

export interface ResumoComparativo {
  totaisPorFornecedor: { id: string; nome: string; total: number; itens: number }[];
  recomendadoId?: string;
  economia: number;
  economiaPct: number;
  totalCombinado: number;
  economiaCombinada: number;
}

export function calcularResumo(
  fornecedores: FornecedorOrcamento[],
  linhas: LinhaComparativa[]
): ResumoComparativo {
  const totais = fornecedores.map((f) => {
    const total = linhas.reduce((s, l) => s + (l.porFornecedor[f.id]?.total ?? 0), 0);
    const itens = linhas.filter((l) => l.porFornecedor[f.id]).length;
    return { id: f.id, nome: f.fornecedor, total, itens };
  });

  const completos = totais.filter((t) => t.total > 0);
  const melhor = completos.length
    ? completos.reduce((a, b) => (a.total <= b.total ? a : b))
    : undefined;
  const pior = completos.length
    ? completos.reduce((a, b) => (a.total >= b.total ? a : b))
    : undefined;

  const economia = melhor && pior ? pior.total - melhor.total : 0;
  const economiaPct = melhor && pior && pior.total > 0 ? (economia / pior.total) * 100 : 0;

  // cenário "cherry picking": menor preço item a item
  const totalCombinado = linhas.reduce((s, l) => {
    const melhorItem = l.melhorFornecedorId ? l.porFornecedor[l.melhorFornecedorId] : undefined;
    return s + (melhorItem?.total ?? 0);
  }, 0);

  return {
    totaisPorFornecedor: totais,
    recomendadoId: melhor?.id,
    economia,
    economiaPct,
    totalCombinado,
    economiaCombinada: melhor ? Math.max(melhor.total - totalCombinado, 0) : 0,
  };
}
