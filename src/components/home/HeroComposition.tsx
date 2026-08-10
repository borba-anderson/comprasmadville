import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import {
  TrendingUp,
  Clock,
  Package,
  CheckCircle2,
  Users,
  ArrowUpRight,
  Search,
  Bell,
  Filter,
  BarChart3,
  Sparkles,
} from "lucide-react";

/* ---------------- helpers ---------------- */

const useParallax = (mx: MotionValue<number>, my: MotionValue<number>, depth: number) => {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return { x, y };
};

const spring = { type: "spring" as const, stiffness: 80, damping: 18, mass: 0.6 };

/* ---------------- mini UI ---------------- */

const Dot = ({ c }: { c: string }) => <span className={`w-2 h-2 rounded-full ${c}`} />;

const WindowChrome = ({ title }: { title: string }) => (
  <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-border/70 bg-card/70">
    <Dot c="bg-rose-300" />
    <Dot c="bg-amber-300" />
    <Dot c="bg-emerald-300" />
    <div className="ml-2 text-[10.5px] font-medium text-muted-foreground tracking-tight">{title}</div>
  </div>
);

/* ---------------- panels ---------------- */

/* BACK — Analytics dashboard */
function DashboardPanel() {
  return (
    <div className="w-[480px] rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] overflow-hidden">
      <WindowChrome title="gmad.app / dashboard" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Spend overview</div>
            <div className="text-[18px] font-bold text-foreground tracking-tight tabular-nums mt-0.5">R$ 1.284.520</div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <TrendingUp size={10} /> +12,4%
          </div>
        </div>

        {/* Bars */}
        <div className="grid grid-cols-12 gap-1.5 h-[88px] items-end pt-2">
          {[40, 65, 50, 78, 60, 92, 70, 85, 55, 95, 72, 88].map((h, i) => (
            <div key={i} className="relative flex-1 rounded-sm bg-muted overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-500 to-emerald-400"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { l: "Aprovadas", v: "184" },
            { l: "Em revisão", v: "37" },
            { l: "Concluídas", v: "92" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-border bg-muted/60 px-2 py-1.5">
              <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">{s.l}</div>
              <div className="text-[13px] font-bold text-foreground tabular-nums">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* MIDDLE — Requisições table */
function RequisicoesPanel() {
  const rows = [
    { id: "#REQ-2841", who: "Marina S.", val: "R$ 24.800", st: "Aprovada", c: "emerald" },
    { id: "#REQ-2840", who: "Pedro L.", val: "R$ 8.450", st: "Em análise", c: "amber" },
    { id: "#REQ-2839", who: "Carla T.", val: "R$ 62.100", st: "Cotação", c: "sky" },
    { id: "#REQ-2838", who: "Diego R.", val: "R$ 3.220", st: "Aprovada", c: "emerald" },
  ];
  const cmap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
  };

  return (
    <div className="w-[400px] rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)] overflow-hidden">
      <WindowChrome title="gmad.app / requisições" />
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex-1 flex items-center gap-1.5 h-7 px-2 rounded-md bg-muted border border-border">
            <Search size={11} className="text-muted-foreground" />
            <span className="text-[10.5px] text-muted-foreground">Buscar requisição…</span>
          </div>
          <button className="h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center">
            <Filter size={11} className="text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-1">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full bg-emerald-500/70" />
                <div>
                  <div className="text-[11px] font-semibold text-foreground tabular-nums">{r.id}</div>
                  <div className="text-[9.5px] text-muted-foreground">{r.who}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[11px] font-bold text-foreground tabular-nums">{r.val}</div>
                <span className={`text-[8.5px] font-semibold px-1.5 py-0.5 rounded ${cmap[r.c]}`}>{r.st}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* FRONT — KPI / AI Insight */
function AIPanel() {
  return (
    <div className="w-[280px] rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-[0_35px_90px_-25px_rgba(0,134,81,0.35)] overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-border bg-gradient-to-r from-emerald-50/80 to-white flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
          <Sparkles size={11} className="text-white" />
        </div>
        <span className="text-[10.5px] font-bold text-foreground tracking-tight">AI Insight</span>
        <span className="ml-auto text-[8.5px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">LIVE</span>
      </div>
      <div className="p-3.5 space-y-2.5">
        <div className="text-[11px] leading-snug text-foreground">
          Detectada oportunidade de <span className="font-semibold text-emerald-700">economia de 8,2%</span> no
          fornecedor #142 com base no histórico de cotações.
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-bold text-foreground tracking-tight tabular-nums">R$ 18.420</span>
          <span className="text-[10px] font-medium text-muted-foreground">economia projetada</span>
        </div>
        <button className="w-full text-[10.5px] font-semibold text-white bg-foreground hover:bg-foreground/90 transition-colors rounded-md h-7 flex items-center justify-center gap-1.5">
          Aplicar sugestão <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  );
}

/* Floating mini-cards (KPIs) */
function FloatingKPI({
  icon: Icon,
  label,
  value,
  trend,
  className = "",
  style,
}: {
  icon: any;
  label: string;
  value: string;
  trend?: string;
  className?: string;
  style?: any;
}) {
  return (
    <motion.div
      style={style}
      whileHover={{ y: -4, scale: 1.04 }}
      transition={spring}
      className={`absolute z-30 px-3 py-2.5 rounded-xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-[0_15px_45px_-15px_rgba(15,23,42,0.35)] ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Icon size={13} className="text-emerald-600" />
        </div>
        <div>
          <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] font-bold text-foreground tabular-nums tracking-tight">{value}</span>
            {trend && <span className="text-[9px] font-semibold text-emerald-600">{trend}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- main composition ---------------- */

export function HeroComposition() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // springs for smooth tracking
  const smx = useSpring(mx, { stiffness: 80, damping: 20, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 80, damping: 20, mass: 0.5 });

  // parallax layers
  const back = useParallax(smx, smy, 0.6);
  const mid = useParallax(smx, smy, 1.1);
  const front = useParallax(smx, smy, 1.8);
  const k1 = useParallax(smx, smy, 2.2);
  const k2 = useParallax(smx, smy, 2.6);
  const k3 = useParallax(smx, smy, 1.6);

  // subtle rotation tied to mouse for 3D feel
  const rotY = useTransform(smx, [-50, 50], [4, -4]);
  const rotX = useTransform(smy, [-50, 50], [-3, 3]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set(((e.clientX - cx) / r.width) * 100);
    my.set(((e.clientY - cy) / r.height) * 100);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-[520px] hidden lg:block"
      style={{ perspective: 1400 }}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        transition={spring}
        className="absolute inset-0"
      >
        {/* soft glows */}
        <div className="absolute top-10 right-10 w-[380px] h-[380px] bg-emerald-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-[300px] h-[300px] bg-muted-foreground/20 rounded-full blur-3xl" />

        {/* BACK panel — dashboard */}
        <motion.div
          style={{ x: back.x, y: back.y, translateZ: 0 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] right-[2%] z-10"
        >
          <div style={{ transform: "rotate(2deg)" }}>
            <DashboardPanel />
          </div>
        </motion.div>

        {/* MIDDLE panel — requisições */}
        <motion.div
          style={{ x: mid.x, y: mid.y }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute top-[34%] left-[2%] z-20"
        >
          <div style={{ transform: "rotate(-3deg)" }}>
            <RequisicoesPanel />
          </div>
        </motion.div>

        {/* FRONT — AI insight */}
        <motion.div
          style={{ x: front.x, y: front.y }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-[6%] right-[14%] z-30"
        >
          <div style={{ transform: "rotate(1.5deg)" }}>
            <AIPanel />
          </div>
        </motion.div>

        {/* Floating KPI chips */}
        <FloatingKPI
          icon={TrendingUp}
          label="Economia gerada"
          value="R$ 128.450"
          trend="+12%"
          style={{ x: k1.x, y: k1.y, top: "2%", left: "8%" }}
        />
        <FloatingKPI
          icon={Clock}
          label="Lead time médio"
          value="4,2 dias"
          style={{ x: k2.x, y: k2.y, top: "42%", right: "-2%" }}
        />
        <FloatingKPI
          icon={Users}
          label="Fornecedores"
          value="286"
          trend="ativos"
          style={{ x: k3.x, y: k3.y, bottom: "8%", left: "-2%" }}
        />
      </motion.div>
    </motion.div>
  );
}

export default HeroComposition;
