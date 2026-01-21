import { Network } from 'lucide-react';

export const HeroFlowDiagram = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Badge/Selo Corporativo - Hub Central */}
      <div className="relative">
        {/* Anel externo decorativo (rotação lenta) */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-spin" 
          style={{ animationDuration: '20s' }} 
        />
        
        {/* Anel médio */}
        <div className="absolute inset-2 rounded-full border-2 border-primary/50" />
        
        {/* Efeito Pulse/Glow pulsante */}
        <div className="absolute inset-0 rounded-full bg-primary/15 animate-pulse-glow" />
        
        {/* Círculo principal do Hub */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full 
                        bg-gradient-to-br from-zinc-600 via-zinc-700 to-zinc-800 
                        border-4 border-primary 
                        flex items-center justify-center 
                        shadow-2xl shadow-primary/30">
          <Network className="w-16 h-16 md:w-20 md:h-20 text-primary" />
        </div>
      </div>
      
      {/* Texto do selo */}
      <div className="text-center">
        <span className="text-sm md:text-base font-bold text-primary tracking-wider uppercase">
          Central de Compras
        </span>
      </div>
    </div>
  );
};
