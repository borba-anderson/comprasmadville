import { Requisicao } from "@/types";
import { TrendChart, LeadTimeAnalysis, GastosPorSetorBars, EconomiaSummary } from "@/components/dashboard";

interface Props {
  requisicoes: Requisicao[];
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-elevated-static p-6 flex flex-col">
      <div className="mb-4">
        <div className="text-[13px] font-semibold text-slate-900">{title}</div>
        {subtitle && <div className="text-[11.5px] text-slate-500 mt-0.5">{subtitle}</div>}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export function StrategicCharts({ requisicoes }: Props) {
  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto pt-16 pb-16">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="text-[13px] font-semibold tracking-[0.08em] uppercase text-slate-500">
            Visão Estratégica
          </h2>
          <p className="text-[20px] font-semibold text-slate-900 mt-1">Tendências da operação</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Tendência de gastos" subtitle="Últimos meses">
          <TrendChart requisicoes={requisicoes} />
        </ChartCard>
        <ChartCard title="Lead time" subtitle="Tempo médio por etapa">
          <LeadTimeAnalysis requisicoes={requisicoes} />
        </ChartCard>
        <ChartCard title="Concentração por setor" subtitle="Pareto de demanda">
          <GastosPorSetorBars requisicoes={requisicoes} />
        </ChartCard>
        <ChartCard title="Economia gerada" subtitle="Negociado vs. orçado">
          <EconomiaSummary requisicoes={requisicoes} />
        </ChartCard>
      </div>
    </section>
  );
}
