import { Building, Users, Package } from 'lucide-react';

// Componente de seta curva customizada
const CurvedArrow = ({ direction = 'down' }: { direction?: 'down' | 'up' }) => (
  <svg 
    width="40" 
    height="50" 
    viewBox="0 0 40 50" 
    className="text-primary flex-shrink-0"
  >
    <path
      d={direction === 'down' 
        ? "M5 5 Q20 25, 35 45"
        : "M5 45 Q20 25, 35 5"
      }
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      markerEnd={`url(#arrowhead-${direction})`}
    />
    <defs>
      <marker 
        id={`arrowhead-${direction}`} 
        markerWidth="10" 
        markerHeight="7" 
        refX="9" 
        refY="3.5" 
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
      </marker>
    </defs>
  </svg>
);

export const HeroFlowDiagram = () => {
  return (
    <div className="flex items-start gap-2 md:gap-3">
      {/* Círculo 1: Estabelecimento (posição superior) */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-primary/50 flex items-center justify-center shadow-lg shadow-primary/10">
          <Building className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">Estabelecimento</span>
      </div>
      
      {/* Seta Curva 1 (descendo para Central) */}
      <CurvedArrow direction="down" />
      
      {/* Círculo 2: Central (equipe, maior, posição inferior) */}
      <div className="flex flex-col items-center gap-2 mt-8 md:mt-10">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 border-2 border-primary flex items-center justify-center shadow-xl shadow-primary/20">
          <Users className="w-10 h-10 md:w-14 md:h-14 text-primary" />
        </div>
        <span className="text-xs text-primary font-semibold">Central</span>
      </div>
      
      {/* Seta Curva 2 (subindo para Compra) */}
      <CurvedArrow direction="up" />
      
      {/* Círculo 3: Compra (posição superior) */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border-2 border-primary/50 flex items-center justify-center shadow-lg shadow-primary/10">
          <Package className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground font-medium">Compra</span>
      </div>
    </div>
  );
};
