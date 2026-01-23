import { ClipboardList, Search, CheckCircle2, Calculator, ShoppingCart, PackageCheck, ArrowRight } from "lucide-react";

export const HeroFlowDiagram = () => {
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
    <div className="relative flex flex-col lg:flex-row items-center justify-center lg:justify-end gap-8 w-full max-w-5xl">
      {/* === LADO ESQUERDO: ÍCONES FLUTUANTES CONECTADOS === */}
      {/* Apenas visível em telas grandes */}
      <div className="hidden xl:flex flex-col gap-8 relative z-20 mr-[-40px] mt-8">
        {/* Ícone 1: Laranja */}
        <div className="relative group z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl shadow-orange-500/30 flex items-center justify-center text-white border-4 border-white transition-transform group-hover:scale-105">
            <ClipboardList size={32} strokeWidth={2.5} />
          </div>

          {/* Seta 1: Laranja -> Azul */}
          <svg
            className="absolute top-[80%] left-[50%] w-16 h-16 -z-10 text-orange-300"
            viewBox="0 0 50 50"
            fill="none"
          >
            {/* Curva saindo de baixo e indo para a direita (blue) */}
            <path
              d="M 10 0 Q 10 25 40 40"
              stroke="currentColor"
              strokeWidth="3"
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

        {/* Ícone 2: Azul (Deslocado para a direita) */}
        <div className="relative group z-10 ml-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border-4 border-white transition-transform group-hover:scale-105">
            <Search size={40} strokeWidth={2.5} />
          </div>

          {/* Seta 2: Azul -> Verde */}
          <svg className="absolute top-[80%] right-[50%] w-16 h-16 -z-10 text-blue-300" viewBox="0 0 50 50" fill="none">
            {/* Curva saindo de baixo e voltando para a esquerda (green) */}
            <path
              d="M 40 0 Q 40 25 10 40"
              stroke="currentColor"
              strokeWidth="3"
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

        {/* Ícone 3: Verde */}
        <div className="relative group z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl shadow-green-500/30 flex items-center justify-center text-white border-4 border-white transition-transform group-hover:scale-105">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>

          {/* Seta 3: Verde -> Card (Indicando entrada) */}
          <svg className="absolute top-[30%] left-[90%] w-24 h-12 -z-10 text-green-300" viewBox="0 0 60 30" fill="none">
            <path
              d="M 0 15 L 50 15"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray="4 4"
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

      {/* === LADO DIREITO: CARD DO FLUXO === */}
      <div className="relative bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 z-10 w-full max-w-2xl">
        {/* SVG DA SETA DE RETORNO (3 -> 4) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
          viewBox="0 0 600 300"
          fill="none"
        >
          <defs>
            <linearGradient id="return-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" /> {/* Roxo */}
              <stop offset="100%" stopColor="#22c55e" /> {/* Verde */}
            </linearGradient>
            <marker id="arrow-return" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill="#22c55e" />
            </marker>
          </defs>

          {/* Caminho: Sai do item 3 (direita), desce, volta tudo para a esquerda e sobe para o item 4 */}
          {/* Ajuste as coordenadas conforme necessário para alinhar com seus ícones */}
          <path
            d="M 550 90 C 620 90, 620 200, 550 200 L 90 200 C 60 200, 60 230, 90 230"
            pathLength="1"
            className="opacity-0"
          />
          {/* Vamos usar um caminho simples de retorno: Direita Cima -> Esquerda Baixo */}
          <path
            d="M 550 120 C 550 180, 50 160, 50 210"
            stroke="url(#return-gradient)"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrow-return)"
            strokeDasharray="8 4"
            className="opacity-60"
          />
        </svg>

        <div className="flex flex-col gap-16 relative z-10">
          {/* LINHA 1 (1 -> 2 -> 3) */}
          <div className="flex justify-between items-start">
            {steps.slice(0, 3).map((step, i) => (
              <CardStep key={step.id} step={step} showArrow={i < 2} />
            ))}
          </div>

          {/* LINHA 2 (4 -> 5 -> 6) */}
          <div className="flex justify-between items-start">
            {steps.slice(3, 6).map((step, i) => (
              <CardStep key={step.id} step={step} showArrow={i < 2} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Interno do Card
const CardStep = ({ step, showArrow }: { step: any; showArrow: boolean }) => (
  <div className="flex flex-1 items-center last:flex-none">
    <div className="flex flex-col items-center text-center w-28 relative group">
      {/* Círculo */}
      <div
        className={`
        w-14 h-14 rounded-full flex items-center justify-center text-white mb-3 shadow-md
        bg-gradient-to-br ${step.color} transition-transform duration-300 group-hover:scale-110
      `}
      >
        <step.icon size={22} strokeWidth={2.5} />
      </div>

      {/* Badge */}
      <div className="absolute -top-1 -right-1 bg-white text-[10px] font-bold text-slate-400 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm">
        {step.id}
      </div>

      <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
      <p className="text-[11px] text-slate-500 leading-tight mt-1">{step.desc}</p>
    </div>

    {/* Seta horizontal simples entre 1-2 e 2-3 */}
    {showArrow && (
      <div className="hidden md:flex flex-1 justify-center text-slate-200 -mt-8">
        <ArrowRight size={20} />
      </div>
    )}
  </div>
);
