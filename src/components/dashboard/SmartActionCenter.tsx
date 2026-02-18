import { useMemo } from 'react';
import { Requisicao } from '@/types';
import {
  Zap,
  AlertTriangle,
  DollarSign,
  Clock,
  Truck,
  ShieldAlert,
  ArrowRight,
  PiggyBank,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmartActionCenterProps {
  requisicoes: Requisicao[];
  onFilterStatus?: (statuses: string[]) => void;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  severity: 'critical' | 'warning' | 'info' | 'opportunity';
  value?: string;
  count: number;
  action: () => void;
  actionLabel: string;
}

const SEVERITY_STYLES = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  opportunity: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
};

export function SmartActionCenter({ requisicoes, onFilterStatus }: SmartActionCenterProps) {
  const actions = useMemo<ActionItem[]>(() => {
    const today = new Date();
    const items: ActionItem[] = [];

    // 1. Overdue requisitions
    const overdue = requisicoes.filter((r) => {
      if (!r.previsao_entrega || ['recebido', 'rejeitado', 'cancelado'].includes(r.status)) return false;
      return new Date(r.previsao_entrega) < today;
    });
    if (overdue.length > 0) {
      const overdueValue = overdue.reduce((s, r) => s + (r.valor || 0), 0);
      items.push({
        id: 'overdue',
        title: 'Entregas Atrasadas',
        description: `${overdue.length} requisições passaram da previsão de entrega`,
        icon: Clock,
        severity: 'critical',
        value: formatCurrency(overdueValue),
        count: overdue.length,
        action: () => onFilterStatus?.(['comprado', 'em_entrega']),
        actionLabel: 'Ver atrasadas',
      });
    }

    // 2. High-value pending (no approval)
    const pendingHighValue = requisicoes.filter(
      (r) => r.status === 'pendente' && r.valor_orcado && r.valor_orcado > 5000
    );
    if (pendingHighValue.length > 0) {
      const totalValue = pendingHighValue.reduce((s, r) => s + (r.valor_orcado || 0), 0);
      items.push({
        id: 'high-value-pending',
        title: 'Aprovações de Alto Valor',
        description: `${pendingHighValue.length} pendentes acima de R$ 5.000`,
        icon: DollarSign,
        severity: 'warning',
        value: formatCurrency(totalValue),
        count: pendingHighValue.length,
        action: () => onFilterStatus?.(['pendente']),
        actionLabel: 'Aprovar agora',
      });
    }

    // 3. Suppliers at risk (overdue from same supplier)
    const supplierOverdue = new Map<string, number>();
    overdue.forEach((r) => {
      if (r.fornecedor_nome) {
        supplierOverdue.set(r.fornecedor_nome, (supplierOverdue.get(r.fornecedor_nome) || 0) + 1);
      }
    });
    const riskySuppliers = Array.from(supplierOverdue.entries()).filter(([, count]) => count >= 2);
    if (riskySuppliers.length > 0) {
      items.push({
        id: 'risky-suppliers',
        title: 'Fornecedores em Risco',
        description: riskySuppliers.map(([name, count]) => `${name} (${count})`).join(', '),
        icon: Truck,
        severity: 'critical',
        count: riskySuppliers.length,
        action: () => {},
        actionLabel: 'Ver fornecedores',
      });
    }

    // 4. Maverick spend (purchased without approval)
    const maverick = requisicoes.filter(
      (r) => ['comprado', 'em_entrega', 'recebido'].includes(r.status) && !r.aprovado_em
    );
    if (maverick.length > 0) {
      items.push({
        id: 'maverick',
        title: 'Compras Fora da Política',
        description: `${maverick.length} compras sem aprovação formal registrada`,
        icon: ShieldAlert,
        severity: 'warning',
        count: maverick.length,
        action: () => onFilterStatus?.(['comprado']),
        actionLabel: 'Verificar',
      });
    }

    // 5. Savings opportunities (items with high budget but not yet purchased)
    const savingsOpps = requisicoes.filter(
      (r) => r.valor_orcado && r.valor_orcado > 1000 && ['aprovado', 'cotando'].includes(r.status)
    );
    if (savingsOpps.length > 0) {
      const potentialSavings = savingsOpps.reduce((s, r) => s + (r.valor_orcado || 0) * 0.1, 0);
      items.push({
        id: 'savings',
        title: 'Oportunidades de Savings',
        description: `${savingsOpps.length} itens em cotação com potencial de negociação`,
        icon: PiggyBank,
        severity: 'opportunity',
        value: `~${formatCurrency(potentialSavings)}`,
        count: savingsOpps.length,
        action: () => onFilterStatus?.(['cotando', 'aprovado']),
        actionLabel: 'Negociar',
      });
    }

    // 6. Stale requisitions (pending > 7 days)
    const stale = requisicoes.filter((r) => {
      if (r.status !== 'pendente') return false;
      const days = (today.getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return days > 7;
    });
    if (stale.length > 0) {
      items.push({
        id: 'stale',
        title: 'Requisições Paradas',
        description: `${stale.length} pendentes há mais de 7 dias sem movimentação`,
        icon: AlertTriangle,
        severity: 'warning',
        count: stale.length,
        action: () => onFilterStatus?.(['pendente']),
        actionLabel: 'Resolver',
      });
    }

    // Sort by severity
    const order = { critical: 0, warning: 1, info: 2, opportunity: 3 };
    items.sort((a, b) => order[a.severity] - order[b.severity]);

    return items;
  }, [requisicoes, onFilterStatus]);

  if (actions.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold">Smart Action Center</h4>
            <p className="text-sm text-muted-foreground">✓ Nenhuma ação prioritária no momento</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold">Smart Action Center</h4>
            <p className="text-sm text-muted-foreground">{actions.length} decisões prioritárias</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((item) => {
          const Icon = item.icon;
          const styles = SEVERITY_STYLES[item.severity];

          return (
            <div
              key={item.id}
              className={`relative rounded-xl border p-4 ${styles.bg} ${styles.border} transition-all hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${styles.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-semibold truncate">{item.title}</h5>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${styles.badge}`}>
                      {item.count}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  {item.value && (
                    <p className="text-sm font-bold mt-1">{item.value}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full justify-between text-xs h-8"
                onClick={item.action}
              >
                {item.actionLabel}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatCurrency(v: number): string {
  if (Math.abs(v) >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
  return `R$ ${v.toFixed(0)}`;
}
