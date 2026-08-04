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

const tokensSignificativos = (s: string) =>
  tokens(s).filter((t) => !['de', 'da', 'do', 'das', 'dos', 'un', 'und', 'unid', 'peca', 'produto', 'item'].includes(t));

const distanciaEdicao = (a: string, b: string) => {
  const anterior = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = anterior[0];
    anterior[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const acima = anterior[j];
      anterior[j] = Math.min(
        anterior[j] + 1,
        anterior[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diagonal = acima;
    }
  }
  return anterior[b.length];
};

const descricoesCompativeis = (a: string, b: string) => {
  const A = new Set(tokensSignificativos(a));
  const B = new Set(tokensSignificativos(b));
  if (!A.size || !B.size) return false;
  let intersecao = 0;
  A.forEach((token) => {
    if (B.has(token)) intersecao++;
  });
  return intersecao / Math.min(A.size, B.size) >= 0.6;
};

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

  // 1) código: tolera um único caractere OCR incorreto somente se a descrição também confirmar.
  if (cod) {
    for (const [chave, outro] of existentes) {
      const c2 = normalizarCodigo(outro.codigo);
      if (!c2) continue;
      if (c2 === cod) return chave;
      const codigoQuaseIgual =
        cod.length >= 6 &&
        c2.length >= 6 &&
        Math.abs(cod.length - c2.length) <= 1 &&
        distanciaEdicao(cod, c2) <= 1;
      if (codigoQuaseIgual && descricoesCompativeis(item.descricao, outro.descricao)) return chave;
    }
  }

  // 2) descrição muito parecida
  let melhor: { chave: string; score: number } | null = null;
  for (const [chave, outro] of existentes) {
    const score = similaridade(item.descricao, outro.descricao);
    const codigoOutro = normalizarCodigo(outro.codigo);
    const semConflitoDeCodigo = !cod || !codigoOutro;
    const compativel = descricoesCompativeis(item.descricao, outro.descricao);
    if (semConflitoDeCodigo && compativel && score >= 0.55 && (!melhor || score > melhor.score)) {
      melhor = { chave, score };
    }
  }
  return melhor?.chave ?? null;
}
