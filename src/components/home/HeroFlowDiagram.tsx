import {
  ClipboardList,
  Search,
  Calculator,
  CheckCircle2,
  ShoppingCart,
  PackageCheck,
  ArrowRight,
  CornerRightDown,
} from "lucide-react";

export const HeroFlowDiagram = () => {
  const steps = [
    {
      id: "1",
      icon: ClipboardList,
      title: "Solicite",
      desc: "Preencha a necessidade.",
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

  const renderStep = (step: any) => (
    <div className="flex flex-col items-center text-center group relative z-10 w-24">
      {/* Ícone Redondo com Efeito Glow */}
      <div
        className={`relative flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${step.style}`}
      >
        <step.icon size={20} strokeWidth={2.5} />
        {/* Badge numérico */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[10px] text-muted-foreground font-bold rounded-full flex items-center justify-center border shadow-sm">
          {step.id}
        </div>
      </div>
      {/* Texto */}
      <div className="mt-2">
        <h3 className="font-bold text-xs text-foreground leading-tight">{step.title}</h3>
        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{step.desc}</p>
      </div>
    </div>
  );

  const Arrow = () => (
    <div className="pt-4 text-muted-foreground/30">
      <ArrowRight size={18} strokeWidth={3} />
    </div>
  );

  return (
    // Container mais largo (max-w-xl) para acomodar 3 itens
    <div className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-xl">
      <div className="flex flex-col gap-6">
        {/* LINHA 1: Passos 1, 2, 3 */}
        <div className="flex items-start justify-between relative">
          {renderStep(steps[0])}
          <Arrow />
          {renderStep(steps[1])}
          <Arrow />
          {renderStep(steps[2])}
        </div>

        {/* LINHA 2: Passos 4, 5, 6 */}
        <div className="flex items-start justify-between relative">
          {renderStep(steps[3])}
          <Arrow />
          {renderStep(steps[4])}
          <Arrow />
          {renderStep(steps[5])}
        </div>

        {/* Conector Visual Opcional: Curva do 3 para o 4 */}
        <div className="absolute right-8 top-[3.5rem] text-muted-foreground/10 hidden md:block">
          <CornerRightDown size={40} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};
