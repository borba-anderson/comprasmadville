import { ClipboardList, Search, CheckCircle2, Calculator, ShoppingCart, PackageCheck, ArrowRight } from "lucide-react";

export const HeroFlowDiagram = () => {
  // Dados dos passos dentro do card
  const steps = [
    {
      id: "1",
      icon: ClipboardList,
      title: "Solicite",
      desc: "Preencha a necessidade.",
      color: "from-orange-400 to-orange-500",
    },
    { id: "2", icon: Search, title: "Análise", desc: "Revisão técnica.", color: "from-blue-400 to-blue-600" },
    { id: "3", icon: Calculator, title: "Cotação", desc: "Busca de preços.", color: "from-purple-400 to-purple-600" },
    {
      id: "4",
      icon: CheckCircle2,
      title: "Aprovação",
      desc: "Validação da gestão.",
      color: "from-green-400 to-green-600",
    },
    { id: "5", icon: ShoppingCart, title: "Compra", desc: "Pedido emitido.", color: "from-cyan-400 to-cyan-600" },
    {
      id: "6",
      icon: PackageCheck,
      title: "Entrega",
      desc: "Recebimento fiscal.",
      color: "from-emerald-400 to-emerald-600",
    },
  ];

  return (
    <div className="relative w-full py-8 md:py-0">
      {/* CARD PRINCIPAL (Branco) 
          Posicionado à direita, ocupa a maior parte da largura
      */}
      <div className="relative z-10 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-8 md:p-10 ml-auto w-[90%] md:w-[85%]">
        {/* Linha de Conexão (Snake) no fundo do Card */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem]">
          <svg className="w-full h-full" viewBox="0 0 800 350" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Caminho ajustado para passar pelo meio das linhas */}
            <path
              d="M 100 80 L 700 80 C 750 80, 750 240, 700 240 L 100 240"
              stroke="url(#flow-gradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-16">
          {/* LINHA 1: Passos 1, 2, 3 */}
          <div className="flex justify-between">
            {steps.slice(0, 3).map((step, i) => (
              <CardStep key={step.id} step={step} showArrow={i < 2} />
            ))}
          </div>

          {/* LINHA 2: Passos 4, 5, 6 */}
          <div className="flex justify-between">
            {steps.slice(3, 6).map((step, i) => (
              <CardStep key={step.id} step={step} showArrow={i < 2} />
            ))}
          </div>
        </div>
      </div>

      {/* ÍCONES FLUTUANTES (Esquerda)
          Posicionados absolutamente em relação ao container pai para criar o efeito de sobreposição/conexão 
          Exibidos apenas em telas grandes (lg) para manter a limpeza no mobile.
      */}
      <div className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none z-20">
        {/* ÍCONE 1: LARANJA (Topo Esquerda) */}
        <div className="absolute top-[5%] left-0 animate-bounce-slow">
          <FloatingIcon
            icon={ClipboardList}
            color="bg-orange-500"
            shadow="shadow-orange-500/40"
            ring="ring-orange-100"
          />
          {/* Seta conectando ao Card */}
          <svg
            className="absolute top-1/2 left-1/2 w-32 h-20 -z-10 text-orange-300"
            style={{ transform: "translate(20px, 10px)" }}
          >
            <path d="M 0 0 Q 60 10 90 40" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="6 4" />
            <polygon points="90 40, 80 35, 88 30" fill="currentColor" transform="rotate(45 90 40)" />
          </svg>
        </div>

        {/* ÍCONE 2: AZUL (Meio Esquerda - "Zoom") */}
        <div className="absolute top-[40%] left-[5%] animate-bounce-slow" style={{ animationDelay: "1s" }}>
          <FloatingIcon
            icon={Search}
            color="bg-blue-600"
            shadow="shadow-blue-600/40"
            ring="ring-blue-100"
            size="large" // Maior destaque
          />
          {/* Seta conectando ao Card */}
          <svg
            className="absolute top-1/2 left-1/2 w-24 h-24 -z-10 text-blue-300"
            style={{ transform: "translate(30px, -10px)" }}
          >
            <path d="M 0 0 Q 40 0 70 -20" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="6 4" />
          </svg>
        </div>

        {/* ÍCONE 3: VERDE (Baixo Esquerda) */}
        <div className="absolute bottom-[5%] left-[2%] animate-bounce-slow" style={{ animationDelay: "2s" }}>
          <FloatingIcon icon={CheckCircle2} color="bg-green-500" shadow="shadow-green-500/40" ring="ring-green-100" />
          {/* Seta conectando ao Card */}
          <svg
            className="absolute top-1/2 left-1/2 w-40 h-24 -z-10 text-green-300"
            style={{ transform: "translate(20px, -40px)" }}
          >
            <path d="M 0 0 Q 50 10 100 -30" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="6 4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Componente para os ícones dentro do Card
const CardStep = ({ step, showArrow }: { step: any; showArrow: boolean }) => (
  <div className="flex flex-1 items-center last:flex-none">
    <div className="flex flex-col items-center text-center w-28 md:w-32 mx-auto relative group cursor-default">
      {/* Círculo do Ícone */}
      <div
        className={`
        w-14 h-14 rounded-full flex items-center justify-center text-white mb-3 shadow-md
        bg-gradient-to-br ${step.color} transition-transform duration-300 group-hover:scale-110
      `}
      >
        <step.icon size={22} strokeWidth={2.5} />
      </div>

      {/* Badge Número */}
      <div className="absolute -top-1 -right-1 bg-white text-[10px] font-bold text-slate-400 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm">
        {step.id}
      </div>

      <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
      <p className="text-[11px] text-slate-500 font-medium leading-tight px-1 mt-1">{step.desc}</p>
    </div>

    {/* Seta entre os passos */}
    {showArrow && (
      <div className="hidden md:flex flex-1 justify-center text-slate-300 -mt-6">
        <ArrowRight size={18} />
      </div>
    )}
  </div>
);

// Componente para os ícones flutuantes
const FloatingIcon = ({ icon: Icon, color, shadow, ring, size = "normal" }: any) => {
  const isLarge = size === "large";
  return (
    <div
      className={`
      rounded-full flex items-center justify-center text-white border-4 border-white ${color} ${shadow} ${ring} ring-4
      ${isLarge ? "w-24 h-24" : "w-20 h-20"}
      shadow-2xl transition-transform hover:scale-105
    `}
    >
      <Icon size={isLarge ? 40 : 32} strokeWidth={2.5} />
    </div>
  );
};
