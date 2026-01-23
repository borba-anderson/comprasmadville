import {
  // Novos ícones para o Hub externo
  PackagePlus,
  Network,
  FolderInput,
  // Ícones do fluxo interno
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
    <div className="relative w-full max-w-[800px] mx-auto h-[380px] lg:h-[320px] flex items-center z-20">
      {/* CAMADA DE CONEXÕES (SVG ABSOLUTO) - Ajustada */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
        viewBox="0 0 800 320"
        fill="none"
      >
        <defs>
          {/* Marcadores de Flecha */}
          <marker id="arrow-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#cbd5e1" />
          </marker>
          <marker id="arrow-orange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#fb923c" />
          </marker>
          <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#3b82f6" />
          </marker>
          <marker id="arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#22c55e" />
          </marker>
          <marker id="arrow-purple-round" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <circle cx="4" cy="4" r="3" fill="#a855f7" />
          </marker>
        </defs>

        {/* --- CONEXÕES EXTERNAS (Do Hub para o Card) --- */}
        {/* Laranja Ext -> Entrada Card (Item 1) */}
        <path
          d="M 85 50 Q 150 50 190 75"
          stroke="#fb923c"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow-orange)"
          strokeDasharray="4 2"
        />
        {/* Azul Ext -> Centro Card (Item 2) */}
        <path
          d="M 110 160 Q 250 160 350 110"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow-blue)"
          strokeDasharray="4 2"
          opacity="0.6"
        />
        {/* Verde Ext -> Entrada Aprovação (Item 4) */}
        <path
          d="M 85 270 Q 150 270 190 245"
          stroke="#22c55e"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow-green)"
          strokeDasharray="4 2"
        />

        {/* --- CONEXÕES INTERNAS (Corrigidas) --- */}
        {/* Linha 1: 1->2 e 2->3 (Cinza) */}
        <path d="M 300 90 L 380 90" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-gray)" />
        <path d="M 460 90 L 540 90" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-gray)" />

        {/* O RETORNO: 3 -> 4 (Roxo Pontilhado - "Snake") */}
        {/* Sai da direita do 3, faz a curva larga, volta pela esquerda e entra no topo do 4 */}
        <path
          d="M 620 90 Q 680 90 680 135 Q 680 180 620 180 L 320 180 Q 260 180 260 210"
          stroke="#a855f7"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
          markerEnd="url(#arrow-purple-round)"
          className="animate-pulse"
          style={{ animationDuration: "3s" }}
        />

        {/* Linha 2: 4->5 e 5->6 (Cinza) */}
        <path d="M 300 230 L 380 230" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-gray)" />
        <path d="M 460 230 L 540 230" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-gray)" />
      </svg>

      {/* --- ÍCONES FLUTUANTES (Novos Ícones de Hub/Portal) --- */}
      <div className="absolute left-0 top-0 h-full w-[120px] z-30 hidden lg:flex flex-col justify-between py-8">
        {/* Laranja: PackagePlus (Múltiplas Solicitações) */}
        <div className="relative left-2 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20 flex items-center justify-center text-white border-4 border-white transform transition-transform group-hover:scale-105">
            <PackagePlus size={28} strokeWidth={2} />
          </div>
        </div>

        {/* Azul: Network (O Hub Central) */}
        <div className="relative left-8 group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border-4 border-white transform transition-transform group-hover:scale-105">
            <Network size={36} strokeWidth={2} />
          </div>
        </div>

        {/* Verde: FolderInput (Entrada no Fluxo) */}
        <div className="relative left-2 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/20 flex items-center justify-center text-white border-4 border-white transform transition-transform group-hover:scale-105">
            <FolderInput size={28} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* --- CARD BRANCO (Direita) --- */}
      <div className="relative ml-auto w-full lg:w-[85%] bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 z-20">
        <div className="flex flex-col gap-16">
          {/* LINHA 1 */}
          <div className="flex justify-around items-start pl-6 pr-6">
            {steps.slice(0, 3).map((step) => (
              <CardStep key={step.id} step={step} />
            ))}
          </div>

          {/* LINHA 2 */}
          <div className="flex justify-around items-start pl-6 pr-6">
            {steps.slice(3, 6).map((step) => (
              <CardStep key={step.id} step={step} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Item do Card
const CardStep = ({ step }: { step: any }) => (
  <div className="flex flex-col items-center text-center w-28 relative group z-30">
    <div
      className={`
      w-16 h-16 rounded-full flex items-center justify-center text-white mb-3 shadow-md
      bg-gradient-to-br ${step.color} transition-transform duration-300 group-hover:scale-105 ring-4 ring-white
    `}
    >
      <step.icon size={26} strokeWidth={2} />
    </div>

    <div className="absolute -top-1 -right-1 bg-white text-[10px] font-bold text-slate-500 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm z-40">
      {step.id}
    </div>

    <h4 className="text-sm font-bold text-slate-800 leading-tight">{step.title}</h4>
    <p className="text-[11px] text-slate-500 leading-tight mt-1 font-medium">{step.desc}</p>
  </div>
);
