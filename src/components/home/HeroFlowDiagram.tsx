import {
  ClipboardList,
  Search,
  Calculator,
  CheckCircle2,
  ShoppingCart,
  PackageCheck,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    {
      id: "1",
      icon: ClipboardList,
      title: "Solicite",
      desc: "Preencha a necessidade.",
      // Gradientes modernos e sombras coloridas
      style: "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-200",
    },
    {
      id: "2",
      icon: Search,
      title: "Análise",
      desc: "Revisão técnica.",
      style: "bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200",
    },
    {
      id: "3",
      icon: Calculator,
      title: "Cotação",
      desc: "Busca de preços.",
      style: "bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-200",
    },
    {
      id: "4",
      icon: CheckCircle2,
      title: "Aprovação",
      desc: "Validação da gestão.",
      style: "bg-gradient-to-br from-green-400 to-green-600 shadow-green-200",
    },
    {
      id: "5",
      icon: ShoppingCart,
      title: "Compra",
      desc: "Pedido emitido.",
      style: "bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-cyan-200",
    },
    {
      id: "6",
      icon: PackageCheck,
      title: "Entrega",
      desc: "Recebimento fiscal.",
      style: "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200",
    },
  ];

  // Função auxiliar para renderizar um único nó (step)
  const renderStep = (step: any) => (
    <div className="flex flex-col items-center text-center group cursor-default relative z-10">
      {/* Ícone Redondo Moderno com "Glow" */}
      <div
        className={`relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${step.style}`}
      >
        <step.icon size={24} strokeWidth={2} />
        {/* Pequeno número indicador */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-xs text-muted-foreground font-bold rounded-full flex items-center justify-center border shadow-sm">
          {step.id}
        </div>
      </div>
      {/* Texto */}
      <div className="mt-3">
        <h3 className="font-bold text-sm text-foreground leading-tight">{step.title}</h3>
        <p className="text-[11px] text-muted-foreground leading-tight">{step.desc}</p>
      </div>
    </div>
  );

  return (
    // Container com fundo estilo "vidro" (glassmorphism) sutil
    <div className="p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[400px]">
      <div className="flex flex-col gap-4 relative">
        {/* Linha 1: Par 1 -> Par 2 */}
        <div className="flex items-start justify-between relative">
          {renderStep(steps[0])}
          {/* Seta Horizontal */}
          <div className="pt-5 text-muted-foreground/40 animate-pulse">
            <ArrowRight size={24} strokeWidth={3} />
          </div>
          {renderStep(steps[1])}
        </div>

        {/* Conector Vertical entre linhas */}
        <div className="flex justify-center -my-2 text-muted-foreground/30 z-0">
          <ArrowDown size={20} strokeWidth={3} />
        </div>

        {/* Linha 2: Par 3 -> Par 4 */}
        <div className="flex items-start justify-between relative">
          {renderStep(steps[2])}
          <div className="pt-5 text-muted-foreground/40 animate-pulse">
            <ArrowRight size={24} strokeWidth={3} />
          </div>
          {renderStep(steps[3])}
        </div>

        {/* Conector Vertical entre linhas */}
        <div className="flex justify-center -my-2 text-muted-foreground/30 z-0">
          <ArrowDown size={20} strokeWidth={3} />
        </div>

        {/* Linha 3: Par 5 -> Par 6 */}
        <div className="flex items-start justify-between relative">
          {renderStep(steps[4])}
          <div className="pt-5 text-muted-foreground/40 animate-pulse">
            <ArrowRight size={24} strokeWidth={3} />
          </div>
          {renderStep(steps[5])}
        </div>
      </div>
    </div>
  );
};
