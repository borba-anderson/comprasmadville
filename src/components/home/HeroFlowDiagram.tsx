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
    <div className="relative w-full max-w-[800px] mx-auto h-[380px] lg:h-[320px] flex items-center">
      {/* CAMADA DE CONEXÕES (SVG ABSOLUTO) */}
      {/* Esta camada desenha todas as setas por trás dos elementos */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
        viewBox="0 0 800 320"
        fill="none"
      >
        <defs>
          {/* Marcadores de Flecha (Arrowheads) */}
          <marker id="arrow-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#94a3b8" />
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
          <marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 Z" fill="#a855f7" />
          </marker>
        </defs>

        {/* --- CONEXÕES EXTERNAS (Ícones Flutuantes) --- */}

        {/* 1. Laranja Ext -> Azul Ext (Curva Suave) */}
        <path
          d="M 60 70 Q 60 110 90 130"
          stroke="#fb923c"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow-orange)"
          strokeDasharray="4 2"
        />

        {/* 2. Azul Ext -> Verde Ext (Curva Suave) */}
        <path
          d="M 90 190 Q 60 210 60 250"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow-blue)"
          strokeDasharray="4 2"
        />

        {/* 3. Laranja Ext -> Card Item 1 (Entrada no Processo) */}
        <path d="M 85 50 Q 180 50 210 70" stroke="#fb923c" strokeWidth="3" fill="none" markerEnd="url(#arrow-orange)" />

        {/* 4. Verde Ext -> Card Item 4 (Entrada na Aprovação) */}
        {/* Seta pontilhada verde entrando pela esquerda do item 4 */}
        <path
          d="M 85 270 L 190 270"
          stroke="#22c55e"
          strokeWidth="3"
          fill="none"
          strokeDasharray="6 4"
          markerEnd="url(#arrow-green)"
        />

        {/* --- CONEXÕES INTERNAS (Dentro do Card) --- */}

        {/* Linha 1: 1->2 e 2->3 */}
        <path d="M 280 90 L 380 90" stroke="#e2e8f0" strokeWidth="2" markerEnd="url(#arrow-gray)" />
        <path d="M 460 90 L 560 90" stroke="#e2e8f0" strokeWidth="2" markerEnd="url(#arrow-gray)" />

        {/* O GRANDE RETORNO: 3 -> 4 (Snake Line) */}
        {/* Sai do 3, faz uma curva larga pela direita, volta pelo meio e entra no topo do 4 */}
        <path
          d="M 640 90 C 720 90, 720 180, 640 180 L 250 180 Q 220 180 220 220"
          stroke="#a855f7"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6 4"
          markerEnd="url(#arrow-purple)"
        />

        {/* Linha 2: 4->5 e 5->6 */}
        <path d="M 280 270 L 380 270" stroke="#e2e8f0" strokeWidth="2" markerEnd="url(#arrow-gray)" />
        <path d="M 460 270 L 560 270" stroke="#e2e8f0" strokeWidth="2" markerEnd="url(#arrow-gray)" />
      </svg>

      {/* --- ÍCONES FLUTUANTES (Esquerda - Posição Absoluta) --- */}
      <div className="absolute left-0 top-0 h-full w-[120px] z-20 hidden lg:flex flex-col justify-between py-8">
        {/* Laranja (Solicitante) */}
        <div className="relative left-2 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20 flex items-center justify-center text-white border-4 border-white transform transition-transform group-hover:scale-105">
            <ClipboardList size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Azul (Analista - Maior e Deslocado) */}
        <div className="relative left-8 group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/30 flex items-center justify-center text-white border-4 border-white transform transition-transform group-hover:scale-105">
            <Search size={36} strokeWidth={2.5} />
          </div>
        </div>

        {/* Verde (Aprovador) */}
        <div className="relative left-2 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/20 flex items-center justify-center text-white border-4 border-white transform transition-transform group-hover:scale-105">
            <CheckCircle2 size={28} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* --- CARD BRANCO (Direita) --- */}
      <div className="relative ml-auto w-full lg:w-[85%] bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 z-10">
        <div className="flex flex-col gap-12">
          {" "}
          {/* Gap vertical aumentado para caber a linha de retorno */}
          {/* LINHA 1 */}
          <div className="flex justify-around items-start pl-4">
            {steps.slice(0, 3).map((step) => (
              <CardStep key={step.id} step={step} />
            ))}
          </div>
          {/* LINHA 2 */}
          <div className="flex justify-around items-start pl-4">
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
  <div className="flex flex-col items-center text-center w-24 relative group z-10">
    <div
      className={`
      w-14 h-14 rounded-full flex items-center justify-center text-white mb-2 shadow-md
      bg-gradient-to-br ${step.color} transition-transform duration-300 group-hover:scale-110
    `}
    >
      <step.icon size={24} strokeWidth={2.5} />
    </div>

    <div className="absolute -top-1 -right-1 bg-white text-[10px] font-bold text-slate-400 w-5 h-5 rounded-full flex items-center justify-center border shadow-sm">
      {step.id}
    </div>

    <h4 className="text-sm font-bold text-slate-800 leading-tight">{step.title}</h4>
    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{step.desc}</p>
  </div>
);
