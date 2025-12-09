import { useMemo } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Users, Building2 } from 'lucide-react';
import { Requisicao } from '@/types';

interface InsightsInteligentesProps {
  requisicoes: Requisicao[];
  totalGasto: number;
  tendencia: number;
}

interface Insight {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  text: string;
  type: 'info' | 'warning' | 'success';
}

export function InsightsInteligentes({ requisicoes, totalGasto, tendencia }: InsightsInteligentesProps) {
  const insights = useMemo(() => {
    const result: Insight[] = [];

    // Análise por solicitante
    const gastosPorSolicitante = requisicoes.reduce((acc, req) => {
      const nome = req.solicitante_nome;
      acc[nome] = (acc[nome] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    const solicitantesOrdenados = Object.entries(gastosPorSolicitante)
      .sort(([, a], [, b]) => b - a);

    if (solicitantesOrdenados.length > 0) {
      const [topSolicitante, topValor] = solicitantesOrdenados[0];
      const percentTop = (topValor / totalGasto) * 100;
      
      if (percentTop >= 50) {
        result.push({
          icon: Users,
          iconColor: 'text-amber-600',
          iconBg: 'bg-amber-500/10',
          text: `${topSolicitante.split(' ')[0]} representa ${percentTop.toFixed(0)}% dos gastos no período.`,
          type: 'warning',
        });
      } else if (percentTop >= 30) {
        result.push({
          icon: Users,
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-500/10',
          text: `${topSolicitante.split(' ')[0]} é o maior solicitante com ${percentTop.toFixed(0)}% do total.`,
          type: 'info',
        });
      }
    }

    // Análise por setor
    const gastosPorSetor = requisicoes.reduce((acc, req) => {
      const setor = req.solicitante_setor;
      acc[setor] = (acc[setor] || 0) + (req.valor || 0);
      return acc;
    }, {} as Record<string, number>);

    const setoresOrdenados = Object.entries(gastosPorSetor)
      .sort(([, a], [, b]) => b - a);

    if (setoresOrdenados.length > 0) {
      const [topSetor, topValorSetor] = setoresOrdenados[0];
      const percentSetor = (topValorSetor / totalGasto) * 100;
      
      if (percentSetor >= 70) {
        result.push({
          icon: Building2,
          iconColor: 'text-violet-600',
          iconBg: 'bg-violet-500/10',
          text: `O setor ${topSetor} concentra ${percentSetor.toFixed(0)}% do total de gastos.`,
          type: 'info',
        });
      }
    }

    // Tendência
    if (tendencia > 20) {
      result.push({
        icon: TrendingUp,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-500/10',
        text: `Gastos aumentaram ${tendencia.toFixed(0)}% em relação ao período anterior.`,
        type: 'warning',
      });
    } else if (tendencia < -10) {
      result.push({
        icon: TrendingDown,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-500/10',
        text: `Gastos reduziram ${Math.abs(tendencia).toFixed(0)}% em relação ao período anterior.`,
        type: 'success',
      });
    }

    // Requisições pendentes com alta prioridade
    const pendentesAlta = requisicoes.filter(
      req => req.status === 'pendente' && req.prioridade === 'ALTA'
    );

    if (pendentesAlta.length > 0) {
      result.push({
        icon: AlertTriangle,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-500/10',
        text: `${pendentesAlta.length} requisição(ões) pendente(s) com prioridade alta.`,
        type: 'warning',
      });
    }

    // Se não há insights específicos
    if (result.length === 0) {
      result.push({
        icon: Lightbulb,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-500/10',
        text: 'Gastos distribuídos de forma equilibrada no período.',
        type: 'success',
      });
    }

    return result;
  }, [requisicoes, totalGasto, tendencia]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border/50"
          >
            <div className={`w-10 h-10 rounded-xl ${insight.iconBg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${insight.iconColor}`} />
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed pt-2">
              {insight.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}
