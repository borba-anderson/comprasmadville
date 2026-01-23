import { ClipboardList, Search, Calculator, CheckCircle2, ShoppingCart, PackageCheck, ArrowRight } from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    // Linha 1
    {
      id: "1",
      icon: ClipboardList,
      title: "Solicite",
      desc: "Preencha a necessidade.",
      style: "bg-gradient-to-br from-orange-400 to-orange-500 shadow-orange-300/50",
    },
    {
      id: "2",
      icon: Search,
      title: "Análise",
      desc: "Revisão técnica.",
      style: "bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-300/50",
    },
    {
      id: "3",
      icon: Calculator,
      title: "Cotação",
      desc: "Busca de preços.",
      style: "bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-300/50",
    },
    // Linha 2
    {
      id: "4",
      icon: CheckCircle2,
      title: "Aprovação",
      desc: "Validação da gestão.",
      style: "bg-gradient-to-br from-green-400 to-green-600 shadow-green-300/50",
    },
    {
      id: "5",
      icon: ShoppingCart,
      title: "Compra",
      desc: "Pedido emitido.",
      style: "bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-cyan-300/50",
    },
    {
      id: "6",
      icon: PackageCheck,
      title: "Entrega",
      desc: "Recebimento fiscal.",
      style: "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-300/50",
    },
  ];

  const ArrowH = () => (
    <div className="hidden md:flex items-center px-3 text-slate-200">
      <ArrowRight size={32} strokeWidth={3} />
    </div>
  );

  return (
    <div className="relative p-8 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 w-full max-w-2xl z-10">
      {/* === SVG DA SETA CURVA (SNAKE) === */}
      <svg
        className="absolute inset-0 w-full h-full z-0 hidden md:block pointer-events-none"
        viewBox="0 0 600 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="snake-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" /> {/* Roxo */}
            <stop offset="100%" stopColor="#22c55e" /> {/* Verde */}
          </linearGradient>
        </defs>

        {/* Caminho (Path) Ajustado:
           - M 520 70: Início movido mais para a direita.
           - C 620 70, 620 230...: Curva mais aberta (x=620) e descendo mais (y=230).
           - ... 520 230: Fim da curva mais baixo.
           - L 90 230: Linha reta de retorno mais baixa para não cortar o texto.
        */}
        <path
          d="M 520 70 C 620 70, 620 230, 520 230 L 90 230"
          stroke="url(#snake-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Ponta da Seta (Ajustada para a nova altura y=230) */}
        <path d="M 95 230 L 105 220 M 95 230 L 105 240" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
      </svg>

      <div className="flex flex-col gap-12 relative z-10">
        {/* === LINHA 1 (1 -> 2 -> 3) === */}
        <div className="flex items-start justify-between px-4">
          <StepItem step={steps[0]} />
          <ArrowH />
          <StepItem step={steps[1]} />
          <ArrowH />
          <StepItem step={steps[2]} />
        </div>

        {/* === LINHA 2 (4 -> 5 -> 6) === */}
        <div className="flex items-start justify-between pl-4 pr-4">
          <StepItem step={steps[3]} />
          <ArrowH />
          <StepItem step={steps[4]} />
          <ArrowH />
          <StepItem step={steps[5]} />
        </div>
      </div>
    </div>
  );
};

// Componente Item
const StepItem = ({ step }: { step: any }) => (
  <div className="flex flex-col items-center text-center group cursor-default relative w-28">
    <div
      className={`
      relative flex items-center justify-center 
      w-16 h-16 rounded-full text-white shadow-lg 
      transition-transform duration-300 group-hover:scale-105
      ${step.style}
    `}
    >
      <step.icon size={28} strokeWidth={2} />

      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-xs text-muted-foreground font-extrabold rounded-full flex items-center justify-center border shadow-sm z-20">
        {step.id}
      </div>
    </div>

    <div className="mt-4">
      <h3 className="font-bold text-sm text-foreground leading-tight">{step.title}</h3>
      <p className="text-xs text-muted-foreground leading-tight mt-1 px-1 font-medium">{step.desc}</p>
    </div>
  </div>
);
