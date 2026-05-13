import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Requisicao } from "@/types";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Flame,
  Gauge,
  PackageCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
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

// ----- animated counter -----
function useCountUp(target: number, durationMs = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}

function KpiTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  trend,
  format = "int",
}: {
  label: string;
  value: number;
  hint?: string;
  icon: React.ElementType;
  tone?: "neutral" | "primary" | "danger" | "warning" | "success";
  trend?: { value: number; inverted?: boolean };
  format?: "int" | "currency" | "percent" | "days";
}) {
  const v = useCountUp(value);
  const display =
    format === "currency"
      ? fmtBRL(v)
      : format === "percent"
        ? `${v.toFixed(0)}%`
        : format === "days"
          ? `${v.toFixed(1)}d`
          : Math.round(v).toLocaleString("pt-BR");

  const toneRing: Record<string, string> = {
    neutral: "before:bg-slate-200/0",
    primary: "before:bg-emerald-500/40",
    danger: "before:bg-red-500/40",
    warning: "before:bg-amber-500/40",
    success: "before:bg-emerald-500/40",
  };
  const iconBg: Record<string, string> = {
    neutral: "bg-slate-50 text-slate-600",
    primary: "bg-emerald-50 text-emerald-700",
    danger: "bg-red-50 text-red-600",
    warning: "bg-amber-50 text-amber-700",
    success: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-200/70 bg-white p-4 transition-all",
        "hover:border-slate-300 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]",
        "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:opacity-70",
        toneRing[tone]
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg[tone])}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {trend && trend.value !== 0 && (
          <div
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
              (trend.inverted ? trend.value < 0 : trend.value > 0)
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            )}
          >
            {trend.value > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value > 0 ? "+" : ""}
            {trend.value.toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-[26px] font-semibold tracking-tight text-slate-900 tabular-nums leading-none">
        {display}
      </div>
      <div className="mt-1.5 text-[12px] font-medium text-slate-700">{label}</div>
      {hint && <div className="text-[11px] text-slate-400 mt-0.5">{hint}</div>}
    </div>
  );
}

// ----- event feed builder -----
type FeedEvent = {
  id: string;
  ts: Date;
  kind: "delay" | "received" | "approved" | "purchased" | "created" | "risk" | "saving" | "ai";
  title: string;
  detail?: string;
  badge?: string;
  reqId?: string;
};

function buildFeed(reqs: Requisicao[]): FeedEvent[] {
  const now = new Date();
  const events: FeedEvent[] = [];

  for (const r of reqs) {
    // delays
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
    });
    // savings
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
      });
    }
  }

  events.sort((a, b) => b.ts.getTime() - a.ts.getTime());
  return events.slice(0, 30);
}

const KIND_CFG: Record<FeedEvent["kind"], { icon: React.ElementType; color: string; bg: string; label: string }> = {
  delay: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", label: "Atraso" },
  received: { icon: PackageCheck, color: "text-emerald-700", bg: "bg-emerald-50", label: "Recebido" },
  approved: { icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50", label: "Aprovado" },
  purchased: { icon: Truck, color: "text-blue-600", bg: "bg-blue-50", label: "Comprado" },
  created: { icon: Sparkles, color: "text-slate-600", bg: "bg-slate-50", label: "Nova" },
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

// ----- main page -----
export default function Operacoes() {
  const { user, isLoading, rolesLoaded } = useAuth();
  const navigate = useNavigate();
  const [reqs, setReqs] = useState<Requisicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todos" | FeedEvent["kind"]>("todos");

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

    // top fornecedor risco
    const supplierMap = new Map<string, { total: number; late: number }>();
    reqs.forEach((r) => {
      if (!r.fornecedor_nome) return;
      const cur = supplierMap.get(r.fornecedor_nome) || { total: 0, late: 0 };
      cur.total++;
      if (r.previsao_entrega && new Date(r.previsao_entrega) < now && !TERMINAL.includes(r.status)) cur.late++;
      supplierMap.set(r.fornecedor_nome, cur);
    });
    const fornCriticos = [...supplierMap.entries()]
      .filter(([, v]) => v.late > 0)
      .sort((a, b) => b[1].late - a[1].late)
      .slice(0, 3);

    // setor concentrador
    const setorMap = new Map<string, number>();
    reqs.forEach((r) => setorMap.set(r.solicitante_setor, (setorMap.get(r.solicitante_setor) || 0) + (r.valor || 0)));
    const totalGasto = [...setorMap.values()].reduce((a, b) => a + b, 0);
    const topSetor = [...setorMap.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      abertas: open.length,
      atrasadas: atrasadas.length,
      emRisco: emRisco.length,
      pendentesAlta: pendentesAlta.length,
      economia,
      leadAvg,
      fornCriticos,
      totalGasto,
      topSetor,
    };
  }, [reqs]);

  const feed = useMemo(() => buildFeed(reqs), [reqs]);
  const visibleFeed = filter === "todos" ? feed : feed.filter((e) => e.kind === filter);

  const aiInsights = useMemo(() => {
    const list: { icon: React.ElementType; tone: string; text: string }[] = [];
    if (metrics.atrasadas > 0)
      list.push({
        icon: AlertTriangle,
        tone: "text-red-600 bg-red-50",
        text: `IA detectou ${metrics.atrasadas} entrega(s) em atraso — risco operacional ALTO.`,
      });
    if (metrics.economia > 0)
      list.push({
        icon: DollarSign,
        tone: "text-emerald-700 bg-emerald-50",
        text: `Economia acumulada de ${fmtBRL(metrics.economia)} identificada vs orçado.`,
      });
    if (metrics.fornCriticos[0])
      list.push({
        icon: Flame,
        tone: "text-orange-600 bg-orange-50",
        text: `Fornecedor crítico: ${metrics.fornCriticos[0][0]} com ${metrics.fornCriticos[0][1].late} atraso(s).`,
      });
    if (metrics.topSetor && metrics.totalGasto > 0) {
      const pct = (metrics.topSetor[1] / metrics.totalGasto) * 100;
      if (pct > 35)
        list.push({
          icon: Users,
          tone: "text-violet-700 bg-violet-50",
          text: `${metrics.topSetor[0]} concentra ${pct.toFixed(0)}% do gasto — oportunidade de otimização.`,
        });
    }
    if (metrics.leadAvg > 0)
      list.push({
        icon: Gauge,
        tone: "text-blue-600 bg-blue-50",
        text: `Lead time médio operacional: ${metrics.leadAvg.toFixed(1)} dia(s) entre requisição e recebimento.`,
      });
    if (list.length === 0)
      list.push({
        icon: Sparkles,
        tone: "text-emerald-700 bg-emerald-50",
        text: "Nenhum risco operacional detectado. Cadeia em equilíbrio.",
      });
    return list;
  }, [metrics]);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-2))]">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-10">
        {/* Hero strip */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live • Procurement Command Center
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight text-slate-900 leading-tight">
              Inteligência operacional <span className="text-slate-400">de compras</span>
            </h1>
            <p className="text-[13px] text-slate-500 mt-1.5 max-w-xl">
              Eventos, riscos, oportunidades e decisões — tudo em uma única central viva, atualizada a cada 20s.
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

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <KpiTile label="Em aberto" hint="requisições ativas" value={metrics.abertas} icon={Activity} tone="primary" />
          <KpiTile label="Atrasadas" hint="entregas vencidas" value={metrics.atrasadas} icon={AlertTriangle} tone="danger" />
          <KpiTile label="Em risco" hint="vencem em ≤ 2 dias" value={metrics.emRisco} icon={CalendarClock} tone="warning" />
          <KpiTile label="Urgentes pendentes" hint="prioridade ALTA" value={metrics.pendentesAlta} icon={Flame} tone="warning" />
          <KpiTile label="Economia gerada" value={metrics.economia} icon={DollarSign} tone="success" format="currency" hint="vs valor orçado" />
          <KpiTile label="Lead time médio" value={metrics.leadAvg} icon={Gauge} tone="neutral" format="days" hint="req → recebimento" />
        </section>

        {/* AI insights row */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-violet-500/10 to-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">IA Operacional identificou</div>
              <div className="text-[11px] text-slate-500">Análise contextual em tempo real sobre a cadeia de compras</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {aiInsights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/70 bg-[hsl(var(--surface-2))]/40 hover:bg-white transition-colors"
                  style={{ animation: `fadeIn .4s ease-out ${i * 60}ms backwards` }}
                >
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", ins.tone)}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[12.5px] text-slate-700 leading-snug pt-0.5">{ins.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Two column: feed + alerts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Feed */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-900">Feed operacional</div>
                  <div className="text-[11px] text-slate-500">Eventos, riscos e movimentações da operação</div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px]">
                {(["todos", "delay", "purchased", "received", "saving", "approved"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={cn(
                      "px-2 py-1 rounded-md font-medium capitalize transition-colors",
                      filter === k
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {k === "todos" ? "Todos" : KIND_CFG[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[640px] overflow-auto custom-scrollbar">
              {loading && (
                <div className="p-10 text-center text-[13px] text-slate-400">Carregando eventos...</div>
              )}
              {!loading && visibleFeed.length === 0 && (
                <div className="p-10 text-center text-[13px] text-slate-400">Sem eventos para este filtro.</div>
              )}
              {visibleFeed.map((e, idx) => {
                const cfg = KIND_CFG[e.kind];
                const Icon = cfg.icon;
                return (
                  <button
                    key={e.id}
                    onClick={() => e.reqId && navigate(`/painel/${e.reqId}`)}
                    className="w-full text-left flex items-start gap-3 px-5 py-3.5 hover:bg-[hsl(var(--surface-2))]/60 transition-colors group"
                    style={{ animation: `fadeIn .35s ease-out ${Math.min(idx, 10) * 30}ms backwards` }}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", cfg.bg)}>
                      <Icon className={cn("w-4 h-4", cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className={cn("text-[10px] font-semibold uppercase tracking-wide", cfg.color)}>
                          {cfg.label}
                        </span>
                        {e.badge && (
                          <span className="text-[10px] font-mono text-slate-400">{e.badge}</span>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto">{timeAgo(e.ts)}</span>
                      </div>
                      <div className="text-[13px] font-medium text-slate-900 leading-snug mt-0.5">{e.title}</div>
                      {e.detail && <div className="text-[12px] text-slate-500 mt-0.5">{e.detail}</div>}
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-700 transition-colors mt-1" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right rail: alerts + quick actions */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div className="text-[13px] font-semibold text-slate-900">Central de alertas</div>
              </div>
              <ul className="space-y-2.5 text-[12.5px]">
                <li className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/50 border border-red-100">
                  <span className="text-slate-700">Entregas em atraso</span>
                  <span className="font-semibold text-red-600 tabular-nums">{metrics.atrasadas}</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 border border-amber-100">
                  <span className="text-slate-700">Em risco (≤ 2d)</span>
                  <span className="font-semibold text-amber-700 tabular-nums">{metrics.emRisco}</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50/50 border border-orange-100">
                  <span className="text-slate-700">Urgentes pendentes</span>
                  <span className="font-semibold text-orange-700 tabular-nums">{metrics.pendentesAlta}</span>
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="text-slate-700">Economia detectada</span>
                  <span className="font-semibold text-emerald-700 tabular-nums">{fmtBRL(metrics.economia)}</span>
                </li>
              </ul>
            </div>

            {metrics.fornCriticos.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                  </div>
                  <div className="text-[13px] font-semibold text-slate-900">Fornecedores críticos</div>
                </div>
                <ul className="space-y-2">
                  {metrics.fornCriticos.map(([nome, v]) => (
                    <li key={nome} className="flex items-center justify-between text-[12.5px]">
                      <span className="text-slate-700 truncate pr-2">{nome}</span>
                      <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">
                        {v.late} atraso{v.late > 1 ? "s" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
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
      </main>
    </div>
  );
}
