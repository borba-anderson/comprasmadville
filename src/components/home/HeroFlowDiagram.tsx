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
    <div className="relative flex items-center justify-center lg:justify-end w-full max-w-4xl">
      {/* === PARTE 1: ÍCONES FLUTUANTES (Esquerda - Fora do Card) === */}
      <div className="hidden xl:flex flex-col gap-12 mr-[-40px] z-20 relative">
        {/* Flutuante 1: Laranja */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-xl shadow-orange-300/40 flex items-center justify-center text-white transform transition-transform group-hover:scale-110">
            <ClipboardList size={32} strokeWidth={2.5} />
          </div>
          {/* Seta Curva conectando ao próximo */}
          <svg
            className="absolute top-1/2 left-1/2 w-24 h-24 -z-10 text-slate-300"
            style={{ transform: "translate(10px, 10px)" }}
          >
            <path d="M 0 0 Q 40 10 40 60" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Flutuante 2: Azul */}
        <div className="relative group ml-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-400/40 flex items-center justify-center text-white transform transition-transform group-hover:scale-110 border-4 border-white">
            <Search size={40} strokeWidth={2.5} />
          </div>
          {/* Seta Curva conectando ao próximo */}
          <svg
            className="absolute top-1/2 left-1/2 w-24 h-24 -z-10 text-slate-300"
            style={{ transform: "translate(-20px, 20px) scaleX(-1)" }}
          >
            <path d="M 0 0 Q 40 10 40 60" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Flutuante 3: Verde */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl shadow-green-300/40 flex items-center justify-center text-white transform transition-transform group-hover:scale-110">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* === PARTE 2: CARD BRANCO DETALHADO (Direita) === */}
      <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-slate-200/60 border border-white relative z-10 w-full max-w-2xl">
        {/* SVG de Conexão Linear (Cobra) */}
        <svg
          className="absolute top-0 left-0 w-full h-full z-0 hidden md:block pointer-events-none"
          viewBox="0 0 600 300"
          fill="none"
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb923c" /> {/* Laranja */}
              <stop offset="50%" stopColor="#a855f7" /> {/* Roxo */}
              <stop offset="100%" stopColor="#10b981" /> {/* Verde */}
            </linearGradient>
          </defs>

          {/* Linha 1 (Direita) -> Curva -> Linha 2 (Esquerda) */}
          <path
            d="M 80 85 L 520 85 C 570 85, 570 215, 520 215 L 80 215"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            className="opacity-40"
          />
        </svg>

        <div className="flex flex-col gap-12 relative z-10">
          {/* LINHA 1: 1 -> 2 -> 3 */}
          <div className="flex justify-between items-start gap-2 md:gap-4">
            {detailedSteps.slice(0, 3).map((step, idx) => (
              <DetailedStep key={step.id} step={step} showArrow={idx < 2} />
            ))}
          </div>

          {/* LINHA 2: 6 <- 5 <- 4 (Visualmente invertido na ordem do array para alinhar com o fluxo da 'cobra') 
              Na verdade, queremos renderizar 4 -> 5 -> 6 visualmente, mas o SVG conecta 3 ao 6? 
              Não, o fluxo é: 1->2->3 (Curva) 4->5->6. Vamos manter a ordem lógica visual.
          */}
          <div className="flex justify-between items-start gap-2 md:gap-4 pl-0 md:pl-0">
            {/* Renderizando 4, 5, 6 */}
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
  <div className="flex items-center flex-1 last:flex-none">
    <div className="flex flex-col items-center text-center w-24 md:w-32 relative">
      {/* Círculo do Ícone */}
      <div
        className={`
        w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-md mb-3
        bg-gradient-to-br ${step.color}
      `}
      >
        <step.icon size={20} strokeWidth={2.5} />
      </div>

      {/* Número Badge */}
      <div className="absolute top-0 right-6 md:right-8 bg-white text-[10px] font-bold text-slate-400 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm">
        {step.id}
      </div>

      {/* Textos */}
      <h4 className="text-xs md:text-sm font-bold text-slate-800 mb-1">{step.title}</h4>
      <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-tight px-1">{step.desc}</p>
    </div>

    {/* Setinha simples entre os itens (apenas mobile/tablet onde o SVG grande não aparece bem, ou para reforçar) */}
    {showArrow && (
      <div className="hidden md:flex flex-1 justify-center -mt-8 text-slate-200">
        <ArrowRight size={20} strokeWidth={3} className="opacity-50" />
      </div>
    )}
  </div>
);
