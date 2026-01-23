import {
  PackagePlus,
  Network,
  FolderInput,
  ClipboardList,
  Search,
  Calculator,
  CheckCircle2,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";

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
    // Container mais largo (max-w-[900px]) para permitir o afastamento
    <div className="relative w-full max-w-[900px] mx-auto h-[340px] flex items-center z-20">
      {/* === CAMADA DE CONEXÕES (SVG ABSOLUTO) === */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
        viewBox="0 0 900 340"
        fill="none"
      >
        <defs>
          <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#fb923c" />
          </marker>
          <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#22c55e" />
          </marker>
        </defs>

        {/* CONEXÕES LONGAS (Cruzando o espaço vazio) */}

        {/* Laranja Ext -> Item 1 (Solicite) */}
        {/* Sai do ícone laranja (aprox X=40, Y=70) e vai até o Item 1 (aprox X=250, Y=80) */}
        <path
          d="M 60 70 C 120 70, 180 80, 230 80"
          stroke="#fb923c"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow-orange)"
          strokeDasharray="4 3"
        />

        {/* Verde Ext -> Item 4 (Aprovação) */}
        {/* Sai do ícone verde (aprox X=40, Y=270) e vai até o Item 4 (aprox X=250, Y=250) */}
        <path
          d="M 60 270 C 120 270, 180 250, 230 250"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow-green)"
          strokeDasharray="4 3"
        />
      </svg>

      {/* === ÍCONES FLUTUANTES (Esquerda - Centralizados Verticalmente) === */}
      {/* Posicionados absolutamente à esquerda e centralizados no eixo Y */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-10 z-30 hidden lg:flex">
        {/* Laranja */}
        <div className="group relative">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-orange-100 shadow-xl shadow-orange-100 flex items-center justify-center transform transition-transform group-hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
              <PackagePlus size={24} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Azul (Centro) */}
        <div className="group relative -ml-4">
          {" "}
          {/* Ligeiramente deslocado para esquerda ou direita se quiser quebrar a linha */}
          <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-100 shadow-xl shadow-blue-100 flex items-center justify-center transform transition-transform group-hover:scale-105">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
              <Network size={32} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Verde */}
        <div className="group relative">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-green-100 shadow-xl shadow-green-100 flex items-center justify-center transform transition-transform group-hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white">
              <FolderInput size={24} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* === CARD BRANCO (Direita - Mais Afastado) === */}
      {/* ml-auto empurra para a direita, w-[78%] define a largura, criando o gap na esquerda */}
      <div className="relative ml-auto w-full lg:w-[78%] bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 z-20">
        {/* SVG INTERNO (Fluxo Snake) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
          viewBox="0 0 700 280"
          fill="none"
        >
          <defs>
            <marker id="arrow-purple-round-card" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <circle cx="4" cy="4" r="3" fill="#a855f7" />
            </marker>
          </defs>

          {/* Seta de Retorno (3 -> 4) */}
          <path
            d="M 600 80 Q 660 80 660 135 Q 660 190 600 190 L 150 190 Q 90 190 90 215"
            stroke="#a855f7"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 4"
            markerEnd="url(#arrow-purple-round-card)"
            className="opacity-60"
          />
        </svg>

        <div className="flex flex-col gap-14 relative z-10">
          {/* LINHA 1 */}
          <div className="flex justify-between items-center px-2">
            <CardStep step={steps[0]} />
            <SimpleArrow />
            <CardStep step={steps[1]} />
            <SimpleArrow />
            <CardStep step={steps[2]} />
          </div>

          {/* LINHA 2 */}
          <div className="flex justify-between items-center px-2">
            <CardStep step={steps[3]} />
            <SimpleArrow />
            <CardStep step={steps[4]} />
            <SimpleArrow />
            <CardStep step={steps[5]} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Seta Simples
const SimpleArrow = () => (
  <div className="flex-1 h-[2px] bg-slate-100 relative mx-3 hidden md:block">
    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[1px]">
      <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L6 5L0 10V0Z" fill="#f1f5f9" />
      </svg>
    </div>
  </div>
);

// Item do Card
const CardStep = ({ step }: { step: any }) => (
  <div className="flex flex-col items-center text-center w-28 relative group z-30">
    <div
      className={`
      w-14 h-14 rounded-full flex items-center justify-center text-white mb-3 shadow-md
      bg-gradient-to-br ${step.color} transition-transform duration-300 group-hover:scale-105 ring-4 ring-white
    `}
    >
      <step.icon size={22} strokeWidth={2} />
    </div>

    <div className="absolute -top-2 -right-1 bg-white text-[10px] font-bold text-slate-400 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm z-40">
      {step.id}
    </div>

    <h4 className="text-sm font-bold text-slate-800 leading-tight">{step.title}</h4>
    <p className="text-[10px] text-slate-500 leading-tight mt-1 font-medium hidden sm:block">{step.desc}</p>
  </div>
);
