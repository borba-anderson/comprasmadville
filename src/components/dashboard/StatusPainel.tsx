import { useMemo } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  TrendingUp, 
  Truck, 
  Archive,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Requisicao, RequisicaoStatus } from '@/types';

interface StatusPainelProps {
  requisicoes: Requisicao[];
}

interface StatusConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const STATUS_MAP: Record<RequisicaoStatus, StatusConfig> = {
  pendente: { 
    label: 'Pendentes', 
    icon: Clock, 
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  em_analise: { 
    label: 'Em Análise', 
    icon: TrendingUp, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  aprovado: { 
    label: 'Aprovadas', 
    icon: CheckCircle, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  cotando: { 
    label: 'Em Cotação', 
    icon: Package, 
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  comprado: { 
    label: 'Compradas', 
    icon: CheckCircle, 
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
  },
  em_entrega: { 
    label: 'Aguardando Envio', 
    icon: Truck, 
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  recebido: { 
    label: 'Recebidas', 
    icon: Archive, 
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  rejeitado: { 
    label: 'Rejeitadas', 
    icon: XCircle, 
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  cancelado: { 
    label: 'Canceladas', 
    icon: XCircle, 
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

export function StatusPainel({ requisicoes }: StatusPainelProps) {
  const { statusCounts, atrasadas } = useMemo(() => {
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

    let atrasadasCount = 0;
    const today = new Date();

    requisicoes.forEach((req) => {
      counts[req.status]++;
      
      // Count overdue
      if (req.previsao_entrega && !['recebido', 'rejeitado', 'cancelado'].includes(req.status)) {
        const previsao = new Date(req.previsao_entrega);
        if (previsao < today) {
          atrasadasCount++;
        }
      }
    });

    return { statusCounts: counts, atrasadas: atrasadasCount };
  }, [requisicoes]);

  const total = requisicoes.length;

  const visibleStatuses: { status: RequisicaoStatus; isSpecial?: boolean }[] = [
    { status: 'cotando' },
    { status: 'comprado' },
    { status: 'em_entrega' },
    { status: 'pendente' },
    { status: 'rejeitado' },
  ];

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-semibold">Painel de Status Operacional</h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} requisições no período
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {visibleStatuses.map(({ status }) => {
          const config = STATUS_MAP[status];
          const count = statusCounts[status];
          const percent = total > 0 ? (count / total) * 100 : 0;
          const Icon = config.icon;

          return (
            <div 
              key={status} 
              className={`relative p-4 rounded-xl border ${config.borderColor} ${config.bgColor} hover:shadow-sm transition-all duration-200`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <p className="text-3xl font-bold tracking-tight">{count}</p>
              <p className="text-xs font-medium text-muted-foreground mt-1">{config.label}</p>
              {count > 0 && (
                <p className="text-[10px] text-muted-foreground/80 mt-2">
                  {percent.toFixed(0)}% do total
                </p>
              )}
            </div>
          );
        })}

        {/* Atrasadas - Special card */}
        <div 
          className={`relative p-4 rounded-xl border ${
            atrasadas > 0 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-200 bg-gray-50'
          } hover:shadow-sm transition-all duration-200`}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={`w-5 h-5 ${atrasadas > 0 ? 'text-red-600' : 'text-gray-400'}`} />
          </div>
          <p className={`text-3xl font-bold tracking-tight ${atrasadas > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {atrasadas}
          </p>
          <p className="text-xs font-medium text-muted-foreground mt-1">Atrasadas</p>
          {atrasadas > 0 && (
            <p className="text-[10px] text-red-500/80 mt-2">
              Requer atenção
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
