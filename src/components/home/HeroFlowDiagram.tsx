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
        {/* Linhas de conexão (laranja/primary) */}
        <path 
          d="M12 12L5.5 5.5M12 12L18.5 5.5M12 12L5.5 18.5M12 12L18.5 18.5M12 12V3M12 12V21" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        
        {/* Nó central (verde/accent) */}
        <rect 
          x="9" y="9" width="6" height="6" rx="1" 
          fill="hsl(var(--accent))" 
        />
        
        {/* Nós externos (verde/accent) */}
        <rect x="3" y="3" width="5" height="5" rx="1" fill="hsl(var(--accent))" />
        <rect x="16" y="3" width="5" height="5" rx="1" fill="hsl(var(--accent))" />
        <rect x="3" y="16" width="5" height="5" rx="1" fill="hsl(var(--accent))" />
        <rect x="16" y="16" width="5" height="5" rx="1" fill="hsl(var(--accent))" />
        <rect x="9.5" y="0" width="5" height="5" rx="1" fill="hsl(var(--accent))" />
        <rect x="9.5" y="19" width="5" height="5" rx="1" fill="hsl(var(--accent))" />
      </svg>
    </div>
  );
};
