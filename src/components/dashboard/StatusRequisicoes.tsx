import { useMemo } from 'react';
import { Clock, CheckCircle, XCircle, Package, TrendingUp, Truck, Archive } from 'lucide-react';
import { Requisicao, RequisicaoStatus } from '@/types';

interface StatusRequisicoesProps {
  requisicoes: Requisicao[];
}

interface StatusConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const STATUS_MAP: Record<RequisicaoStatus, StatusConfig> = {
  pendente: { 
    label: 'Pendentes', 
    icon: Clock, 
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
  },
  em_analise: { 
    label: 'Em Análise', 
    icon: TrendingUp, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  aprovado: { 
    label: 'Aprovadas', 
    icon: CheckCircle, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
  },
  cotando: { 
    label: 'Cotando', 
    icon: Package, 
    color: 'text-violet-600',
    bgColor: 'bg-violet-500/10',
  },
  comprado: { 
    label: 'Compradas', 
    icon: CheckCircle, 
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-500/10',
  },
  em_entrega: { 
    label: 'Em Entrega', 
    icon: Truck, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  recebido: { 
    label: 'Recebidas', 
    icon: Archive, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
  },
  rejeitado: { 
    label: 'Rejeitadas', 
    icon: XCircle, 
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
  },
  cancelado: { 
    label: 'Canceladas', 
    icon: XCircle, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-500/10',
  },
};

export function StatusRequisicoes({ requisicoes }: StatusRequisicoesProps) {
  const statusCounts = useMemo(() => {
    const counts: Record<RequisicaoStatus, number> = {
      pendente: 0,
      em_analise: 0,
      aprovado: 0,
      cotando: 0,
      comprado: 0,
      em_entrega: 0,
      recebido: 0,
      rejeitado: 0,
      cancelado: 0,
    };

    requisicoes.forEach((req) => {
      counts[req.status]++;
    });

    return counts;
  }, [requisicoes]);

  const total = requisicoes.length;

  // Apenas mostra status que têm pelo menos 1 requisição ou são importantes
  const visibleStatuses: RequisicaoStatus[] = [
    'pendente',
    'em_analise',
    'aprovado',
    'cotando',
    'comprado',
    'rejeitado',
  ];

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-medium">Resumo de Status</h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} requisições no período
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {visibleStatuses.map((status) => {
          const config = STATUS_MAP[status];
          const count = statusCounts[status];
          const percent = total > 0 ? (count / total) * 100 : 0;
          const Icon = config.icon;

          return (
            <div 
              key={status} 
              className="relative p-4 rounded-xl border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
              </div>
              <p className="text-2xl font-semibold">{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{config.label}</p>
              {count > 0 && (
                <div className="mt-3">
                  <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        status === 'pendente' ? 'bg-amber-500' :
                        status === 'em_analise' ? 'bg-blue-500' :
                        status === 'aprovado' ? 'bg-emerald-500' :
                        status === 'cotando' ? 'bg-violet-500' :
                        status === 'comprado' ? 'bg-cyan-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {percent.toFixed(0)}% do total
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
