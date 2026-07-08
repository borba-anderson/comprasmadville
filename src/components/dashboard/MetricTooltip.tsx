import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MetricTooltipProps {
  titulo: string;
  formula: string;
  campos: string;
  observacao?: string;
  periodo?: string;
}

/**
 * Popover padronizado exibido em cada indicador do dashboard.
 * Explica exatamente como o valor foi calculado — requisito de auditoria.
 */
export function MetricTooltip({ titulo, formula, campos, observacao, periodo }: MetricTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Como é calculado: ${titulo}`}
          className="inline-flex items-center justify-center w-4 h-4 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-80 text-xs space-y-2 p-3">
        <p className="font-semibold text-sm text-slate-900">{titulo}</p>
        <div className="space-y-1.5 text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Fórmula:</span>{' '}
            <span className="font-mono text-[11px]">{formula}</span>
          </p>
          <p>
            <span className="font-medium text-slate-800">Campos:</span> {campos}
          </p>
          {periodo && (
            <p>
              <span className="font-medium text-slate-800">Período:</span> {periodo}
            </p>
          )}
          {observacao && (
            <p className="pt-1 border-t border-slate-100 text-slate-500 italic">
              {observacao}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
