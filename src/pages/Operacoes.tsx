import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Requisicao } from "@/types";
import { cn } from "@/lib/utils";
import { DecisionKPI } from "@/components/intelligence/DecisionKPI";
import { AIInsightInline, InsightVariant } from "@/components/intelligence/AIInsightInline";
import { PriorityDecisions } from "@/components/operacoes/PriorityDecisions";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Flame,
  Gauge,
  PackageCheck,
  Sparkles,
  Truck,
  Users,
  Zap,
} from "lucide-react";

// ----- helpers -----
const fmtBRL = (v: number) =>
  v >= 1000
    ? `R$ ${(v / 1000).toFixed(1).replace(".", ",")}k`
    : v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const daysBetween = (a: Date, b: Date) =>
  Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

const TERMINAL: Requisicao["status"][] = ["recebido", "rejeitado", "cancelado"];

// ----- event feed -----
type FeedEvent = {
  id: string;
  ts: Date;
  kind: "delay" | "received" | "approved" | "purchased" | "created" | "risk" | "saving" | "ai";
  title: string;
  detail?: string;
  badge?: string;
  reqId?: string;
  severity?: "low" | "medium" | "high";
};

function buildFeed(reqs: Requisicao[]): FeedEvent[] {
  const now = new Date();
  const events: FeedEvent[] = [];

  for (const r of reqs) {
    if (r.previsao_entrega && !TERMINAL.includes(r.status)) {
      const prev = new Date(r.previsao_entrega);
      if (prev < now) {
        const d = daysBetween(now, prev);
        events.push({
          id: `${r.id}-delay`,
          ts: prev,
          kind: "delay",
          title: `${r.fornecedor_nome || "Fornecedor"} atrasou entrega`,
          detail: `${r.item_nome} • ${d} dia(s) em atraso`,
          badge: r.protocolo,
          reqId: r.id,
          severity: d > 3 ? "high" : "medium",
        });
      }
    }
    if (r.recebido_em) {
      events.push({
        id: `${r.id}-rcv`,
        ts: new Date(r.recebido_em),
        kind: "received",
        title: `Entrega recebida • ${r.item_nome}`,
        detail: `${r.fornecedor_nome || "—"}`,
        badge: r.protocolo,
        reqId: r.id,
        severity: "low",
      });
    }
    if (r.comprado_em) {
      events.push({
        id: `${r.id}-buy`,
        ts: new Date(r.comprado_em),
        kind: "purchased",
        title: `Compra efetivada • ${r.item_nome}`,
        detail: r.valor ? `Valor ${fmtBRL(r.valor)}` : undefined,
        badge: r.protocolo,
        reqId: r.id,
        severity: "low",
      });
    }
    if (r.aprovado_em) {
      events.push({
        id: `${r.id}-apv`,
        ts: new Date(r.aprovado_em),
        kind: "approved",
        title: `Requisição aprovada`,
        detail: `${r.item_nome} • ${r.solicitante_setor}`,
        badge: r.protocolo,
        reqId: r.id,
        severity: "low",
      });
    }
    events.push({
      id: `${r.id}-new`,
      ts: new Date(r.created_at),
      kind: "created",
      title: `Nova requisição • ${r.item_nome}`,
      detail: `${r.solicitante_nome} — ${r.solicitante_setor}`,
      badge: r.protocolo,
      reqId: r.id,
      severity: r.prioridade === "ALTA" ? "medium" : "low",
    });
    if (r.valor_orcado && r.valor && r.valor < r.valor_orcado) {
      const eco = r.valor_orcado - r.valor;
      events.push({
        id: `${r.id}-eco`,
        ts: new Date(r.comprado_em || r.updated_at),
        kind: "saving",
        title: `Economia de ${fmtBRL(eco)} gerada`,
        detail: `${r.item_nome} • ${r.fornecedor_nome || "—"}`,
        badge: r.protocolo,
        reqId: r.id,
        severity: "low",
      });
    }
  }

  events.sort((a, b) => b.ts.getTime() - a.ts.getTime());
  return events.slice(0, 40);
}

const KIND_CFG: Record<
  FeedEvent["kind"],
  { icon: any; color: string; bg: string; label: string; action?: string }
> = {
  delay: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", label: "Atraso", action: "Resolver" },
  received: { icon: PackageCheck, color: "text-emerald-700", bg: "bg-emerald-50", label: "Recebido" },
  approved: { icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50", label: "Aprovado" },
  purchased: { icon: Truck, color: "text-blue-600", bg: "bg-blue-50", label: "Comprado", action: "Acompanhar" },
  created: { icon: Sparkles, color: "text-slate-600", bg: "bg-slate-50", label: "Nova", action: "Aprovar" },
  risk: { icon: Flame, color: "text-orange-600", bg: "bg-orange-50", label: "Risco" },
  saving: { icon: DollarSign, color: "text-emerald-700", bg: "bg-emerald-50", label: "Economia" },
  ai: { icon: Bot, color: "text-violet-700", bg: "bg-violet-50", label: "IA" },
};

function timeAgo(d: Date) {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function bucketize(events: FeedEvent[]) {
  const now = Date.now();
  const buckets: Record<string, FeedEvent[]> = {
    Agora: [],
    "Últimas 2h": [],
    Hoje: [],
    "Esta semana": [],
    Anteriores: [],
  };
  for (const e of events) {
    const diffMin = (now - e.ts.getTime()) / 60000;
    if (diffMin < 5) buckets["Agora"].push(e);
    else if (diffMin < 120) buckets["Últimas 2h"].push(e);
    else if (diffMin < 60 * 24) buckets["Hoje"].push(e);
    else if (diffMin < 60 * 24 * 7) buckets["Esta semana"].push(e);
    else buckets["Anteriores"].push(e);
  }
  return buckets;
}

// ----- main page -----
export default function Operacoes() {
  const { user, isLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const [reqs, setReqs] = useState<Requisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | FeedEvent["kind"]>("todos");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!isLoading && rolesLoaded && !user) navigate("/auth");
  }, [isLoading, rolesLoaded, user, navigate]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("requisicoes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!active) return;
      setReqs((data || []) as Requisicao[]);
      setLastUpdate(new Date());
      setLoading(false);
    };
    load();
    const t = setInterval(load, 20000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  const metrics = useMemo(() => {
    const now = new Date();
    const open = reqs.filter((r) => !TERMINAL.includes(r.status));
    const atrasadas = open.filter((r) => r.previsao_entrega && new Date(r.previsao_entrega) < now);
    const emRisco = open.filter((r) => {
      if (!r.previsao_entrega) return false;
      const d = daysBetween(new Date(r.previsao_entrega), now);
      return d >= 0 && d <= 2;
    });
    const pendentesAlta = reqs.filter((r) => r.status === "pendente" && r.prioridade === "ALTA");
    const economia = reqs.reduce((acc, r) => {
      if (r.valor_orcado && r.valor && r.valor < r.valor_orcado) return acc + (r.valor_orcado - r.valor);
      return acc;
    }, 0);
    const lead = reqs
      .filter((r) => r.recebido_em)
      .map((r) => daysBetween(new Date(r.recebido_em!), new Date(r.created_at)));
    const leadAvg = lead.length ? lead.reduce((a, b) => a + b, 0) / lead.length : 0;

    // Impacto financeiro estimado de atrasos (somar valor das atrasadas)
    const impactoAtrasos = atrasadas.reduce((acc, r) => acc + (r.valor || r.valor_orcado || 0), 0);
    const valorEmRisco = emRisco.reduce((acc, r) => acc + (r.valor || r.valor_orcado || 0), 0);

    // Sparkline: últimos 7 dias de criação
    const buckets = Array(7).fill(0);
    reqs.forEach((r) => {
      const d = daysBetween(now, new Date(r.created_at));
      if (d >= 0 && d < 7) buckets[6 - d]++;
    });

    // Top fornecedor risco
    const supplierMap = new Map<string, { total: number; late: number }>();
    reqs.forEach((r) => {
      if (!r.fornecedor_nome) return;
      const cur = supplierMap.get(r.fornecedor_nome) || { total: 0, late: 0 };
      cur.total++;
      if (r.previsao_entrega && new Date(r.previsao_entrega) < now && !TERMINAL.includes(r.status))
        cur.late++;
      supplierMap.set(r.fornecedor_nome, cur);
    });
    const fornCriticos = [...supplierMap.entries()]
      .filter(([, v]) => v.late > 0)
      .sort((a, b) => b[1].late - a[1].late)
      .slice(0, 4);

    const setorMap = new Map<string, number>();
    reqs.forEach((r) =>
      setorMap.set(r.solicitante_setor, (setorMap.get(r.solicitante_setor) || 0) + (r.valor || 0)),
    );
    const totalGasto = [...setorMap.values()].reduce((a, b) => a + b, 0);
    const topSetor = [...setorMap.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      abertas: open.length,
      atrasadas: atrasadas.length,
      emRisco: emRisco.length,
      pendentesAlta: pendentesAlta.length,
      economia,
      leadAvg,
      impactoAtrasos,
      valorEmRisco,
      sparkCriacao: buckets,
      fornCriticos,
      totalGasto,
      topSetor,
    };
  }, [reqs]);

  const feed = useMemo(() => buildFeed(reqs), [reqs]);
  const visibleFeed = filter === "todos" ? feed : feed.filter((e) => e.kind === filter);
  const groups = useMemo(() => bucketize(visibleFeed), [visibleFeed]);

  const aiPulse = useMemo<{ text: string; variant: InsightVariant }[]>(() => {
    const list: { text: string; variant: InsightVariant }[] = [];
    if (metrics.atrasadas > 0)
      list.push({
        variant: "risk",
        text: `${metrics.atrasadas} entrega(s) em atraso · impacto estimado ${fmtBRL(metrics.impactoAtrasos)}.`,
      });
    if (metrics.fornCriticos[0])
      list.push({
        variant: "anomaly",
        text: `${metrics.fornCriticos[0][0]} concentra ${metrics.fornCriticos[0][1].late} atraso(s) — risco de fornecedor.`,
      });
    if (metrics.economia > 0)
      list.push({
        variant: "opportunity",
        text: `Economia acumulada de ${fmtBRL(metrics.economia)} vs orçado neste período.`,
      });
    if (metrics.topSetor && metrics.totalGasto > 0) {
      const pct = (metrics.topSetor[1] / metrics.totalGasto) * 100;
      if (pct > 35)
        list.push({
          variant: "trend",
          text: `${metrics.topSetor[0]} concentra ${pct.toFixed(0)}% do gasto — concentração relevante.`,
        });
    }
    if (metrics.leadAvg > 0)
      list.push({
        variant: "trend",
        text: `Lead time médio: ${metrics.leadAvg.toFixed(1)}d entre requisição e recebimento.`,
      });
    if (list.length === 0)
      list.push({
        variant: "neutral",
        text: "Nenhum risco operacional detectado. Cadeia em equilíbrio.",
      });
    return list;
  }, [metrics]);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-2))]">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-10">
        {/* Hero strip */}
        <header className="mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live · Procurement Command Center
              <span className="text-emerald-600/70 normal-case font-normal tracking-normal ml-1">
                atualizado {timeAgo(lastUpdate)}
              </span>
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight text-slate-900 leading-tight">
              Inteligência operacional <span className="text-slate-400">de compras</span>
            </h1>
            <p className="text-[13px] text-slate-500 mt-1.5 max-w-xl">
              Decisões prioritárias, eventos vivos e contexto inteligente — uma única central executiva.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/painel")}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 bg-white text-[12.5px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Ver todas requisições
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate("/requisicao")}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[12.5px] font-semibold shadow-sm transition-colors"
            >
              Nova requisição
            </button>
          </div>
        </header>

        {/* Decision KPIs - decisórios, não meramente informativos */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-7">
          <DecisionKPI
            label="Em aberto"
            value={metrics.abertas.toString()}
            icon={Activity}
            severity="low"
            spark={metrics.sparkCriacao}
            hint="requisições ativas"
          />
          <DecisionKPI
            label="Atrasadas"
            value={metrics.atrasadas.toString()}
            icon={AlertTriangle}
            severity={metrics.atrasadas > 5 ? "high" : metrics.atrasadas > 0 ? "medium" : "low"}
            impact={metrics.impactoAtrasos > 0 ? `Impacto ${fmtBRL(metrics.impactoAtrasos)}` : "sem impacto"}
            onClick={() => navigate("/painel")}
          />
          <DecisionKPI
            label="Em risco"
            value={metrics.emRisco.toString()}
            icon={CalendarClock}
            severity={metrics.emRisco > 3 ? "medium" : "low"}
            impact={metrics.valorEmRisco > 0 ? `Valor ${fmtBRL(metrics.valorEmRisco)}` : "vencem em ≤ 2d"}
          />
          <DecisionKPI
            label="Urgentes pendentes"
            value={metrics.pendentesAlta.toString()}
            icon={Flame}
            severity={metrics.pendentesAlta > 0 ? "high" : "low"}
            impact={metrics.pendentesAlta > 0 ? "aguardando aprovação" : "tudo em dia"}
          />
          <DecisionKPI
            label="Economia gerada"
            value={metrics.economia > 0 ? fmtBRL(metrics.economia) : "—"}
            icon={DollarSign}
            severity="low"
            hint="vs valor orçado"
          />
        </section>

        {/* Two column grid: main column (decisions + feed) + right rail (AI Pulse + critical + savings) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Priority decisions */}
            <PriorityDecisions reqs={reqs} limit={5} />

            {/* Live feed - grouped temporally */}
            <div className="card-elevated-static overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">Feed operacional</div>
                    <div className="text-[11px] text-slate-500">
                      Eventos, riscos e movimentações da operação
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[11px]">
                  {(["todos", "delay", "purchased", "received", "saving", "approved"] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setFilter(k)}
                      className={cn(
                        "px-2 py-1 rounded-md font-medium transition-colors",
                        filter === k
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                      )}
                    >
                      {k === "todos" ? "Todos" : KIND_CFG[k].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[640px] overflow-auto custom-scrollbar">
                {loading && (
                  <div className="p-10 text-center text-[13px] text-slate-400">
                    Carregando eventos...
                  </div>
                )}
                {!loading && visibleFeed.length === 0 && (
                  <div className="p-10 text-center text-[13px] text-slate-400">
                    Sem eventos para este filtro.
                  </div>
                )}

                {!loading &&
                  Object.entries(groups).map(([groupName, items]) => {
                    if (items.length === 0) return null;
                    return (
                      <div key={groupName}>
                        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-5 py-2 border-b border-slate-100 flex items-center justify-between">
                          <span className="eyebrow">{groupName}</span>
                          <span className="text-[10px] text-slate-400 tabular-nums">
                            {items.length}
                          </span>
                        </div>
                        <ul className="divide-y divide-slate-100">
                          {items.map((e, idx) => {
                            const cfg = KIND_CFG[e.kind];
                            const Icon = cfg.icon;
                            const sevBar =
                              e.severity === "high"
                                ? "bg-red-500"
                                : e.severity === "medium"
                                  ? "bg-amber-500"
                                  : "bg-transparent";
                            return (
                              <li
                                key={e.id}
                                className="group relative flex items-start gap-3 px-5 py-3.5 hover:bg-[hsl(var(--surface-2))]/60 transition-colors"
                                style={{
                                  animation: `fadeIn .35s ease-out ${Math.min(idx, 8) * 25}ms backwards`,
                                }}
                              >
                                <span
                                  className={cn(
                                    "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full",
                                    sevBar,
                                  )}
                                />
                                <div
                                  className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 relative",
                                    cfg.bg,
                                  )}
                                >
                                  <Icon className={cn("w-4 h-4", cfg.color)} />
                                  {e.severity === "high" && (
                                    <span className="absolute inset-0 rounded-lg ring-2 ring-red-300/60 animate-pulse" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2">
                                    <span
                                      className={cn(
                                        "text-[10px] font-semibold uppercase tracking-wide",
                                        cfg.color,
                                      )}
                                    >
                                      {cfg.label}
                                    </span>
                                    {e.badge && (
                                      <span className="text-[10px] font-mono text-slate-400">
                                        {e.badge}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 ml-auto">
                                      {timeAgo(e.ts)}
                                    </span>
                                  </div>
                                  <div className="text-[13px] font-medium text-slate-900 leading-snug mt-0.5">
                                    {e.title}
                                  </div>
                                  {e.detail && (
                                    <div className="text-[12px] text-slate-500 mt-0.5">
                                      {e.detail}
                                    </div>
                                  )}
                                </div>
                                {cfg.action && e.reqId ? (
                                  <button
                                    onClick={() => navigate(`/painel/${e.reqId}`)}
                                    className="flex-shrink-0 self-center inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-white bg-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 px-2 py-1 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    {cfg.action}
                                  </button>
                                ) : (
                                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-700 transition-colors mt-1" />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right rail */}
          <aside className="space-y-5">
            {/* AI Pulse */}
            <div className="card-elevated-static p-5 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-violet-500/10 to-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2.5 mb-4 relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-900">AI Pulse</div>
                  <div className="text-[11px] text-slate-500">
                    Análise contextual em tempo real
                  </div>
                </div>
              </div>
              <div className="space-y-2 relative">
                {aiPulse.map((ins, i) => (
                  <AIInsightInline key={i} text={ins.text} variant={ins.variant} compact />
                ))}
              </div>
            </div>

            {/* Critical suppliers */}
            {metrics.fornCriticos.length > 0 && (
              <div className="card-elevated-static p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <div className="text-[13px] font-semibold text-slate-900">
                    Fornecedores críticos
                  </div>
                </div>
                <ul className="space-y-2">
                  {metrics.fornCriticos.map(([nome, v]) => {
                    const ratio = (v.late / v.total) * 100;
                    return (
                      <li key={nome} className="space-y-1">
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="text-slate-700 truncate pr-2 font-medium">{nome}</span>
                          <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded tabular-nums">
                            {v.late}/{v.total}
                          </span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Sector concentration */}
            {metrics.topSetor && metrics.totalGasto > 0 && (
              <div className="card-elevated-static p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-violet-700" />
                  </div>
                  <div className="text-[13px] font-semibold text-slate-900">Concentração de gasto</div>
                </div>
                <div className="text-[24px] font-semibold tracking-tight text-slate-900 num-tabular">
                  {((metrics.topSetor[1] / metrics.totalGasto) * 100).toFixed(0)}%
                </div>
                <div className="text-[12px] text-slate-500">
                  do gasto total vem de <span className="font-medium text-slate-700">{metrics.topSetor[0]}</span>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="card-elevated-static p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="text-[13px] font-semibold text-slate-900">Ações rápidas</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Aprovar pendências", to: "/painel" },
                  { label: "Ver atrasadas", to: "/painel" },
                  { label: "Nova requisição", to: "/requisicao" },
                  { label: "Painel completo", to: "/painel" },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => navigate(a.to)}
                    className="text-left text-[12px] font-medium px-2.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {/* Lead time metric strip */}
        {metrics.leadAvg > 0 && (
          <section className="mt-5">
            <div className="card-elevated-static p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Gauge className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] text-slate-500">Lead time médio operacional</div>
                <div className="text-[18px] font-semibold text-slate-900 num-tabular">
                  {metrics.leadAvg.toFixed(1)} dias
                  <span className="text-[12px] font-normal text-slate-500 ml-2">
                    entre requisição e recebimento
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
