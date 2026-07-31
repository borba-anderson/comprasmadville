export interface HistoricoCompra {
  data: string;
  fornecedor: string;
  preco: number;
  quantidade: number;
}

export interface CotacaoItem {
  codigo: string;
  descricao: string;
  quantidade: number;
  ultimaCompra: number;
  precos: Record<string, number | null>;
  historico: HistoricoCompra[];
  divergencia?: string | null;
}

export const FORNECEDORES_MOCK = ['Fornecedor A', 'Fornecedor B', 'Fornecedor C'];

export const ITENS_MOCK: CotacaoItem[] = [
  {
    codigo: 'MDF-1830',
    descricao: 'Chapa MDF Cru 18mm 1,83 x 2,75m',
    quantidade: 40,
    ultimaCompra: 214.9,
    precos: { 'Fornecedor A': 208.5, 'Fornecedor B': 199.9, 'Fornecedor C': 221.0 },
    historico: [
      { data: '2026-06-12', fornecedor: 'Fornecedor A', preco: 214.9, quantidade: 30 },
      { data: '2026-04-03', fornecedor: 'Fornecedor C', preco: 219.4, quantidade: 25 },
      { data: '2026-01-22', fornecedor: 'Fornecedor A', preco: 205.0, quantidade: 60 },
    ],
  },
  {
    codigo: 'FER-0442',
    descricao: 'Dobradiça Curva 35mm com amortecedor (cx 100un)',
    quantidade: 12,
    ultimaCompra: 389.0,
    precos: { 'Fornecedor A': 402.0, 'Fornecedor B': 377.5, 'Fornecedor C': 371.9 },
    historico: [
      { data: '2026-05-28', fornecedor: 'Fornecedor B', preco: 389.0, quantidade: 10 },
      { data: '2026-02-14', fornecedor: 'Fornecedor B', preco: 396.2, quantidade: 8 },
    ],
  },
  {
    codigo: 'ADE-0110',
    descricao: 'Fita de Borda PVC Branco TX 22mm (rolo 50m)',
    quantidade: 60,
    ultimaCompra: 48.7,
    precos: { 'Fornecedor A': 44.9, 'Fornecedor B': 47.3, 'Fornecedor C': null },
    divergencia: 'Item não cotado pelo Fornecedor C',
    historico: [
      { data: '2026-06-30', fornecedor: 'Fornecedor A', preco: 48.7, quantidade: 40 },
      { data: '2026-03-11', fornecedor: 'Fornecedor A', preco: 46.1, quantidade: 50 },
    ],
  },
  {
    codigo: 'COL-2201',
    descricao: 'Cola Branca PVA Extra 5kg',
    quantidade: 25,
    ultimaCompra: 62.4,
    precos: { 'Fornecedor A': 71.9, 'Fornecedor B': 68.4, 'Fornecedor C': 69.9 },
    divergencia: 'Preço acima da última compra',
    historico: [
      { data: '2026-06-05', fornecedor: 'Fornecedor C', preco: 62.4, quantidade: 20 },
      { data: '2026-03-19', fornecedor: 'Fornecedor C', preco: 60.8, quantidade: 20 },
    ],
  },
  {
    codigo: 'PAR-7788',
    descricao: 'Parafuso Chipboard 4,0 x 40mm (mil)',
    quantidade: 30,
    ultimaCompra: 89.9,
    precos: { 'Fornecedor A': 84.5, 'Fornecedor B': 88.0, 'Fornecedor C': 82.3 },
    historico: [
      { data: '2026-06-21', fornecedor: 'Fornecedor C', preco: 89.9, quantidade: 25 },
      { data: '2026-05-02', fornecedor: 'Fornecedor A', preco: 91.5, quantidade: 30 },
    ],
  },
  {
    codigo: 'COR-3390',
    descricao: 'Corrediça Telescópica 450mm (par)',
    quantidade: 80,
    ultimaCompra: 27.5,
    precos: { 'Fornecedor A': 25.9, 'Fornecedor B': 24.4, 'Fornecedor C': 26.8 },
    historico: [
      { data: '2026-06-18', fornecedor: 'Fornecedor B', preco: 27.5, quantidade: 60 },
      { data: '2026-04-27', fornecedor: 'Fornecedor B', preco: 28.2, quantidade: 40 },
    ],
  },
  {
    codigo: 'PUX-5012',
    descricao: 'Puxador Alumínio Escovado 160mm',
    quantidade: 50,
    ultimaCompra: 18.9,
    precos: { 'Fornecedor A': 19.9, 'Fornecedor B': 17.4, 'Fornecedor C': 17.9 },
    historico: [
      { data: '2026-06-09', fornecedor: 'Fornecedor B', preco: 18.9, quantidade: 45 },
      { data: '2026-02-25', fornecedor: 'Fornecedor A', preco: 19.5, quantidade: 30 },
    ],
  },
  {
    codigo: 'VER-0067',
    descricao: 'Verniz Poliuretano Fosco 3,6L',
    quantidade: 18,
    ultimaCompra: 178.0,
    precos: { 'Fornecedor A': 169.9, 'Fornecedor B': null, 'Fornecedor C': 174.5 },
    divergencia: 'Item não cotado pelo Fornecedor B',
    historico: [
      { data: '2026-05-15', fornecedor: 'Fornecedor A', preco: 178.0, quantidade: 12 },
      { data: '2026-01-30', fornecedor: 'Fornecedor C', preco: 181.3, quantidade: 15 },
    ],
  },
];

export interface LinhaCotacao extends CotacaoItem {
  melhorFornecedor: string | null;
  melhorPreco: number | null;
  diferenca: number;
  diferencaPct: number;
  economia: number;
  status: 'economia' | 'atencao' | 'divergencia';
}

export function calcularLinhas(itens: CotacaoItem[], fornecedores: string[]): LinhaCotacao[] {
  return itens.map((item) => {
    const validos = fornecedores
      .map((f) => ({ f, p: item.precos[f] }))
      .filter((x): x is { f: string; p: number } => typeof x.p === 'number');

    const melhor = validos.length ? validos.reduce((a, b) => (a.p <= b.p ? a : b)) : null;
    const melhorPreco = melhor ? melhor.p : null;
    const diferenca = melhorPreco !== null ? melhorPreco - item.ultimaCompra : 0;
    const diferencaPct = melhorPreco !== null && item.ultimaCompra > 0 ? (diferenca / item.ultimaCompra) * 100 : 0;
    const economia = melhorPreco !== null ? Math.max(item.ultimaCompra - melhorPreco, 0) * item.quantidade : 0;

    const status: LinhaCotacao['status'] = item.divergencia
      ? 'divergencia'
      : diferenca > 0
        ? 'atencao'
        : 'economia';

    return {
      ...item,
      melhorFornecedor: melhor?.f ?? null,
      melhorPreco,
      diferenca,
      diferencaPct,
      economia,
      status,
    };
  });
}

export const brl = (v?: number | null) =>
  typeof v === 'number' && !Number.isNaN(v)
    ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';
