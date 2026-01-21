export const HeroFlowDiagram = () => {
  return (
    <div className="flex items-center justify-center">
      {/* Custom Network Icon - Quadrados em verde, linhas em laranja */}
      <svg 
        className="w-24 h-24 md:w-32 md:h-32" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Linhas de conexão (laranja - mais finas) */}
        <path 
          d="M12 12L5.5 5.5M12 12L18.5 5.5M12 12L5.5 18.5M12 12L18.5 18.5M12 12V3M12 12V21" 
          stroke="#F97316" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
        
        {/* Nó central (verde - maior) */}
        <rect 
          x="8" y="8" width="8" height="8" rx="1.5" 
          fill="#22915A" 
        />
        
        {/* Nós externos (verde - maiores) */}
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#22915A" />
        <rect x="16" y="1" width="7" height="7" rx="1.5" fill="#22915A" />
        <rect x="1" y="16" width="7" height="7" rx="1.5" fill="#22915A" />
        <rect x="16" y="16" width="7" height="7" rx="1.5" fill="#22915A" />
        <rect x="8.5" y="-1" width="7" height="7" rx="1.5" fill="#22915A" />
        <rect x="8.5" y="18" width="7" height="7" rx="1.5" fill="#22915A" />
      </svg>
    </div>
  );
};
