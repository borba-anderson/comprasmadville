import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Requisicao } from "@/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock, Flame, ArrowRight, Truck } from "lucide-react";

const TERMINAL: Requisicao["status"][] = ["recebido", "rejeitado", "cancelado"];

const fmtBRL = (v: number) =>
  v >= 1000
    ? `R$ ${(v / 1000).toFixed(1).replace(".", ",")}k`
    : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Decision = {
  id: string;
  reqId: string;
  priority: 1 | 2 | 3;
  icon: any;
  iconBg: string;
  title: string;
  detail: string;
  actionLabel: string;
  badge?: string;
  meta?: string;
};

interface Props {
  reqs: Requisicao[];
  limit?: number;
}

export function PriorityDecisions({ reqs, limit = 5 }: Props) {
  const navigate = useNavigate();

  const decisions = useMemo<Decision[]>(() => {
    const now = new Date();
    const out: Decision[] = [];

    // 1) Pendentes de alta prioridade
    reqs
      .filter((r) => r.status === "pendente" && r.prioridade === "ALTA")
      .slice(0, 3)
      .forEach((r) =>
        out.push({
          id: `${r.id}-pa`,
          reqId: r.id,
          priority: 1,
          icon: Flame,
          iconBg: "bg-red-50 text-red-600",
          title: `Aprovar urgente · ${r.item_nome}`,
          detail: `${r.solicitante_nome} — ${r.solicitante_setor}`,
          actionLabel: "Revisar",
          badge: r.protocolo,
          meta: r.valor_orcado ? `Orçado ${fmtBRL(r.valor_orcado)}` : undefined,
        }),
      );

    // 2) Atrasos com fornecedor
    reqs
      .filter(
        (r) =>
          r.previsao_entrega && new Date(r.previsao_entrega) < now && !TERMINAL.includes(r.status),
      )
      .slice(0, 3)
      .forEach((r) => {
        const days = Math.floor(
          (now.getTime() - new Date(r.previsao_entrega!).getTime()) / 86400000,
        );
        out.push({
          id: `${r.id}-dl`,
          reqId: r.id,
          priority: 2,
          icon: AlertTriangle,
          iconBg: "bg-amber-50 text-amber-700",
          title: `Resolver atraso · ${r.fornecedor_nome || "Fornecedor"}`,
          detail: `${r.item_nome} • ${days}d em atraso`,
          actionLabel: "Acionar",
          badge: r.protocolo,
          meta: r.valor ? `Valor ${fmtBRL(r.valor)}` : undefined,
        });
      });

    // 3) Comprados aguardando recebimento (entrega próxima)
    reqs
      .filter((r) => {
        if (r.status !== "comprado" && r.status !== "em_entrega") return false;
        if (!r.previsao_entrega) return false;
        const d = (new Date(r.previsao_entrega).getTime() - now.getTime()) / 86400000;
        return d >= 0 && d <= 2;
      })
      .slice(0, 2)
      .forEach((r) =>
        out.push({
          id: `${r.id}-rc`,
          reqId: r.id,
          priority: 3,
          icon: Truck,
          iconBg: "bg-blue-50 text-blue-700",
          title: `Confirmar recebimento iminente · ${r.item_nome}`,
          detail: `${r.fornecedor_nome || "—"}`,
          actionLabel: "Acompanhar",
          badge: r.protocolo,
        }),
      );

    return out.sort((a, b) => a.priority - b.priority).slice(0, limit);
  }, [reqs, limit]);

  if (decisions.length === 0) {
    return (
      <div className="card-elevated-static p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-slate-900">Sem decisões pendentes</div>
          <div className="text-[12px] text-slate-500">Cadeia em equilíbrio operacional.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-elevated-static overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-slate-900">Decisões prioritárias</div>
            <div className="text-[11px] text-slate-500">
              {decisions.length} ação(ões) que destravam a operação agora
            </div>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {decisions.map((d, idx) => {
          const Icon = d.icon;
          return (
            <li
              key={d.id}
              className="group relative flex items-center gap-3 px-5 py-3.5 hover:bg-[hsl(var(--surface-2))]/60 transition-colors"
              style={{ animation: `fadeIn .35s ease-out ${idx * 40}ms backwards` }}
            >
              <div
                className={cn(
                  "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full",
                  d.priority === 1 && "bg-red-500",
                  d.priority === 2 && "bg-amber-500",
                  d.priority === 3 && "bg-blue-500",
                )}
              />
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", d.iconBg)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] font-semibold text-slate-900 truncate">{d.title}</span>
                  {d.badge && (
                    <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                      {d.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11.5px] text-slate-500 truncate">
                  {d.detail}
                  {d.meta && <span className="text-slate-400"> · {d.meta}</span>}
                </div>
              </div>
              <button
                onClick={() => navigate(`/painel/${d.reqId}`)}
                className="flex-shrink-0 inline-flex items-center gap-1 text-[11.5px] font-semibold text-slate-700 hover:text-white bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 px-2.5 py-1.5 rounded-md transition-colors"
              >
                {d.actionLabel}
                <ArrowRight className="w-3 h-3" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
