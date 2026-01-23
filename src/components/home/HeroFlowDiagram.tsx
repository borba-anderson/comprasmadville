import { ClipboardList, Search, CheckCircle2, Calculator, ShoppingCart, PackageCheck, ArrowRight } from "lucide-react";

export const HeroFlowDiagram = () => {
  // Steps Detalhados (Dentro do Card)
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
    <div className="relative flex items-center justify-center lg:justify-end w-full max-w-5xl xl:pr-8">
      {/* === PARTE 1: ÍCONES FLUTUANTES (Esquerda - Fora do Card) === */}
      {/* Estes ícones representam o 'resumo' visual que flutua fora do card, conforme a imagem */}
      <div className="hidden xl:flex flex-col gap-14 mr-[-60px] z-30 relative top-8">
        {/* Flutuante 1: Laranja */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl shadow-orange-400/30 flex items-center justify-center text-white transform transition-transform group-hover:scale-105 border-[3px] border-white ring-4 ring-orange-100/50">
            <ClipboardList size={38} strokeWidth={2} />
          </div>
          {/* Seta Curva (Laranja -> Azul) */}
          <svg
            className="absolute top-[60%] left-[60%] w-32 h-32 -z-10 text-orange-300/60"
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
        <div className="relative group ml-12">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white transform transition-transform group-hover:scale-105 border-[3px] border-white ring-4 ring-blue-100/50">
            <Search size={44} strokeWidth={2} />
          </div>
          {/* Seta Curva (Azul -> Verde) */}
          <svg
            className="absolute top-[60%] left-[60%] w-32 h-32 -z-10 text-blue-300/60"
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl shadow-green-400/30 flex items-center justify-center text-white transform transition-transform group-hover:scale-105 border-[3px] border-white ring-4 ring-green-100/50">
            <CheckCircle2 size={38} strokeWidth={2} />
          </div>
          {/* Seta Curva (Verde -> Card) */}
          <svg
            className="absolute top-[40%] left-[80%] w-40 h-20 -z-10 text-green-300/60"
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

      {/* === PARTE 2: CARD BRANCO DETALHADO (Direita) === */}
      <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border border-slate-100/50 relative z-10 w-full max-w-3xl">
        {/* SVG de Conexão Linear (Cobra Colorida) dentro do Card */}
        <svg
          className="absolute top-0 left-0 w-full h-full z-0 hidden md:block pointer-events-none"
          viewBox="0 0 700 350"
          fill="none"
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" /> {/* Laranja */}
              <stop offset="30%" stopColor="#3b82f6" /> {/* Azul */}
              <stop offset="60%" stopColor="#a855f7" /> {/* Roxo */}
              <stop offset="100%" stopColor="#10b981" /> {/* Verde */}
            </linearGradient>
            <marker id="arrowhead-flow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="url(#line-gradient)" />
            </marker>
          </defs>

          {/* Caminho da Seta Sinuosa (Snake): Conecta 1->2->3, desce e volta para 4->5->6 */}
          {/* Esta linha simula o fluxo contínuo entre as duas linhas de ícones */}
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

        <div className="flex flex-col gap-16 relative z-10">
          {/* LINHA 1: 1 -> 2 -> 3 */}
          <div className="flex justify-between items-start gap-4 md:gap-8 px-4">
            {detailedSteps.slice(0, 3).map((step, idx) => (
              <DetailedStep key={step.id} step={step} showArrow={idx < 2} />
            ))}
          </div>

          {/* LINHA 2: 4 -> 5 -> 6 */}
          <div className="flex justify-between items-start gap-4 md:gap-8 px-4 md:pl-12">
            {detailedSteps.slice(3, 6).map((step, idx) => (
              <DetailedStep key={step.id} step={step} showArrow={idx < 2} isBottomRow />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-componente para os itens do Card
const DetailedStep = ({ step, showArrow, isBottomRow }: { step: any; showArrow: boolean; isBottomRow?: boolean }) => (
  <div className="flex items-center flex-1 last:flex-none group relative">
    <div className="flex flex-col items-center text-center w-28 md:w-36 relative z-10">
      {/* Círculo do Ícone */}
      <div
        className={`
        w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white mb-4
        bg-gradient-to-br ${step.color} shadow-lg ${step.shadow} transform transition-transform group-hover:scale-110
      `}
      >
        <step.icon size={24} strokeWidth={2.5} />
      </div>

      {/* Número Badge */}
      <div className="absolute -top-1 right-6 md:right-8 bg-white text-xs font-extrabold text-slate-500 w-6 h-6 rounded-full flex items-center justify-center border border-slate-200 shadow-sm z-20">
        {step.id}
      </div>

      {/* Textos */}
      <h4 className="text-sm md:text-base font-bold text-slate-900 mb-1.5">{step.title}</h4>
      <p className="text-xs md:text-sm text-slate-500 font-medium leading-snug px-1">{step.desc}</p>
    </div>
  </div>
);
