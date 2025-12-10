import { Check, Clock, Package, ShoppingCart, Truck, FileCheck, XCircle, Search } from 'lucide-react';
import { Requisicao, RequisicaoStatus } from '@/types';
import { cn } from '@/lib/utils';

interface RequisicaoTimelineProps {
  requisicao: Requisicao;
}

interface TimelineStep {
  status: RequisicaoStatus | 'created';
  label: string;
  icon: React.ElementType;
  dateField: keyof Requisicao | null;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: 'created', label: 'Criada', icon: Clock, dateField: 'created_at' },
  { status: 'em_analise', label: 'Em Análise', icon: Search, dateField: null },
  { status: 'aprovado', label: 'Aprovada', icon: FileCheck, dateField: 'aprovado_em' },
  { status: 'cotando', label: 'Cotando', icon: Package, dateField: null },
  { status: 'comprado', label: 'Comprada', icon: ShoppingCart, dateField: 'comprado_em' },
  { status: 'em_entrega', label: 'Em Entrega', icon: Truck, dateField: null },
  { status: 'recebido', label: 'Entregue', icon: Check, dateField: 'recebido_em' },
];

const STATUS_ORDER: Record<string, number> = {
  created: 0,
  pendente: 0,
  em_analise: 1,
  aprovado: 2,
  cotando: 3,
  comprado: 4,
  em_entrega: 5,
  recebido: 6,
  rejeitado: -1,
  cancelado: -1,
};

export function RequisicaoTimeline({ requisicao }: RequisicaoTimelineProps) {
  const isRejected = requisicao.status === 'rejeitado' || requisicao.status === 'cancelado';
  const currentStepIndex = STATUS_ORDER[requisicao.status] ?? 0;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isRejected) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400">
              Requisição {requisicao.status === 'rejeitado' ? 'Rejeitada' : 'Cancelada'}
            </p>
            {requisicao.motivo_rejeicao && (
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                Motivo: {requisicao.motivo_rejeicao}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Linha do Tempo</h4>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-muted" />
        <div 
          className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-500"
          style={{ height: `${Math.max(0, (currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100)}%` }}
        />

        {/* Steps */}
        <div className="space-y-4">
          {TIMELINE_STEPS.map((step, index) => {
            const isCompleted = currentStepIndex >= index;
            const isCurrent = currentStepIndex === index;
            const date = step.dateField ? formatDate(requisicao[step.dateField] as string | undefined) : null;
            const Icon = step.icon;

            return (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                    isCompleted 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-muted text-muted-foreground',
                    isCurrent && 'ring-4 ring-primary/20'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <p className={cn(
                    'text-sm font-medium',
                    isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {step.label}
                  </p>
                  {date && (
                    <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
                  )}
                  {isCurrent && !date && (
                    <p className="text-xs text-primary font-medium mt-0.5">Em andamento</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
