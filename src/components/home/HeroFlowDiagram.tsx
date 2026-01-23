// src/components/home/HeroFlowDiagram.tsx
import { ClipboardList, Search, CheckCircle2, Calculator, ShoppingCart, PackageCheck, ArrowRight } from "lucide-react";

export const HeroFlowDiagram = () => {
  const detailedSteps = [
    {
      id: "1",
      icon: ClipboardList,
      title: "Solicite",
      desc: "Preencha a necessidade.",
      color: "from-orange-400 to-orange-500",
      shadow: "shadow-orange-300/40",
    },
    {
      id: "2",
      icon: Search,
      title: "Análise",
      desc: "Revisão técnica.",
      color: "from-blue-400 to-blue-600",
      shadow: "shadow-blue-300/40",
    },
    {
      id: "3",
      icon: Calculator,
      title: "Cotação",
      desc: "Busca de preços.",
      color: "from-purple-400 to-purple-600",
      shadow: "shadow-purple-300/40",
    },
    {
      id: "4",
      icon: CheckCircle2,
      title: "Aprovação",
      desc: "Validação da gestão.",
      color: "from-green-400 to-green-600",
      shadow: "shadow-green-300/40",
    },
    {
      id: "5",
      icon: ShoppingCart,
      title: "Compra",
      desc: "Pedido emitido.",
      color: "from-cyan-400 to-cyan-600",
      shadow: "shadow-cyan-300/40",
    },
    {
      id: "6",
      icon: PackageCheck,
      title: "Entrega",
      desc: "Recebimento fiscal.",
      color: "from-emerald-400 to-emerald-600",
      shadow: "shadow-emerald-300/40",
    },
  ];

  return (
    // Container principal com largura máxima reduzida (max-w-4xl)
    <div className="relative flex items-center justify-center lg:justify-end w-full max-w-4xl xl:pr-4">
      {/* === PARTE 1: ÍCONES FLUTUANTES (Esquerda) - TAMANHOS REDUZIDOS === */}
      <div className="hidden xl:flex flex-col gap-10 mr-[-50px] z-30 relative top-6">
        {/* Flutuante 1: Laranja */}
        <div className="relative group">
          {/* Reduzido de w-24 h-24 para w-20 h-20, ícone de 38 para 32 */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl shadow-orange-400/30 flex items-center justify-center text-white transform transition-transform group-hover:scale-105 border-[3px] border-white ring-4 ring-orange-100/50">
            <ClipboardList size={32} strokeWidth={2} />
          </div>
          <svg
            className="absolute top-[60%] left-[60%] w-28 h-28 -z-10 text-orange-300/60"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M 10 10 Q 50 30 80 80"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrowhead-orange)"
            />
            <defs>
              <marker id="arrowhead-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Flutuante 2: Azul */}
        <div className="relative group ml-10">
          {/* Reduzido de w-28 h-28 para w-24 h-24, ícone de 44 para 38 */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white transform transition-transform group-hover:scale-105 border-[3px] border-white ring-4 ring-blue-100/50">
            <Search size={38} strokeWidth={2} />
          </div>
          <svg
            className="absolute top-[60%] left-[60%] w-28 h-28 -z-10 text-blue-300/60"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M 10 10 Q 30 50 60 80"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrowhead-blue)"
            />
            <defs>
              <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Flutuante 3: Verde */}
        <div className="relative group">
          {/* Reduzido de w-24 h-24 para w-20 h-20, ícone de 38 para 32 */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl shadow-green-400/30 flex items-center justify-center text-white transform transition-transform group-hover:scale-105 border-[3px] border-white ring-4 ring-green-100/50">
            <CheckCircle2 size={32} strokeWidth={2} />
          </div>
          <svg
            className="absolute top-[40%] left-[80%] w-36 h-16 -z-10 text-green-300/60"
            viewBox="0 0 150 100"
            fill="none"
          >
            <path
              d="M 10 50 Q 80 50 130 20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrowhead-green)"
            />
            <defs>
              <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* === PARTE 2: CARD BRANCO DETALHADO (Direita) - TAMANHOS REDUZIDOS === */}
      {/* Padding reduzido de p-8 md:p-10 para p-6 md:p-8 */}
      <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-slate-100/50 relative z-10 w-full max-w-2xl">
        <svg
          className="absolute top-0 left-0 w-full h-full z-0 hidden md:block pointer-events-none"
          viewBox="0 0 700 350"
          fill="none"
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="30%" stopColor="#3b82f6" />
              <stop offset="60%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <marker id="arrowhead-flow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="url(#line-gradient)" />
            </marker>
          </defs>
          <path
            d="M 90 100 L 610 100 C 660 100, 660 250, 610 250 L 90 250"
            stroke="url(#line-gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="opacity-60"
            markerEnd="url(#arrowhead-flow)"
          />
        </svg>

        {/* Gap reduzido de gap-16 para gap-12 */}
        <div className="flex flex-col gap-12 relative z-10">
          <div className="flex justify-between items-start gap-3 md:gap-6 px-2">
            {detailedSteps.slice(0, 3).map((step, idx) => (
              <DetailedStep key={step.id} step={step} showArrow={idx < 2} />
            ))}
          </div>

          <div className="flex justify-between items-start gap-3 md:gap-6 px-2 md:pl-10">
            {detailedSteps.slice(3, 6).map((step, idx) => (
              <DetailedStep key={step.id} step={step} showArrow={idx < 2} isBottomRow />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-componente DetailedStep - TAMANHOS REDUZIDOS
const DetailedStep = ({ step, showArrow, isBottomRow }: { step: any; showArrow: boolean; isBottomRow?: boolean }) => (
  <div className="flex items-center flex-1 last:flex-none group relative">
    {/* Largura do item reduzida */}
    <div className="flex flex-col items-center text-center w-24 md:w-32 relative z-10">
      {/* Círculo do Ícone: Reduzido de w-14 h-14 para w-12 h-12, ícone de 24 para 20 */}
      <div
        className={`
        w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white mb-3
        bg-gradient-to-br ${step.color} shadow-md ${step.shadow} transform transition-transform group-hover:scale-110
      `}
      >
        <step.icon size={20} strokeWidth={2.5} />
      </div>

      <div className="absolute -top-1 right-5 md:right-7 bg-white text-[10px] font-extrabold text-slate-500 w-5 h-5 rounded-full flex items-center justify-center border border-slate-200 shadow-sm z-20">
        {step.id}
      </div>

      {/* Textos: Tamanhos de fonte reduzidos */}
      <h4 className="text-xs md:text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
      <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-tight px-1">{step.desc}</p>
    </div>
  </div>
);
