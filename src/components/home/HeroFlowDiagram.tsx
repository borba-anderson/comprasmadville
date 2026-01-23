import { FileText, UserCheck, Search, ShieldCheck, Truck, Database } from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    {
      icon: FileText,
      title: "Solicitação",
      desc: "Registro da necessidade.",
      iconTheme: "bg-blue-100/80 text-blue-700 border-blue-200",
      hoverText: "group-hover:text-blue-700",
    },
    {
      icon: UserCheck,
      title: "Validação",
      desc: "Revisão do gestor.",
      iconTheme: "bg-indigo-100/80 text-indigo-700 border-indigo-200",
      hoverText: "group-hover:text-indigo-700",
    },
    {
      icon: Search,
      title: "Análise",
      desc: "Cotação e fornecedores.",
      iconTheme: "bg-purple-100/80 text-purple-700 border-purple-200",
      hoverText: "group-hover:text-purple-700",
    },
    {
      icon: ShieldCheck,
      title: "Aprovação",
      desc: "Autorização final.",
      iconTheme: "bg-amber-100/80 text-amber-700 border-amber-200",
      hoverText: "group-hover:text-amber-700",
    },
    {
      icon: Truck,
      title: "Atendimento",
      desc: "Aquisição e entrega.",
      iconTheme: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
      hoverText: "group-hover:text-emerald-700",
    },
    {
      icon: Database,
      title: "Registro",
      desc: "Estoque e fiscal.",
      iconTheme: "bg-slate-100/80 text-slate-700 border-slate-200",
      hoverText: "group-hover:text-slate-700",
    },
  ];

  return (
    // Reduzi o padding para p-5 e limitei a largura para ficar mais 'tight'
    <div className="relative p-5 rounded-2xl w-full max-w-[340px] bg-white/50 border border-slate-100 shadow-sm backdrop-blur-sm">
      {/* Linha conectora vertical - Recalculada para ícones w-10 */}
      {/* Container p-5 (1.25rem) + Metade do ícone w-10 (1.25rem) = 2.5rem de distância da esquerda */}
      <div className="absolute left-[2.5rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-slate-200 opacity-60 rounded-full" />

      {/* Reduzi o espaçamento vertical entre itens de space-y-7 para space-y-3 */}
      <div className="space-y-3 relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4 group">
            {/* Ícone - Reduzido para w-10 h-10 (40px) */}
            <div
              className={`relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg border shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${step.iconTheme} bg-white`}
            >
              <step.icon size={18} strokeWidth={2} />
            </div>

            {/* Texto */}
            <div className="flex-1">
              <h3
                className={`font-semibold text-sm text-foreground leading-none mb-1 transition-colors duration-300 ${step.hoverText}`}
              >
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-tight">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
