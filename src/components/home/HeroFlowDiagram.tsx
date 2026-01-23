import { FileText, UserCheck, Search, ShieldCheck, Truck, Database } from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    {
      icon: FileText,
      title: "Solicitação",
      desc: "Registro inicial da necessidade de compra.",
      // Usando cores de fundo mais sutis (bg-opacity) e bordas mais definidas
      iconTheme: "bg-blue-100/80 text-blue-700 border-blue-200",
      hoverText: "group-hover:text-blue-700",
    },
    {
      icon: UserCheck,
      title: "Validação",
      desc: "Revisão e aval do gestor imediato.",
      iconTheme: "bg-indigo-100/80 text-indigo-700 border-indigo-200",
      hoverText: "group-hover:text-indigo-700",
    },
    {
      icon: Search,
      title: "Análise de Compras",
      desc: "Cotação de preços e seleção de fornecedores.",
      iconTheme: "bg-purple-100/80 text-purple-700 border-purple-200",
      hoverText: "group-hover:text-purple-700",
    },
    {
      icon: ShieldCheck,
      title: "Aprovação Final",
      desc: "Autorização financeira ou da diretoria.",
      iconTheme: "bg-amber-100/80 text-amber-700 border-amber-200",
      hoverText: "group-hover:text-amber-700",
    },
    {
      icon: Truck,
      title: "Atendimento",
      desc: "Emissão do pedido, aquisição e entrega.",
      iconTheme: "bg-emerald-100/80 text-emerald-700 border-emerald-200",
      hoverText: "group-hover:text-emerald-700",
    },
    {
      icon: Database,
      title: "Registro",
      desc: "Entrada em estoque e conciliação fiscal.",
      iconTheme: "bg-slate-100/80 text-slate-700 border-slate-200",
      hoverText: "group-hover:text-slate-700",
    },
  ];

  return (
    // Removida a borda e sombra pesada. Aumentada a largura máxima.
    // Adicionado um fundo sutil com gradiente para dar profundidade sem pesar.
    <div className="relative p-6 rounded-2xl w-full max-w-md bg-gradient-to-br from-white/50 to-slate-50/50 backdrop-blur-sm border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Linha conectora vertical - Ajustada para ficar perfeitamente centralizada e mais sutil */}
      {/* O 'left-[2.25rem]' alinha com o centro do ícone de w-12 (1.5rem + padding) */}
      <div className="absolute left-[2.25rem] top-10 bottom-12 w-0.5 bg-gradient-to-b from-blue-200 via-purple-300 to-slate-200 opacity-70 rounded-full" />

      <div className="space-y-7 relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-5 group">
            {/* Ícone - Aumentado ligeiramente (w-12 h-12) para mais presença */}
            <div
              className={`relative z-10 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${step.iconTheme} bg-white`}
            >
              <step.icon size={22} strokeWidth={1.8} />
            </div>

            {/* Texto */}
            <div className="flex-1 pt-1.5">
              <h3
                className={`font-bold text-base text-foreground leading-none mb-2 transition-colors duration-300 ${step.hoverText}`}
              >
                {step.title}
              </h3>
              {/* Aumentado o tamanho da fonte da descrição para melhor leitura */}
              <p className="text-sm text-muted-foreground leading-snug pr-4">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
