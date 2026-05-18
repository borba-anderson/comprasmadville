import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, TrendingDown, Activity } from "lucide-react";

interface Props {
  economia: number;
  atrasos: number;
  andamento: number;
}

const fmtBRL = (v: number) =>
  v >= 1000
    ? `R$ ${(v / 1000).toFixed(1).replace(".", ",")}k`
    : `R$ ${v.toFixed(0)}`;

export function ExecutiveHero({ economia, atrasos, andamento }: Props) {
  return (
    <section className="px-6 md:px-12 pt-14 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold tracking-[0.12em] text-emerald-700 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Procurement Intelligence
          </div>
          <h1 className="text-[2.4rem] md:text-[3.2rem] font-semibold tracking-tight text-slate-900 leading-[1.05]">
            Central estratégica de compras<br />
            <span className="text-slate-400">e decisões operacionais.</span>
          </h1>
          <p className="text-slate-500 text-base md:text-lg mt-5 leading-relaxed">
            Decisões orientadas por dados, em tempo real, na cadeia de suprimentos.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/operacoes"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Abrir Command Center <ArrowRight size={16} />
            </Link>
            <Link
              to="/painel"
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Ver requisições
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-[280px]">
          <span className="eyebrow text-[9px] tracking-[0.14em] text-slate-400 uppercase font-semibold">
            Resumo executivo
          </span>
          <div className="grid grid-cols-3 gap-2">
            <Chip
              icon={<TrendingDown className="w-3.5 h-3.5" />}
              label="Economia"
              value={fmtBRL(economia)}
              tone="emerald"
            />
            <Chip
              icon={<AlertTriangle className="w-3.5 h-3.5" />}
              label="Atrasos"
              value={String(atrasos)}
              tone={atrasos > 0 ? "red" : "slate"}
            />
            <Chip
              icon={<Activity className="w-3.5 h-3.5" />}
              label="Andamento"
              value={String(andamento)}
              tone="slate"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "emerald" | "red" | "slate";
}) {
  const tones = {
    emerald: "text-emerald-700 bg-emerald-50/60 border-emerald-100",
    red: "text-red-600 bg-red-50/60 border-red-100",
    slate: "text-slate-700 bg-slate-50 border-slate-100",
  };
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${tones[tone]}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-80">
        {icon}
        {label}
      </div>
      <div className="text-[18px] font-semibold mt-0.5 num-tabular leading-none">{value}</div>
    </div>
  );
}
