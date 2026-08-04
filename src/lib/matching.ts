/**
 * Normalização e casamento de itens entre documentos (pedido × orçamentos × NF).
 * Documentos diferentes escrevem o mesmo código de formas diferentes
 * (DR4403L5, DR.4403L5, DR-4403 L5), por isso o código é reduzido a
 * apenas letras e números antes de comparar.
 */

export const normalizarCodigo = (s?: string | null) =>
  (s ?? '')
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '');

export const normalizarDescricao = (s?: string | null) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export interface ItemBase {
  codigo?: string | null;
  descricao: string;
}

/** Chave primária: código normalizado; sem código, descrição normalizada. */
export const chaveItem = (i: ItemBase) => {
  const cod = normalizarCodigo(i.codigo);
  return cod ? `cod:${cod}` : `desc:${normalizarDescricao(i.descricao)}`;
};

/** Tokens significativos da descrição (ignora ruído curto). */
const tokens = (s: string) => normalizarDescricao(s).split(' ').filter((t) => t.length > 1);

/** Similaridade Jaccard entre descrições (0 a 1). */
export function similaridade(a: string, b: string): number {
  const A = new Set(tokens(a));
  const B = new Set(tokens(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  A.forEach((t) => {
    if (B.has(t)) inter++;
  });
  return inter / (A.size + B.size - inter);
}

/**
 * Encontra a chave existente equivalente ao item, tolerando variações de código
 * e descrição. Retorna null quando é realmente um item novo.
 */
export function acharChaveEquivalente(
  item: ItemBase,
  existentes: Map<string, ItemBase>
): string | null {
  const direta = chaveItem(item);
  if (existentes.has(direta)) return direta;

  const cod = normalizarCodigo(item.codigo);

  // 1) código contido/contendo (ex.: "DEA4014LT" × "DE4014LT" com prefixo diferente)
  if (cod) {
    for (const [chave, outro] of existentes) {
      const c2 = normalizarCodigo(outro.codigo);
      if (!c2) continue;
      if (c2 === cod) return chave;
      if (cod.length >= 5 && c2.length >= 5 && (cod.endsWith(c2) || c2.endsWith(cod))) return chave;
    }
  }

  // 2) descrição muito parecida
  let melhor: { chave: string; score: number } | null = null;
  for (const [chave, outro] of existentes) {
    const score = similaridade(item.descricao, outro.descricao);
    if (score >= 0.75 && (!melhor || score > melhor.score)) melhor = { chave, score };
  }
  return melhor?.chave ?? null;
}
