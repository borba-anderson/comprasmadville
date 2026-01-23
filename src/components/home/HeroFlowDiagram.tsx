import { FileText, UserCheck, Search, ShieldCheck, Truck, Database } from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    {
      icon: FileText,
      title: "Solicitação",
      desc: "Registro da necessidade",
      color: "bg-blue-100 text-blue-600 border-blue-200",
    },
    {
      icon: UserCheck,
      title: "Validação",
      desc: "Revisão do gestor imediato",
      color: "bg-indigo-100 text-indigo-600 border-indigo-200",
    },
    {
      icon: Search,
      title: "Análise de Compras",
      desc: "Cotação e fornecedores",
      color: "bg-purple-100 text-purple-600 border-purple-200",
    },
    {
      icon: ShieldCheck,
      title: "Aprovação Final",
      desc: "Autorização da diretoria",
      color: "bg-amber-100 text-amber-600 border-amber-200",
    },
    {
      icon: Truck,
      title: "Atendimento",
      desc: "Aquisição e entrega",
      color: "bg-emerald-100 text-emerald-600 border-emerald-200",
    },
    {
      icon: Database,
      title: "Registro",
      desc: "Estoque e contabilidade",
      color: "bg-slate-100 text-slate-600 border-slate-200",
    },
  ];

  return (
    <div className="relative p-6 bg-card rounded-xl border shadow-sm w-full max-w-[320px]">
      {/* Linha conectora vertical */}
      <div className="absolute left-[2.85rem] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-100 via-purple-100 to-slate-100" />

      <div className="space-y-5 relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4 group">
            {/* Ícone */}
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-sm transition-transform duration-300 group-hover:scale-110 ${step.color} bg-white`}
            >
              <step.icon size={18} />
            </div>
            {/* Texto */}
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground leading-none mb-1 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-tight">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
