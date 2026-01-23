import { ClipboardList, Search, CheckCircle2, Calculator, ShoppingCart, PackageCheck, ArrowRight } from "lucide-react";

export const HeroFlowDiagram = () => {
  // Dados dos passos
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
    // Container reduzido e alinhado
    <div className="relative flex items-center justify-end w-full max-w-[850px] mx-auto lg:mr-0 scale-90 sm:scale-100">
      {/* === ÍCONES FLUTUANTES (Lateral Esquerda) === */}
      <div className="hidden lg:flex flex-col gap-6 absolute left-[-60px] top-[10%] z-20">
        {/* Laranja (Aponta para linha 1) */}
        <div className="relative group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20 flex items-center justify-center text-white border-[3px] border-white transform transition-transform group-hover:scale-105">
            <ClipboardList size={28} strokeWidth={2.5} />
          </div>
          {/* Seta para o Card */}
          <svg
            className="absolute top-1/2 left-full w-16 h-12 -z-10 text-orange-300"
            viewBox="0 0 60 40"
            fill="none"
            style={{ transform: "translate(-5px, -15px)" }}
          >
            <path
              d="M 0 20 Q 30 20 50 10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrow-orange)"
            />
            <defs>
              <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Azul (Maior - Central) */}
        <div className="relative group ml-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border-[4px] border-white transform transition-transform group-hover:scale-105">
            <Search size={36} strokeWidth={2.5} />
          </div>
          {/* Seta curva descendo para linha 2 */}
          <svg
            className="absolute top-full left-1/2 w-12 h-16 -z-10 text-blue-300"
            viewBox="0 0 40 60"
            fill="none"
            style={{ transform: "translate(-10px, -5px)" }}
          >
            <path
              d="M 20 0 Q 20 30 0 50"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrow-blue)"
            />
            <defs>
              <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Verde (Aponta para linha 2) */}
        <div className="relative group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/20 flex items-center justify-center text-white border-[3px] border-white transform transition-transform group-hover:scale-105">
            <CheckCircle2 size={28} strokeWidth={2.5} />
          </div>
          {/* Seta para o Card */}
          <svg
            className="absolute top-1/2 left-full w-20 h-8 -z-10 text-green-300"
            viewBox="0 0 80 30"
            fill="none"
            style={{ transform: "translate(-5px, 0)" }}
          >
            <path
              d="M 0 15 L 70 15"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 2"
              markerEnd="url(#arrow-green)"
            />
            <defs>
              <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* === CARD PRINCIPAL === */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 shadow-2xl shadow-slate-200/50 border border-slate-100 z-10 w-full max-w-[680px]">
        {/* SVG CONECTOR (Retorno 3->4) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
          viewBox="0 0 680 300"
          fill="none"
        >
          <defs>
            <linearGradient id="return-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <marker id="arrow-return" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="#22c55e" />
            </marker>
          </defs>

          {/* Linha pontilhada: Sai do item 3, desce e volta para o 4 */}
          <path
            d="M 600 80 C 660 80, 660 190, 600 190 L 100 190"
            stroke="url(#return-gradient)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 4"
            markerEnd="url(#arrow-return)"
          />
        </svg>

        <div className="flex flex-col gap-14 relative z-10 py-2">
          {/* LINHA 1 */}
          <div className="flex justify-between items-start px-2">
            {steps.slice(0, 3).map((step, i) => (
              <CardStep key={step.id} step={step} showArrow={i < 2} />
            ))}
          </div>

          {/* LINHA 2 */}
          <div className="flex justify-between items-start px-2">
            {steps.slice(3, 6).map((step, i) => (
              <CardStep key={step.id} step={step} showArrow={i < 2} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Item do Card (Compacto)
const CardStep = ({ step, showArrow }: { step: any; showArrow: boolean }) => (
  <div className="flex flex-1 items-center last:flex-none">
    <div className="flex flex-col items-center text-center w-24 relative group">
      {/* Círculo */}
      <div
        className={`
        w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 shadow-md
        bg-gradient-to-br ${step.color} transition-transform duration-300 group-hover:scale-110
      `}
      >
        <step.icon size={20} strokeWidth={2.5} />
      </div>

      {/* Badge */}
      <div className="absolute -top-1 -right-1 bg-white text-[9px] font-bold text-slate-400 w-4 h-4 rounded-full flex items-center justify-center border shadow-sm">
        {step.id}
      </div>

      <h4 className="text-xs font-bold text-slate-800 leading-tight">{step.title}</h4>
      <p className="text-[10px] text-slate-500 leading-tight mt-0.5 hidden sm:block">{step.desc}</p>
    </div>

    {/* Seta simples entre itens */}
    {showArrow && (
      <div className="hidden md:flex flex-1 justify-center text-slate-200 -mt-6">
        <ArrowRight size={16} />
      </div>
    )}
  </div>
);
