/**
 * Biblioteca central de métricas de Procurement
 * ---------------------------------------------
 * Fonte única de verdade para TODOS os indicadores do dashboard.
 * Qualquer card/gráfico que exiba gastos, economia ou previsões DEVE
 * usar essas funções para garantir consistência entre telas.
 *
 * Terminologia oficial (documentada em COMMENT ON COLUMN no banco):
 *  - valor_orcado : Valor Orçado — estimativa/cotação de referência.
 *  - valor        : Valor Pago — valor efetivamente pago ao fornecedor.
 *
 * Regras obrigatórias:
 *  - Economia          = valor_orcado − valor
 *  - Economia %        = (valor_orcado − valor) / valor_orcado × 100
 *  - Um registro só entra em métricas de economia quando AMBOS os
 *    valores estão preenchidos e > 0 (`hasCompleteFinancialData`).
 *  - Um registro só entra em métricas de GASTO quando `valor > 0` e
 *    o status é terminal de compra (`TERMINAL_PURCHASE_STATUSES`).
 */

import { Requisicao, RequisicaoStatus } from '@/types';

// Status que representam compra efetivada (base para gastos/economia)
export const TERMINAL_PURCHASE_STATUSES: RequisicaoStatus[] = [
  'comprado',
  'em_entrega',
  'recebido',
];

// Status que representam custo evitado (compras canceladas/rejeitadas)
export const AVOIDED_STATUSES: RequisicaoStatus[] = ['rejeitado', 'cancelado'];

// ------------------------- helpers de acesso -------------------------

/** Retorna o Valor Pago (valor) apenas se a compra foi efetivada. */
export const getValorPago = (r: Requisicao): number | null => {
  if (!TERMINAL_PURCHASE_STATUSES.includes(r.status)) return null;
  return r.valor && r.valor > 0 ? r.valor : null;
};

/** Retorna o Valor Orçado se preenchido e > 0. */
export const getValorOrcado = (r: Requisicao): number | null =>
  r.valor_orcado && r.valor_orcado > 0 ? r.valor_orcado : null;

/** Requisição possui dados financeiros completos para cálculo de economia. */
export const hasCompleteFinancialData = (r: Requisicao): boolean =>
  getValorOrcado(r) !== null && getValorPago(r) !== null;

/** Lista de campos ausentes (para mensagens de auditoria). */
export const missingFinancialFields = (r: Requisicao): string[] => {
  const missing: string[] = [];
  if (!getValorOrcado(r)) missing.push('Valor Orçado');
  if (!TERMINAL_PURCHASE_STATUSES.includes(r.status)) {
    missing.push('Compra não finalizada');
  } else if (!getValorPago(r)) {
    missing.push('Valor Pago');
  }
  return missing;
};

// ------------------------- cálculos unitários ------------------------

export interface EconomiaResultado {
  orcado: number;
  pago: number;
  economia: number;      // pode ser negativa (acréscimo)
  percentual: number;    // 0-100 (ou negativo)
  isValid: boolean;
}

/** Economia de UM registro. isValid=false quando faltam dados. */
export const calcEconomia = (r: Requisicao): EconomiaResultado => {
  const orcado = getValorOrcado(r);
  const pago = getValorPago(r);
  if (orcado === null || pago === null) {
    return { orcado: 0, pago: 0, economia: 0, percentual: 0, isValid: false };
  }
  const economia = orcado - pago;
  const percentual = orcado > 0 ? (economia / orcado) * 100 : 0;
  return { orcado, pago, economia, percentual, isValid: true };
};

// ------------------------- agregados ---------------------------------

export interface AggregatedEconomia {
  totalOrcado: number;
  totalPago: number;
  economiaTotal: number;
  percentualEconomia: number;
  comEconomia: number;   // registros onde orçado > pago
  comAcrescimo: number;  // registros onde orçado < pago
  totalRegistros: number;
  registrosIncompletos: number;
}

/** Agregado de economia sobre um conjunto de requisições. */
export const aggregateEconomia = (reqs: Requisicao[]): AggregatedEconomia => {
  const validos = reqs.filter(hasCompleteFinancialData);
  const totalOrcado = validos.reduce((s, r) => s + (r.valor_orcado || 0), 0);
  const totalPago = validos.reduce((s, r) => s + (r.valor || 0), 0);
  const economiaTotal = totalOrcado - totalPago;
  return {
    totalOrcado,
    totalPago,
    economiaTotal,
    percentualEconomia: totalOrcado > 0 ? (economiaTotal / totalOrcado) * 100 : 0,
    comEconomia: validos.filter((r) => (r.valor_orcado || 0) > (r.valor || 0)).length,
    comAcrescimo: validos.filter((r) => (r.valor_orcado || 0) < (r.valor || 0)).length,
    totalRegistros: validos.length,
    registrosIncompletos: reqs.length - validos.length,
  };
};

/** Gasto total (apenas compras efetivadas com valor pago > 0). */
export const aggregateGasto = (reqs: Requisicao[]): number =>
  reqs.reduce((s, r) => s + (getValorPago(r) ?? 0), 0);

// ============================================================================
// MODELO PREDITIVO — Metodologia documentada
// ============================================================================
/**
 * Combina três sinais para prever o gasto dos próximos meses:
 *
 * 1) Média Móvel Ponderada (WMA) sobre o horizonte configurado.
 *    Meses mais recentes recebem peso maior (n, n-1, n-2, …).
 *    Fornece a "base" de consumo esperado.
 *
 * 2) Tendência Linear (Regressão OLS) sobre a mesma janela.
 *    Captura crescimento/decrescimento estrutural (R$/mês).
 *
 * 3) Sazonalidade (opcional, ativa quando horizonte ≥ 12 meses).
 *    Fator = média(mês-do-ano) / média(todos os meses).
 *    Ajusta a previsão para picos/quedas recorrentes (ex.: dezembro).
 *
 * Fórmula final para o mês k à frente:
 *   forecast(k) = (WMA × 0.55 + trend(k) × 0.45) × seasonalityFactor(k)
 *
 * Confiança do modelo:
 *   R² (coeficiente de determinação) da regressão linear × 100.
 *   Banda de confiança = ± desvio-padrão dos resíduos.
 */

export type ForecastHorizon = 3 | 6 | 12;

export interface MonthlyPoint {
  monthKey: string;   // 'YYYY-MM'
  date: Date;         // primeiro dia do mês
  spend: number;      // gasto real acumulado no mês (valor pago)
  count: number;      // nº de compras
}

export interface ForecastPoint {
  monthKey: string;
  date: Date;
  realized: number | null;      // gasto real (null para meses futuros)
  currentProjection: number | null; // extrapolação do mês vigente
  forecast: number | null;      // previsão IA
  upperBand: number | null;     // banda superior de confiança
  lowerBand: number | null;     // banda inferior de confiança
  isCurrent: boolean;
  isFuture: boolean;
}

export interface ForecastResult {
  history: MonthlyPoint[];        // meses usados como base histórica
  series: ForecastPoint[];        // série completa histórico + previsão
  horizon: ForecastHorizon;       // meses do histórico usados
  monthsAhead: number;            // meses previstos à frente
  wma: number;                    // média móvel ponderada
  trendPerMonth: number;          // R$ por mês (positivo = alta)
  r2: number;                     // 0..1 — qualidade do modelo
  confidence: number;             // 0..100 (%)
  currentMonthRealized: number;   // parcial do mês vigente
  currentMonthProjection: number; // extrapolação do mês vigente
  nextMonthForecast: number;      // previsão para o próximo mês
  momVariation: number;           // variação % vs. mês anterior
  methodologyLabel: string;       // texto curto p/ UI
}

/**
 * Constrói série mensal de gastos a partir das requisições.
 * Apenas compras terminais com valor pago > 0 contam.
 */
export const buildMonthlyHistory = (
  reqs: Requisicao[],
  monthsBack: number,
): MonthlyPoint[] => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);
  const buckets = new Map<string, MonthlyPoint>();

  // pré-popular buckets para todos os meses (evita gaps)
  for (let i = 0; i < monthsBack; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.set(key, { monthKey: key, date: d, spend: 0, count: 0 });
  }

  reqs.forEach((r) => {
    const pago = getValorPago(r);
    if (pago === null) return;
    // usa comprado_em quando disponível, senão created_at
    const ref = r.comprado_em ? new Date(r.comprado_em) : new Date(r.created_at);
    if (ref < start || ref > now) return;
    const key = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
    const b = buckets.get(key);
    if (!b) return;
    b.spend += pago;
    b.count += 1;
  });

  return Array.from(buckets.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
};

/** Média móvel ponderada — meses recentes têm peso maior. */
const weightedMovingAverage = (points: MonthlyPoint[]): number => {
  if (points.length === 0) return 0;
  const weights = points.map((_, i) => i + 1);
  const totalW = weights.reduce((a, b) => a + b, 0);
  return points.reduce((s, p, i) => s + p.spend * weights[i], 0) / totalW;
};

/** Regressão linear simples (OLS) — retorna slope, intercept e R². */
const linearRegression = (points: MonthlyPoint[]) => {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: points[0]?.spend || 0, r2: 0, residStd: 0 };

  const xs = points.map((_, i) => i);
  const ys = points.map((p) => p.spend);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;

  // R²
  let ssRes = 0, ssTot = 0;
  const residuals: number[] = [];
  for (let i = 0; i < n; i++) {
    const yhat = intercept + slope * xs[i];
    const res = ys[i] - yhat;
    residuals.push(res);
    ssRes += res ** 2;
    ssTot += (ys[i] - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 0 : Math.max(0, 1 - ssRes / ssTot);
  const residStd = Math.sqrt(ssRes / Math.max(1, n - 2));
  return { slope, intercept, r2, residStd };
};

/** Fatores de sazonalidade por mês (0..11) — só faz sentido com ≥12 meses. */
const seasonalityFactors = (points: MonthlyPoint[]): number[] => {
  const monthAvgs = Array(12).fill(0).map(() => ({ sum: 0, n: 0 }));
  points.forEach((p) => {
    const m = p.date.getMonth();
    monthAvgs[m].sum += p.spend;
    monthAvgs[m].n += 1;
  });
  const globalAvg = points.reduce((s, p) => s + p.spend, 0) / Math.max(1, points.length);
  if (globalAvg === 0) return Array(12).fill(1);
  return monthAvgs.map((m) => {
    if (m.n === 0) return 1;
    const avg = m.sum / m.n;
    // clamp para evitar explosões com amostra pequena
    return Math.max(0.5, Math.min(1.5, avg / globalAvg));
  });
};

/**
 * Roda o modelo completo.
 * @param reqs           todas as requisições disponíveis
 * @param horizon        3, 6 ou 12 meses de histórico
 * @param monthsAhead    quantos meses prever à frente (default 3)
 */
export const runForecast = (
  reqs: Requisicao[],
  horizon: ForecastHorizon = 12,
  monthsAhead = 3,
): ForecastResult => {
  const history = buildMonthlyHistory(reqs, horizon);
  const now = new Date();
  const currentMonthIdx = history.length - 1;
  const currentMonthPoint = history[currentMonthIdx];

  // separar histórico "fechado" (exclui mês vigente parcial da regressão)
  const closedHistory = history.slice(0, -1);
  const baseForModel = closedHistory.length >= 2 ? closedHistory : history;

  const wma = weightedMovingAverage(baseForModel);
  const { slope, intercept, r2, residStd } = linearRegression(baseForModel);
  const useSeasonality = horizon >= 12;
  const seasonFactors = useSeasonality ? seasonalityFactors(baseForModel) : Array(12).fill(1);

  // Extrapolação do mês vigente (parcial)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const monthProgress = dayOfMonth / daysInMonth;
  const currentRealized = currentMonthPoint?.spend ?? 0;
  const extrapolated = monthProgress > 0 ? currentRealized / monthProgress : currentRealized;
  const trendCurrent = intercept + slope * (baseForModel.length); // "próximo" ponto = mês vigente
  const currentSeason = seasonFactors[now.getMonth()];
  const currentProjection =
    (extrapolated * 0.6 + trendCurrent * 0.4) * currentSeason;

  // Série final
  const series: ForecastPoint[] = history.map((p, i) => ({
    monthKey: p.monthKey,
    date: p.date,
    realized: p.spend,
    currentProjection: i === currentMonthIdx ? currentProjection : null,
    forecast: null,
    upperBand: null,
    lowerBand: null,
    isCurrent: i === currentMonthIdx,
    isFuture: false,
  }));

  // Meses futuros
  for (let k = 1; k <= monthsAhead; k++) {
    const d = new Date(now.getFullYear(), now.getMonth() + k, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const trendVal = intercept + slope * (baseForModel.length + k);
    const seasonal = seasonFactors[d.getMonth()];
    const raw = (wma * 0.55 + trendVal * 0.45) * seasonal;
    const forecast = Math.max(0, raw);
    const band = residStd * (1 + k * 0.15); // banda cresce levemente com o horizonte
    series.push({
      monthKey: key,
      date: d,
      realized: null,
      currentProjection: null,
      forecast,
      upperBand: forecast + band,
      lowerBand: Math.max(0, forecast - band),
      isCurrent: false,
      isFuture: true,
    });
  }

  const nextMonthForecast = series.find((s) => s.isFuture)?.forecast ?? 0;
  const prevMonthClosed = closedHistory[closedHistory.length - 1]?.spend ?? 0;
  const momVariation =
    prevMonthClosed > 0 ? ((currentProjection - prevMonthClosed) / prevMonthClosed) * 100 : 0;

  const methodologyLabel = useSeasonality
    ? 'WMA + Regressão Linear + Sazonalidade (12m)'
    : `WMA + Regressão Linear (${horizon}m)`;

  return {
    history,
    series,
    horizon,
    monthsAhead,
    wma,
    trendPerMonth: slope,
    r2,
    confidence: Math.round(r2 * 100),
    currentMonthRealized: currentRealized,
    currentMonthProjection: currentProjection,
    nextMonthForecast,
    momVariation,
    methodologyLabel,
  };
};

// ------------------------- textos de auditoria (tooltips) ------------

export const METRIC_TOOLTIPS = {
  gastoTotal: {
    titulo: 'Gasto Total no Período',
    formula: 'Σ(valor pago) das compras com status "comprado", "em entrega" ou "recebido".',
    campos: 'valor (Valor Pago)',
    observacao: 'Requisições canceladas/rejeitadas NÃO entram no cálculo.',
  },
  economia: {
    titulo: 'Economia Realizada',
    formula: 'Σ(valor_orcado − valor pago) para registros com ambos preenchidos.',
    campos: 'valor_orcado (Valor Orçado) e valor (Valor Pago)',
    observacao: 'Só considera compras finalizadas com os DOIS valores registrados.',
  },
  percentualEconomia: {
    titulo: 'Percentual de Economia',
    formula: '((Σ valor_orcado − Σ valor pago) / Σ valor_orcado) × 100',
    campos: 'valor_orcado e valor (apenas registros completos)',
    observacao: 'Valores negativos indicam acréscimo em relação ao orçamento.',
  },
  custoEvitado: {
    titulo: 'Custo Evitado',
    formula: 'Σ(valor_orcado) das requisições rejeitadas ou canceladas.',
    campos: 'valor_orcado',
    observacao: 'Representa gasto que teria acontecido, mas foi barrado.',
  },
  previsao: {
    titulo: 'Previsão de Gastos (IA)',
    formula: 'WMA × 0.55 + Regressão Linear × 0.45 × Sazonalidade',
    campos: 'valor pago dos últimos N meses (configurável 3/6/12)',
    observacao: 'Sazonalidade só é aplicada com horizonte ≥ 12 meses. Banda de confiança = ± desvio-padrão dos resíduos.',
  },
} as const;
