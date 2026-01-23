import { ClipboardList, Search, CheckCircle2, Calculator, ShoppingCart, PackageCheck, ArrowRight } from 'lucide-react';

export const HeroFlowDiagram = () => {
  // Dados dos passos
  const steps = [
    { id: "1", icon: ClipboardList, title: "Solicite", desc: "Preencha a necessidade.", color: "from-orange-400 to-orange-500" },
    { id: "2", icon: Search, title: "Análise", desc: "Revisão técnica.", color: "from-blue-400 to-blue-600" },
    { id: "3", icon: Calculator, title: "Cotação", desc: "Busca de preços.", color: "from-purple-400 to-purple-600" },
    { id: "4", icon: CheckCircle2, title: "Aprovação", desc: "Validação da gestão.", color: "from-green-400 to-green-600" },
    { id: "5", icon: ShoppingCart, title: "Compra", desc: "Pedido emitido.", color: "from-cyan-400 to-cyan-600" },
    { id: "6", icon: PackageCheck, title: "Entrega", desc: "Recebimento fiscal.", color: "from-emerald-400 to-emerald-600" }
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
          <svg className="absolute top-1/2 left-full w-16 h-12 -z-10 text-orange-300" viewBox="0 0 60 40" fill="none" style={{ transform: 'translate(-5px, -15px)' }}>
             <path d="M 0 20 Q 30 20 50 10" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow-orange)" />
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
          <svg className="absolute top-full left-1/2 w-12 h-16 -z-10 text-blue-300" viewBox="0 0 40 60" fill="none" style={{ transform: 'translate(-10px, -5px)' }}>
             <path d="M 20 0 Q 20 30 0 50" stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)" />
             <defs>
               <marker id="arrow-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
