import { Sparkles, AlertTriangle, TrendingUp, Activity, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type InsightVariant = "risk" | "opportunity" | "trend" | "anomaly" | "neutral";

interface AIInsightInlineProps {
  text: string;
  variant?: InsightVariant;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

const VARIANT_CFG: Record<InsightVariant, { icon: any; ring: string; iconBg: string; dot: string }> = {
  risk: {
    icon: AlertTriangle,
    ring: "border-red-200/70 bg-gradient-to-r from-red-50/60 to-transparent",
    iconBg: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
  opportunity: {
    icon: TrendingUp,
    ring: "border-emerald-200/70 bg-gradient-to-r from-emerald-50/60 to-transparent",
    iconBg: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  trend: {
    icon: Activity,
    ring: "border-blue-200/70 bg-gradient-to-r from-blue-50/60 to-transparent",
    iconBg: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  anomaly: {
    icon: Sparkles,
    ring: "border-violet-200/70 bg-gradient-to-r from-violet-50/60 to-transparent",
    iconBg: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
  },
  neutral: {
    icon: Sparkles,
    ring: "border-slate-200/70 bg-gradient-to-r from-slate-50/60 to-transparent",
    iconBg: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

export function AIInsightInline({
  text,
  variant = "neutral",
  actionLabel,
  onAction,
  compact,
}: AIInsightInlineProps) {
  const cfg = VARIANT_CFG[variant];
  const Icon = cfg.icon;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
        cfg.ring,
        compact && "py-2",
      )}
    >
      <div className="relative flex-shrink-0">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", cfg.iconBg)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className={cn("absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-2 ring-white", cfg.dot)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="eyebrow text-[9px] tracking-[0.1em]">IA · Insight</span>
        </div>
        <p className="text-[12.5px] text-slate-700 leading-snug">{text}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex-shrink-0 inline-flex items-center gap-1 text-[11.5px] font-semibold text-slate-700 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-white/80 transition-colors"
        >
          {actionLabel}
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
