import { cn } from '@/lib/utils';
import { FornecedorOrcamento, LinhaComparativa, brl } from './types';
import { AlertTriangle, Crown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ComparisonTableProps {
  fornecedores: FornecedorOrcamento[];
  linhas: LinhaComparativa[];
}

export function ComparisonTable({ fornecedores, linhas }: ComparisonTableProps) {
  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full min-w-[720px] text-[13px]">
        <thead>
          <tr className="border-b border-[hsl(var(--border-subtle))]">
            <th className="px-4 py-3 text-left data-label">Item</th>
            {fornecedores.map((f) => (
              <th key={f.id} className="px-4 py-3 text-left">
                <div className="text-[13px] font-semibold text-[hsl(var(--text-primary))]">{f.fornecedor}</div>
                <div className="text-[11px] font-normal text-[hsl(var(--text-quaternary))]">
                  {[f.prazo_entrega, f.condicao_pagamento].filter(Boolean).join(' · ') || 'Sem condições informadas'}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l) => (
            <tr key={l.chave} className="border-b border-[hsl(var(--border-subtle))] last:border-0 align-top">
              <td className="px-4 py-3">
                <div className="flex items-start gap-1.5">
                  <div>
                    <p className="font-medium text-[hsl(var(--text-primary))]">{l.descricao}</p>
                    <p className="text-[11px] text-[hsl(var(--text-quaternary))]">
                      {l.codigo ? `Cód. ${l.codigo}` : 'Sem código'}
                    </p>
                  </div>
                  {l.divergencias.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul className="list-disc pl-4 text-[12px]">
                          {l.divergencias.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </td>
              {fornecedores.map((f) => {
                const cel = l.porFornecedor[f.id];
                const melhor = l.melhorFornecedorId === f.id && !!cel;
                return (
                  <td
                    key={f.id}
                    className={cn(
                      'px-4 py-3',
                      melhor && 'bg-primary/5'
                    )}
                  >
                    {cel ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('font-semibold tabular-nums', melhor && 'text-primary')}>
                            {brl(cel.unitario)}
                          </span>
                          {melhor && <Crown className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <p className="text-[11px] text-[hsl(var(--text-quaternary))]">
                          {cel.item?.quantidade ?? '—'} {cel.item?.embalagem || 'un'} · total {brl(cel.total)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[12px] text-[hsl(var(--text-quaternary))]">Não cotado</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
