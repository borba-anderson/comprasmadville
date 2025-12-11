import { useMemo } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2,
  CalendarX,
  DollarSign,
  Info,
  Lightbulb,
} from 'lucide-react';
import { Requisicao } from '@/types';

interface AlertasInteligentesProps {
  requisicoes: Requisicao[];
  totalGasto: number;
  tendencia: number;
}

interface Alerta {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  type: 'error' | 'warning' | 'info' | 'success';
}

export function AlertasInteligentes({ requisicoes, totalGasto, tendencia }: AlertasInteligentesProps) {
  const alertas = useMemo(() => {
    const result: Alerta[] = [];
    const today = new Date();

    // 1. Requisições sem previsão de entrega
    const semPrevisao = requisicoes.filter(
      r => !r.previsao_entrega && 
           !['recebido', 'rejeitado', 'cancelado', 'pendente'].includes(r.status)
    );
    if (semPrevisao.length > 0) {
      result.push({
        icon: CalendarX,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50',
        title: `${semPrevisao.length} requisição(ões) sem previsão de entrega`,
        description: 'Atualize a previsão para melhor controle do fluxo de compras.',
        type: 'warning',
      });
    }

    // 2. Requisições atrasadas
    const atrasadas = requisicoes.filter(r => {
      if (!r.previsao_entrega) return false;
      if (['recebido', 'rejeitado', 'cancelado'].includes(r.status)) return false;
      return new Date(r.previsao_entrega) < today;
    });
    if (atrasadas.length > 0) {
      const diasAtraso = atrasadas.map(r => {
        const previsao = new Date(r.previsao_entrega!);
        return Math.floor((today.getTime() - previsao.getTime()) / (1000 * 60 * 60 * 24));
      });
      const maxAtraso = Math.max(...diasAtraso);
      
      result.push({
        icon: AlertTriangle,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-50',
        title: `${atrasadas.length} requisição(ões) atrasada(s)`,
        description: `Uma delas está atrasada há mais de ${maxAtraso} dia(s). Verifique com urgência.`,
        type: 'error',
      });
    }

    // 3. Tendência de gastos
    if (tendencia > 15) {
      result.push({
        icon: TrendingUp,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-50',
        title: `Gastos aumentaram ${tendencia.toFixed(0)}% neste período`,
        description: 'Compare com o período anterior para identificar os principais aumentos.',
        type: 'warning',
      });
    } else if (tendencia < -10) {
      result.push({
        icon: TrendingDown,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        title: `Economia de ${Math.abs(tendencia).toFixed(0)}% no período`,
        description: 'Os gastos reduziram em comparação ao período anterior.',
        type: 'success',
      });
    }

    // 4. Análise por setor - setor com maior aumento
    const gastosPorSetor = requisicoes.reduce((acc, req) => {
      const setor = req.solicitante_setor;
      acc[setor] = (acc[setor] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    const setoresOrdenados = Object.entries(gastosPorSetor)
      .sort(([, a], [, b]) => b - a);

    if (setoresOrdenados.length > 0 && totalGasto > 0) {
      const [topSetor, topValor] = setoresOrdenados[0];
      const percentSetor = (topValor / totalGasto) * 100;
      
      if (percentSetor >= 40) {
        result.push({
          icon: Building2,
          iconColor: 'text-violet-600',
          iconBg: 'bg-violet-50',
          title: `Setor ${topSetor} concentra ${percentSetor.toFixed(0)}% dos gastos`,
          description: 'Considere revisar as requisições deste setor para otimização.',
          type: 'info',
        });
      }
    }

    // 5. Requisições pendentes de alta prioridade
    const pendentesAlta = requisicoes.filter(
      r => r.status === 'pendente' && r.prioridade === 'ALTA'
    );
    if (pendentesAlta.length > 0) {
      result.push({
        icon: Clock,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-50',
        title: `${pendentesAlta.length} requisição(ões) urgente(s) pendente(s)`,
        description: 'Requisições de alta prioridade aguardando análise.',
        type: 'error',
      });
    }

    // 6. Ticket alto (acima do padrão)
    const withValue = requisicoes.filter(r => r.valor && r.valor > 0);
    if (withValue.length > 3) {
      const valores = withValue.map(r => r.valor!);
      const media = valores.reduce((a, b) => a + b, 0) / valores.length;
      const acimaDaMedia = withValue.filter(r => r.valor! > media * 2);
      
      if (acimaDaMedia.length > 0) {
        result.push({
          icon: DollarSign,
          iconColor: 'text-amber-600',
          iconBg: 'bg-amber-50',
          title: `${acimaDaMedia.length} requisição(ões) com ticket acima do padrão`,
          description: 'Valores significativamente superiores à média do período.',
          type: 'info',
        });
      }
    }

    // 7. Se não houver alertas, mostrar status positivo
    if (result.length === 0) {
      result.push({
        icon: Lightbulb,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        title: 'Tudo em ordem!',
        description: 'Não há alertas críticos no momento. Continue monitorando.',
        type: 'success',
      });
    }

    return result.slice(0, 6); // Max 6 alertas
  }, [requisicoes, totalGasto, tendencia]);

  const getBorderColor = (type: Alerta['type']) => {
    switch (type) {
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-amber-500';
      case 'success': return 'border-l-emerald-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="font-semibold">Insights e Alertas Inteligentes</h4>
          <p className="text-sm text-muted-foreground">Análise automática das requisições</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alertas.map((alerta, index) => {
          const Icon = alerta.icon;
          return (
            <div 
              key={index}
              className={`bg-card rounded-xl border border-border/50 border-l-4 ${getBorderColor(alerta.type)} p-4 hover:shadow-sm transition-shadow duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 ${alerta.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${alerta.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {alerta.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {alerta.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
