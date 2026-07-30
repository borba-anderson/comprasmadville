import { FornecedorOrcamento, ResumoComparativo, brl } from './types';
import { cn } from '@/lib/utils';
import { Award, TrendingDown, Layers } from 'lucide-react';

interface RecommendationSummaryProps {
  fornecedores: FornecedorOrcamento[];
  resumo: ResumoComparativo;
}

export function RecommendationSummary({ fornecedores, resumo }: RecommendationSummaryProps) {
  const recomendado = fornecedores.find((f) => f.id === resumo.recomendadoId);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="surface-card p-5 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <h3 className="data-label">Fornecedor recomendado</h3>
        </div>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-[hsl(var(--text-primary))]">
          {recomendado?.fornecedor ?? '—'}
        </p>
        <p className="mt-1 text-[13px] text-[hsl(var(--text-tertiary))]">
          {[recomendado?.prazo_entrega, recomendado?.condicao_pagamento].filter(Boolean).join(' · ') ||
            'Condições não informadas'}
        </p>

        <div className="mt-4 space-y-2">
          {resumo.totaisPorFornecedor
            .slice()
            .sort((a, b) => a.total - b.total)
            .map((t) => {
              const max = Math.max(...resumo.totaisPorFornecedor.map((x) => x.total), 1);
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <span className="w-40 truncate text-[12px] text-[hsl(var(--text-tertiary))]">{t.nome}</span>
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div
                      className={cn('h-2 rounded-full', t.id === resumo.recomendadoId ? 'bg-primary' : 'bg-muted-foreground/30')}
                      style={{ width: `${(t.total / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-28 text-right text-[12px] font-semibold tabular-nums">{brl(t.total)}</span>
                </div>
              );
            })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            <h3 className="data-label">Economia estimada</h3>
          </div>
          <p className="mt-2 data-value text-primary">{brl(resumo.economia)}</p>
          <p className="mt-1 text-[12px] text-[hsl(var(--text-tertiary))]">
            {resumo.economiaPct.toFixed(1)}% vs. pior proposta
          </p>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[hsl(var(--text-tertiary))]" />
            <h3 className="data-label">Compra combinada</h3>
          </div>
          <p className="mt-2 data-value">{brl(resumo.totalCombinado)}</p>
          <p className="mt-1 text-[12px] text-[hsl(var(--text-tertiary))]">
            Menor preço item a item · ganho extra de {brl(resumo.economiaCombinada)}
          </p>
        </div>
      </div>
    </div>
  );
}
