import hubIcon from "@/assets/hub-icon.jpg";
import gmadLogo from "@/assets/gmad-logo.png";

export const HeroFlowDiagram = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Logo GMAD acima */}
      <img 
        src={gmadLogo} 
        alt="GMAD Logo" 
        className="h-16 md:h-20 object-contain"
      />
      
      {/* Hub icon de compras */}
      <img 
        src={hubIcon} 
        alt="Hub Central de Compras" 
        className="w-48 h-48 md:w-64 md:h-64 object-contain"
      />
    </div>
  );
};
