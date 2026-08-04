import { FornecedorOrcamento, OrcamentoItem } from '@/components/orcamento/types';
import { acharChaveEquivalente, chaveItem } from '@/lib/matching';

export type AuditoriaStatus = 'ok' | 'quantidade' | 'preco' | 'ambos' | 'nao_faturado' | 'extra';

export interface LinhaAuditoria {
  chave: string;
  codigo: string | null;
  descricao: string;
  qtdPedido: number | null;
  qtdNota: number | null;
  precoPedido: number | null;
  precoNota: number | null;
  difQtd: number;
  difPrecoPct: number;
  impacto: number;
  status: AuditoriaStatus;
}

const unitario = (i: OrcamentoItem) =>
  i.preco_unitario ?? (i.preco_total && i.quantidade ? i.preco_total / i.quantidade : null);

export function auditar(
  pedido: FornecedorOrcamento | null,
  nota: FornecedorOrcamento | null
): LinhaAuditoria[] {
  const linhas = new Map<string, LinhaAuditoria>();

  const criar = (item: OrcamentoItem, chave: string): LinhaAuditoria => ({
    chave,
    codigo: item.codigo ?? null,
    descricao: item.descricao,
    qtdPedido: null,
    qtdNota: null,
    precoPedido: null,
    precoNota: null,
    difQtd: 0,
    difPrecoPct: 0,
    impacto: 0,
    status: 'ok',
  });

  for (const item of pedido?.itens ?? []) {
    const chave = acharChaveEquivalente(item, linhas) ?? chaveItem(item);
    const l = linhas.get(chave) ?? criar(item, chave);
    if (!l.codigo && item.codigo) l.codigo = item.codigo;
    l.qtdPedido = (l.qtdPedido ?? 0) + (item.quantidade ?? 0) || item.quantidade ?? null;
    l.precoPedido = l.precoPedido ?? unitario(item);
    linhas.set(chave, l);
  }

  for (const item of nota?.itens ?? []) {
    const chave = acharChaveEquivalente(item, linhas) ?? chaveItem(item);
    const l = linhas.get(chave) ?? criar(item, chave);
    if (!l.codigo && item.codigo) l.codigo = item.codigo;
    l.qtdNota = (l.qtdNota ?? 0) + (item.quantidade ?? 0) || item.quantidade ?? null;
    l.precoNota = l.precoNota ?? unitario(item);
    linhas.set(chave, l);
  }


  return Array.from(linhas.values()).map((l) => {
    const semPedido = l.qtdPedido == null && l.precoPedido == null;
    const semNota = l.qtdNota == null && l.precoNota == null;

    l.difQtd = (l.qtdNota ?? 0) - (l.qtdPedido ?? 0);
    l.difPrecoPct =
      l.precoPedido && l.precoNota && l.precoPedido > 0
        ? ((l.precoNota - l.precoPedido) / l.precoPedido) * 100
        : 0;

    const totalPedido = (l.precoPedido ?? 0) * (l.qtdPedido ?? 0);
    const totalNota = (l.precoNota ?? 0) * (l.qtdNota ?? 0);
    l.impacto = totalNota - totalPedido;

    const qtdDiverge = !semPedido && !semNota && l.qtdPedido != null && l.qtdNota != null && l.difQtd !== 0;
    const precoDiverge = Math.abs(l.difPrecoPct) > 0.5;

    l.status = semNota
      ? 'nao_faturado'
      : semPedido
        ? 'extra'
        : qtdDiverge && precoDiverge
          ? 'ambos'
          : qtdDiverge
            ? 'quantidade'
            : precoDiverge
              ? 'preco'
              : 'ok';

    return l;
  });
}

export const AUDITORIA_STATUS: Record<AuditoriaStatus, { label: string; cls: string }> = {
  ok: { label: 'Conforme', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  quantidade: { label: 'Quantidade alterada', cls: 'bg-amber-100 text-amber-800 border-amber-300' },
  preco: { label: 'Preço alterado', cls: 'bg-amber-100 text-amber-800 border-amber-300' },
  ambos: { label: 'Qtd. e preço alterados', cls: 'bg-red-100 text-red-800 border-red-300' },
  nao_faturado: { label: 'Não faturado', cls: 'bg-red-100 text-red-800 border-red-300' },
  extra: { label: 'Item extra na NF', cls: 'bg-red-100 text-red-800 border-red-300' },
};
