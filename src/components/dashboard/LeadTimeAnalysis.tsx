import { useMemo } from 'react';
import { Requisicao, RequisicaoStatus } from '@/types';
import { Clock, ArrowRight, TrendingUp } from 'lucide-react';

interface LeadTimeAnalysisProps {
  requisicoes: Requisicao[];
}

interface LeadTimeStep {
  from: string;
  to: string;
  label: string;
  avgDays: number;
  count: number;
}

export function LeadTimeAnalysis({ requisicoes }: LeadTimeAnalysisProps) {
  const leadTimes = useMemo(() => {
    const steps: LeadTimeStep[] = [];

    // Pendente → Cotando (includes em_analise, aprovado)
    const cotando = requisicoes.filter(
      (r) =>
        r.status !== 'pendente' &&
        r.status !== 'em_analise' &&
        r.created_at
    );
    if (cotando.length > 0) {
      // Estimate: use updated_at or aprovado_em for transition
      const daysToQuote = cotando
        .filter((r) => r.aprovado_em)
        .map((r) => {
          const start = new Date(r.created_at);
          const end = new Date(r.aprovado_em!);
          return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        });
      
      const avg = daysToQuote.length > 0 
        ? daysToQuote.reduce((a, b) => a + b, 0) / daysToQuote.length 
        : 0;
      
      steps.push({
        from: 'pendente',
        to: 'aprovado',
        label: 'Análise & Aprovação',
        avgDays: avg,
        count: daysToQuote.length,
      });
    }

    // Aprovado → Comprado
    const comprados = requisicoes.filter(
      (r) => r.comprado_em && r.aprovado_em
    );
    if (comprados.length > 0) {
      const daysToBuy = comprados.map((r) => {
        const start = new Date(r.aprovado_em!);
        const end = new Date(r.comprado_em!);
        return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      });
      
      const avg = daysToBuy.reduce((a, b) => a + b, 0) / daysToBuy.length;
      
      steps.push({
        from: 'aprovado',
        to: 'comprado',
        label: 'Cotação & Compra',
        avgDays: avg,
        count: daysToBuy.length,
      });
    }

    // Comprado → Recebido
    const recebidos = requisicoes.filter(
      (r) => r.recebido_em && r.comprado_em
    );
    if (recebidos.length > 0) {
      const daysToReceive = recebidos.map((r) => {
        const start = new Date(r.comprado_em!);
        const end = new Date(r.recebido_em!);
        return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      });
      
      const avg = daysToReceive.reduce((a, b) => a + b, 0) / daysToReceive.length;
      
      steps.push({
        from: 'comprado',
        to: 'recebido',
        label: 'Entrega',
        avgDays: avg,
        count: daysToReceive.length,
      });
    }

    // Total lead time for completed
    const completos = requisicoes.filter(
      (r) => r.recebido_em && r.created_at
    );
    if (completos.length > 0) {
      const totalDays = completos.map((r) => {
        const start = new Date(r.created_at);
        const end = new Date(r.recebido_em!);
        return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      });
      
      const avg = totalDays.reduce((a, b) => a + b, 0) / totalDays.length;
      
      steps.push({
        from: 'pendente',
        to: 'recebido',
        label: 'Ciclo Completo',
        avgDays: avg,
        count: completos.length,
      });
    }

    return steps;
  }, [requisicoes]);

  const getColorForDays = (days: number) => {
    if (days <= 3) return 'text-emerald-600 bg-emerald-50';
    if (days <= 7) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  if (leadTimes.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h4 className="font-semibold">Lead Time por Etapa</h4>
            <p className="text-sm text-muted-foreground">Tempo médio entre etapas</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Dados insuficientes para análise
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h4 className="font-semibold">Lead Time por Etapa</h4>
          <p className="text-sm text-muted-foreground">Tempo médio entre etapas do processo</p>
        </div>
      </div>

      <div className="space-y-4">
        {leadTimes.map((step, index) => (
          <div
            key={`${step.from}-${step.to}`}
            className="flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{step.label}</span>
                {step.label === 'Ciclo Completo' && (
                  <TrendingUp className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="capitalize">{step.from.replace('_', ' ')}</span>
                <ArrowRight className="w-3 h-3 mx-1" />
                <span className="capitalize">{step.to.replace('_', ' ')}</span>
                <span className="ml-2">• {step.count} amostras</span>
              </div>
            </div>
            <div
              className={`px-3 py-2 rounded-lg text-sm font-bold ${getColorForDays(step.avgDays)}`}
            >
              {step.avgDays.toFixed(1)} dias
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-6 pt-4 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{'≤'} 3 dias</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>4-7 dias</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>{'>'} 7 dias</span>
        </div>
      </div>
    </div>
  );
}
