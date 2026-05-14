import { LucideIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type Severity = "low" | "medium" | "high";

interface DecisionKPIProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number; // %
  deltaInverted?: boolean; // when true, negative delta is good (e.g. delays)
  impact?: string; // e.g. "R$ 12,4k em risco"
  severity?: Severity;
  spark?: number[]; // 5-10 numbers
  hint?: string;
  onClick?: () => void;
}

function Sparkline({ data, severity }: { data: number[]; severity: Severity }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 22;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  const color =
    severity === "high"
      ? "hsl(var(--sev-high))"
      : severity === "medium"
        ? "hsl(var(--sev-medium))"
        : "hsl(var(--primary))";
  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function DecisionKPI({
  label,
  value,
  icon: Icon,
  delta,
  deltaInverted,
  impact,
  severity = "low",
  spark,
  hint,
  onClick,
}: DecisionKPIProps) {
  const sevTextBg: Record<Severity, string> = {
    low: "text-emerald-700 bg-emerald-50",
    medium: "text-amber-700 bg-amber-50",
    high: "text-red-600 bg-red-50",
  };

  const renderDelta = () => {
    if (delta === undefined || delta === 0) return null;
    const isGood = deltaInverted ? delta < 0 : delta > 0;
    const Arrow = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold tabular-nums",
          isGood ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600",
        )}
      >
        <Arrow className="w-3 h-3" />
        {delta > 0 ? "+" : ""}
        {delta.toFixed(1)}%
      </span>
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden text-left card-elevated p-4 w-full",
        "hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
      )}
    >
      <span className={cn("sev-bar", `sev-bar-${severity}`)} />

      <div className="flex items-start justify-between mb-3 pl-1">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", sevTextBg[severity])}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1.5">
          {renderDelta()}
        </div>
      </div>

      <div className="pl-1">
        <div className="num-tabular text-[26px] font-semibold leading-none text-slate-900">
          {value}
        </div>
        <div className="mt-1.5 text-[12px] font-medium text-slate-700">{label}</div>

        <div className="mt-2 flex items-end justify-between gap-2 min-h-[22px]">
          <div className="flex-1 min-w-0">
            {impact && (
              <div className="text-[11px] font-medium text-slate-500 truncate">
                {impact}
              </div>
            )}
            {!impact && hint && (
              <div className="text-[11px] text-slate-400 truncate">{hint}</div>
            )}
          </div>
          {spark && spark.length > 1 && <Sparkline data={spark} severity={severity} />}
        </div>
      </div>
    </button>
  );
}
