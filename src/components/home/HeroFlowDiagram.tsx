import hubIcon from "@/assets/hub-icon.png";

export const HeroFlowDiagram = () => {
  return (
    <div className="flex items-center justify-center">
      <img 
        src={hubIcon} 
        alt="Hub Central de Compras" 
        className="w-48 h-48 md:w-64 md:h-64 object-contain"
      />
    </div>
  );
};
