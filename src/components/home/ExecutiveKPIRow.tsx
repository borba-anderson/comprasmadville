import { useMemo } from "react";
import { Requisicao } from "@/types";
import { DecisionKPI } from "@/components/intelligence/DecisionKPI";
import { DollarSign, TrendingDown, Activity, AlertTriangle } from "lucide-react";

interface Props {
  requisicoes: Requisicao[];
}

const TERMINAL: Requisicao["status"][] = ["recebido", "rejeitado", "cancelado"];

const fmtBRL = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1).replace(".", ",")}k`;
  return `R$ ${v.toFixed(0)}`;
};

export function ExecutiveKPIRow({ requisicoes }: Props) {
  const data = useMemo(() => {
    const now = new Date();
    const spendTotal = requisicoes.reduce((s, r) => s + (r.valor || r.valor_orcado || 0), 0);
    const economia = requisicoes.reduce((s, r) => {
      if (r.valor_orcado && r.valor && r.valor < r.valor_orcado) {
        return s + (r.valor_orcado - r.valor);
      }
      return s;
    }, 0);
    const andamento = requisicoes.filter((r) =>
      ["aprovado", "cotando", "comprado", "em_entrega"].includes(r.status),
    ).length;
    const atrasos = requisicoes.filter(
      (r) =>
        r.previsao_entrega &&
        new Date(r.previsao_entrega) < now &&
        !TERMINAL.includes(r.status),
    );
    const atrasoValor = atrasos.reduce((s, r) => s + (r.valor || r.valor_orcado || 0), 0);

    // Buckets for sparklines (last 6 weeks by created_at)
    const weeks: number[] = Array(6).fill(0);
    const weekSpend: number[] = Array(6).fill(0);
    requisicoes.forEach((r) => {
      const d = new Date(r.created_at);
      const diff = Math.floor((now.getTime() - d.getTime()) / (7 * 86400000));
      if (diff >= 0 && diff < 6) {
        weeks[5 - diff]++;
        weekSpend[5 - diff] += r.valor || r.valor_orcado || 0;
      }
    });

    return {
      spendTotal,
      economia,
      andamento,
      atrasos: atrasos.length,
      atrasoValor,
      sparkSpend: weekSpend,
      sparkCount: weeks,
    };
  }, [requisicoes]);

  const atrasoSeverity = data.atrasos > 5 ? "high" : data.atrasos > 0 ? "medium" : "low";

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-slate-500">
          KPIs Executivos
        </h2>
        <span className="text-[11px] text-slate-400">{requisicoes.length} requisições analisadas</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DecisionKPI
          label="Spend Total"
          value={fmtBRL(data.spendTotal)}
          icon={DollarSign}
          severity="low"
          spark={data.sparkSpend}
          hint="Volume acumulado"
        />
        <DecisionKPI
          label="Economia Gerada"
          value={fmtBRL(data.economia)}
          icon={TrendingDown}
          severity="low"
          impact={data.economia > 0 ? "Negociação vs. orçado" : "Sem economia registrada"}
        />
        <DecisionKPI
          label="Compras em andamento"
          value={String(data.andamento)}
          icon={Activity}
          severity="low"
          spark={data.sparkCount}
          hint="Aprovadas → recebimento"
        />
        <DecisionKPI
          label="Atrasos críticos"
          value={String(data.atrasos)}
          icon={AlertTriangle}
          severity={atrasoSeverity}
          deltaInverted
          impact={
            data.atrasoValor > 0
              ? `${fmtBRL(data.atrasoValor)} em risco`
              : "Cadeia sem atrasos"
          }
        />
      </div>
    </section>
  );
}
